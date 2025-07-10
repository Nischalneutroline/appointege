// lib/embedding.ts
import { OpenAIEmbeddings } from '@langchain/openai'
import dotenv from 'dotenv/config'
// lib/logger.ts
import winston from 'winston'

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/app.log' }),
    new winston.transports.Console(),
  ],
})

export default logger

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: 'text-embedding-ada-002',
})

export async function generateServiceEmbedding(service: {
  title: string
  description: string
  estimatedDuration: number
}) {
  try {
    const content =
      `${service.title} ${service.description} Duration: ${service.estimatedDuration} minutes`.trim()
    logger.info(`Generating embedding for content: ${content}`)
    const start = Date.now()
    const vector = await embeddings.embedQuery(content)
    logger.info(
      `Embedding generated in ${Date.now() - start}ms, vector length: ${vector.length}`,
    )
    console.log(`Embedding generated for service: ${service.title}`)
    console.log(`Vector sample: ${vector}`) // Log first 5 elements of the vector for debugging
    return { content, vector }
  } catch (error) {
    logger.error(
      `Failed to generate embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    throw error
  }
}

async function testEmbedding() {
  try {
    const service = {
      title: 'Dental Cleaning',
      description: 'Routine cleaning',
      estimatedDuration: 60,
    }
    const { content, vector } = await generateServiceEmbedding(service)
    logger.info(
      `Success: Content: ${content}, Vector sample: ${vector.slice(0, 5)}...`,
    )
  } catch (error) {
    logger.error(
      `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    process.exit(1)
  }
}

testEmbedding()
