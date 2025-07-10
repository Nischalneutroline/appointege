import { OpenAIEmbeddings } from '@langchain/openai'
import logger from '@/lib/logger'
import dotenv from 'dotenv'
import { prisma } from '../prisma'

dotenv.config()

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
    logger.info(`Generating embedding for service content: ${content}`)
    const start = Date.now()
    const vector = await embeddings.embedQuery(content)
    logger.info(`Service embedding generated`, {
      durationMs: Date.now() - start,
      vectorLength: vector.length,
      vectorSample: vector.slice(0, 5),
    })
    return { content, vector }
  } catch (error) {
    logger.error(
      `Failed to generate service embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    throw error
  }
}

export async function generateAppointmentEmbedding(appointment: {
  customerName: string
  email: string
  serviceId: string
  selectedDate: string
  selectedTime: string
  message: string
}) {
  try {
    const service = await prisma.service.findUnique({
      where: { id: appointment.serviceId },
      select: { title: true, description: true, estimatedDuration: true },
    })
    if (!service) {
      throw new Error('Service not found')
    }
    const content =
      `Customer: ${appointment.customerName}, Email: ${appointment.email}, Service: ${service.title}, Description: ${service.description}, Date: ${appointment.selectedDate}, Time: ${appointment.selectedTime}, Message: ${appointment.message}`.trim()
    logger.info(`Generating embedding for appointment content: ${content}`)
    const start = Date.now()
    const vector = await embeddings.embedQuery(content)
    logger.info(`Appointment embedding generated`, {
      durationMs: Date.now() - start,
      vectorLength: vector.length,
      vectorSample: vector.slice(0, 5),
    })
    return { content, vector }
  } catch (error) {
    logger.error(
      `Failed to generate appointment embedding: ${error instanceof Error ? error.message : 'Unknown error'}`,
    )
    throw error
  }
}
