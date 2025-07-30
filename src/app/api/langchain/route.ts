import { NextRequest, NextResponse } from 'next/server'
import { ChatOpenAI } from '@langchain/openai'
import { createRetrievalChain } from 'langchain/chains/retrieval'
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents'
import { createHistoryAwareRetriever } from 'langchain/chains/history_aware_retriever'
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts'
import { PrismaClient } from '@prisma/client'
import { OpenAIEmbeddings } from '@langchain/openai'
import { Document } from '@langchain/core/documents'
import pg from 'pg'
import { RunnableLambda } from '@langchain/core/runnables'
import { OllamaEmbeddings } from '@langchain/ollama'
import {
  isAppointmentHistoryQuery,
  handleAppointmentHistoryQuery,
} from '@/features/chatbot/appointmentHistory'

import {
  getConversationState,
  handleAgentConversationFlow,
} from '@/features/chatbot/conversationState'
import { auth } from '@/auth'

const prisma = new PrismaClient()

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    // Check if the session exists and has a user property
    if (!session || !session.user) {
      // Handle unauthenticated requests
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 },
      )
    }

    // Now you can safely destructure or access the user object
    const { user } = session

    const { messages }: { messages: any[] } = await req.json()

    // Get user and role

    const chat_history = messages.slice(0, -1)
    const userMessage = messages[messages.length - 1]?.content || 'Hello!'

    // 1. Check if user is asking for appointment history
    if (isAppointmentHistoryQuery(userMessage)) {
      console.log('history')
      const result = await handleAppointmentHistoryQuery(
        user,
        userMessage,
        user.id,
      )
      return NextResponse.json(result)
    }

    const state = await getConversationState(user.id)

    const flowResult = await handleAgentConversationFlow({
      user,
      user.id,
      userMessage,
      state,
    })

    // Setup vector store (using pgvector)
    /*  const embeddings = new OpenAIEmbeddings({
      apiKey: process.env.OPENAI_API_KEY,
      model: "text-embedding-3-small",
    }); */

    // Use Ollama for embeddings in dev
    /* const embeddings = new OllamaEmbeddings({
      model: 'mxbai-embed-large', // or another supported embedding model
      baseUrl: 'http://localhost:11434', // default Ollama endpoint
    }) */

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: 'text-embedding-3-small',
      dimensions: 1024,
    })

    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })

    // 1. Generate the embedding for your query string
    const queryEmbedding = await embeddings.embedQuery(userMessage)

    // 2. Format the embedding as a vector string for SQL
    const embeddingStr = `[${queryEmbedding.join(',')}]`

    // 3. Run the raw SQL similarity search
    /*  const client = await pool.connect()
    let docs = []
    try {
      const sql = `
     SELECT id, content, metadata, embedding <-> $1::vector AS distance
      FROM "Document"
     WHERE (
      (metadata->>'selectedDate') IS NULL       -- docs with no selectedDate, e.g., services, FAQs
    OR
    (source = 'appointment' AND (metadata->>'selectedDate')::date >= $2::date)  -- only future appointments
      )
     `
      const result = await client.query(sql, [embeddingStr])
      docs = result.rows.map((row) => ({
        id: row.id,
        pageContent: row.content,
        metadata: row.metadata,
        distance: row.distance,
      }))
    } finally {
      client.release()
    }
 */
    const client = await pool.connect()
    let docs = []
    try {
      const sql = `
     SELECT id, content, metadata, embedding <-> $1::vector AS distance
      FROM "Document"
      ORDER BY distance
     LIMIT 20;
     `
      const result = await client.query(sql, [embeddingStr])
      docs = result.rows.map((row) => ({
        id: row.id,
        pageContent: row.content,
        metadata: row.metadata,
        distance: row.distance,
      }))
    } finally {
      client.release()
    }

    // 3. Inject the booking confirmation, if any
    if (flowResult) {
      if (flowResult instanceof NextResponse) return flowResult

      if (flowResult.bookingConfirmation) {
        docs.unshift({
          id: 'booking-confirmation',
          pageContent: `🎉 The appointment has been booked!`, // Your message or use booking details
          metadata: { source: 'booking_confirmation' },
          distance: 0, // 0 = "most relevant" vs others from vector search
        })
      }
    }

    /*  Role-based retriever */
    const roleBasedRetriever = RunnableLambda.from(async (query: string) => {
      console.log('docs is', user.role)
      if (user.role === 'USER') {
        const filteredDocs: Document[] = []
        let userHasAppointments = false
        for (const doc of docs) {
          if (!doc.metadata.appointmentId) {
            filteredDocs.push(doc)
          } else {
            /*      Appointment doc: only allow if user is involved */
            const appointment = await prisma.appointment.findUnique({
              where: { id: doc.metadata.appointmentId },
              select: { userId: true, bookedById: true },
            })
            if (
              appointment?.userId === user.id ||
              appointment?.bookedById === user.id
            ) {
              filteredDocs.push(doc)
              userHasAppointments = true
            }
          }
        }
        /*   ... (add "no appointments" message if needed) */
        if (
          !userHasAppointments &&
          query.toLowerCase().includes('appointment')
        ) {
          filteredDocs.push(
            new Document({
              pageContent:
                'You have no scheduled appointments. Please book an appointment to get started.',
              metadata: { source: 'system' },
            }),
          )
        }
        return filteredDocs
      }
      return docs
    })

    // LLM setup
    /*   const llm = new ChatOpenAI({
      model: 'deepseek/deepseek-r1:free',
      openAIApiKey: process.env.DEEPSEEK_API_KEY,
      configuration: { baseURL: 'https://openrouter.ai/api/v1' },
      temperature: 0,
      streaming: false,
    })
 */
    const llm = new ChatOpenAI({
      model: 'gpt-4o-mini',
      openAIApiKey: process.env.OPENAI_API_KEY,
      temperature: 0,
      streaming: false,
      callbacks: [
        {
          handleLLMEnd(output) {
            console.log('LLM Token Usage:', output)
          },
        },
      ],
    })

    // History-aware retriever
    const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'Given a chat history and the latest user question which might reference context in the chat history, formulate a standalone question which can be understood without the chat history. Do NOT answer the question, just reformulate it if needed and otherwise return it as is.',
      ],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ])
    const historyAwareRetriever = await createHistoryAwareRetriever({
      llm,
      retriever: roleBasedRetriever,
      rephrasePrompt: contextualizeQPrompt,
    })

    // QA Chain
    /*  const qaPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a helpful assistant for a booking and appointment system. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Keep the answer concise and helpful.\n\nContext: {context}`,
      ],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ])
    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: qaPrompt,
    })
 */
    const qaPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        `You are a friendly, engaging, and delightful virtual assistant for a booking and appointment system. 
    Use the provided information and chat history to answer user questions in a warm, conversational, and occasionally playful tone. 
    Engage the user, ask follow-up questions if relevant, and celebrate their milestones (like successful bookings) with uplifting encouragement.
    If you don't know the answer, admit it honestly but keep it positive.
    Do **not** confirm an appointment as booked unless you are explicitly told it has been booked.
    Answers should always be clear, fun, and helpful. 

    Context: {context}
    `,
      ],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
    ])

    const questionAnswerChain = await createStuffDocumentsChain({
      llm,
      prompt: qaPrompt,
    })

    // Retrieval chain
    const ragChain = await createRetrievalChain({
      retriever: historyAwareRetriever,
      combineDocsChain: questionAnswerChain,
    })

    // Invoke
    const result = await ragChain.invoke({
      input: userMessage,
      chat_history: chat_history,
    })

    return NextResponse.json({
      answer: result.answer,
      sources: result.context?.map((doc: Document) => ({
        content: doc.pageContent.substring(0, 200) + '...',
        source: doc.metadata.source || 'system',
      })),
    })
  } catch (error: any) {
    console.error('RAG Chain Error:', error)
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 500 },
    )
  } finally {
    await prisma.$disconnect()
  }
}
