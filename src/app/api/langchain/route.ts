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

import { handleAgentConversationFlow } from '@/features/chatbot/conversationState'
import { auth } from '@/auth'
import { createOpenAIFunctionsAgent, AgentExecutor } from 'langchain/agents'
import { getTools } from '@/features/chatbot/agentTool'
import { createToolCallingAgent } from 'langchain/agents'
import { BookAppointmentInput } from '@/features/chatbot/agentTool'

const prisma = new PrismaClient()

type User = {
  id: string
  role: string
  email?: string
}

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

    if (!user.id) {
      return NextResponse.json(
        { message: 'User ID is missing' },
        { status: 400 },
      )
    }

    if (!user.email) {
      return NextResponse.json(
        { message: 'User email is missing' },
        { status: 400 },
      )
    }

    if (!user.role) {
      return NextResponse.json(
        { message: 'User role is missing' },
        { status: 400 },
      )
    }
    const { messages }: { messages: any[] } = await req.json()

    // Get user and role

    /*     const chat_history = messages.slice(0, -1) */

    // Limit to the last 6 (before the latest message):
    const HISTORY_LENGTH = 6
    const chat_history = messages.slice(
      Math.max(0, messages.length - (HISTORY_LENGTH + 1)),
      messages.length - 1,
    )
    const userMessage = messages[messages.length - 1]?.content || 'Hello!'

    // 1. Check if user is asking for appointment history
    if (isAppointmentHistoryQuery(userMessage)) {
      console.log('history')
      const result = await handleAppointmentHistoryQuery(
        user as User,
        userMessage,
        user.id,
      )
      return NextResponse.json(result)
    }

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
    // it showed error while trying to exclude  the past appointment
    /* const client = await pool.connect()
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
    } */

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

    const systemPrompt = ChatPromptTemplate.fromMessages([
      [
        'system',
        'You are a helpful appointment assistant. Only invoke tools if the user clearly wants to book, cancel, or update an appointment. Otherwise answer conversationally.',
      ],
      new MessagesPlaceholder('agent_scratchpad'), // <-- THIS IS REQUIRED!
      ['human', '{input}'], // <-- {input} is also required
    ])

    const tools = getTools(user.id, user.role)

    // AGENT INITIALIZATION
    const agent = createToolCallingAgent({
      llm,
      tools,
      prompt: systemPrompt,
    })

    // Step 3: Wrap with an AgentExecutor
    const agentExecutor = AgentExecutor.fromAgentAndTools({
      agent,
      tools,
      returnIntermediateSteps: true,
      maxIterations: 1,
    })

    const agentResult = await agentExecutor.invoke({ input: userMessage })

    // -- Check if agent used a tool (you might need to adjust this to your LangChain version) --
    const toolTriggered =
      agentResult?.intermediateSteps && agentResult.intermediateSteps.length > 0

    if (toolTriggered) {
      // Show the last tool observation, not just the first!
      const lastStep =
        agentResult.intermediateSteps[agentResult.intermediateSteps.length - 1]
      let obs = lastStep.observation

      // Parse the observation if it's a JSON string
      try {
        if (typeof obs === 'string' && obs.trim().startsWith('{'))
          obs = JSON.parse(obs)
      } catch (e) {}

      // If it's a booking confirmation, let the LLM rephrase it
      if (obs && typeof obs === 'object' && obs.bookingConfirmation) {
        const prompt = `The booking tool has confirmed this appointment:
            ${JSON.stringify(obs.bookingData, null, 2)}
        Please write a warm, friendly, and celebratory chat message to the user, clearly confirming all the important appointment details.`
        // Use your LLM (same as used for the chain) to rephrase
        const llmResponse = await llm.invoke(prompt)
        const answer =
          typeof llmResponse === 'string'
            ? llmResponse
            : llmResponse.content || JSON.stringify(llmResponse)
        return NextResponse.json({ answer })
      }

      // Otherwise: fallback to direct output or error
      return NextResponse.json({
        answer: typeof obs === 'string' ? obs : JSON.stringify(obs),
      })
    } else {
      // No action, answer with RAG knowledge/FAQ etc
      console.log('❌ Agent did NOT trigger any tool.')
      const ragResult = await ragChain.invoke({
        input: userMessage,
        chat_history,
      })
      return NextResponse.json({
        answer: ragResult.answer,
        sources: ragResult.context?.map((doc: Document) => ({
          content: doc.pageContent.substring(0, 200) + '...',
          source: doc.metadata.source || 'system',
        })),
      })
    }
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
