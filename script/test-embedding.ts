// scripts/test-embedding.ts
import logger from '@/lib/logger'
import { OpenAIEmbeddings } from '@langchain/openai'

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
