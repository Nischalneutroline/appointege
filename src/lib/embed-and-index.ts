import { OllamaEmbeddings } from '@langchain/ollama'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { prisma } from '@/lib/prisma'
import { v4 as uuidv4 } from 'uuid'
import type { Appointment as PrismaAppointment, Service } from '@prisma/client'

// Single appointment embedding/indexing
export async function embedAndIndexAppointment(
  appointment: PrismaAppointment & {
    service?: { title?: string } | null
    user?: { email?: string } | null
  },
  { overwrite = true } = {},
) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  // Delete old docs for this appointment, if updating
  if (overwrite) {
    await prisma.document.deleteMany({
      where: { appointmentId: appointment.id },
    })
  }

  // Generate embedding for each chunk
  const embeddings = new OllamaEmbeddings({
    model: 'mxbai-embed-large',
    baseUrl: 'http://localhost:11434',
  })

  // Prepare content
  const dateStr = appointment.selectedDate.toISOString().split('T')[0]
  const content = `Appointment for ${appointment.service?.title || 'service'} on ${dateStr} ${appointment.selectedTime} by user email: ${appointment.email || appointment.user?.email}, name: ${appointment.customerName}, phone: ${appointment.phone}`
  const chunks = await splitter.splitText(content)
  const accessLevel = ['USER', 'ADMIN', 'SUPER_ADMIN']

  for (const chunk of chunks) {
    const id = uuidv4()
    const embedding = await embeddings.embedQuery(chunk)
    await prisma.$executeRaw`
  INSERT INTO "Document" ("id", "content", "accessLevel", "appointmentId", "source", "embedding", "metadata")
  VALUES (${id}, ${chunk}, ${accessLevel}::"Role"[], ${appointment.id}, 'appointment', ${embedding}::vector,  ${JSON.stringify(
    {
      appointmentId: appointment.id,
      userId: appointment.userId,
      bookedById: appointment.bookedById,
      serviceId: appointment.serviceId,
      selectedDate: dateStr,
      selectedTime: appointment.selectedTime,
      source: 'appointment',
      accessLevel,
    },
  )}::jsonb )
`
  }
}

// Single service embedding/indexing
export async function embedAndIndexService(
  service: Service,
  { overwrite = true } = {},
) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })

  if (overwrite) {
    await prisma.document.deleteMany({
      where: { serviceId: service.id, source: 'service' },
    })
  }

  const fullService = await prisma.service.findUnique({
    where: { id: service.id },
    include: { serviceAvailability: { include: { timeSlots: true } } },
  })
  if (!fullService) throw new Error('Service not found for embedding/indexing.')

  for (const avail of fullService.serviceAvailability ?? []) {
    const slots = (avail.timeSlots ?? [])
      .map((slot) => `from ${slot.startTime} to ${slot.endTime}`)
      .join(', ')
    const content = `Service "${service.title}" is available on ${avail.weekDay} ${slots}.`

    const chunks = await splitter.splitText(content)

    const embeddings = new OllamaEmbeddings({
      model: 'mxbai-embed-large',
      baseUrl: 'http://localhost:11434',
    })

    const accessLevel = ['USER', 'ADMIN', 'SUPER_ADMIN']
    for (const chunk of chunks) {
      const id = uuidv4()
      const embedding = await embeddings.embedQuery(chunk)

      await prisma.$executeRaw`
      INSERT INTO "Document" ("id", "content", "accessLevel", "serviceId", "source", "embedding", "metadata")
      VALUES (
        ${id},
        ${chunk},
        ${accessLevel}::"Role"[],
        ${service.id},
        'service_availability',
        ${embedding}::vector,
        ${JSON.stringify({
          serviceId: service.id,
          weekDay: avail.weekDay,
          timeSlots: (avail.timeSlots ?? []).map((slot) => ({
            startTime: slot.startTime,
            endTime: slot.endTime,
          })),
          source: 'service_availability',
          accessLevel,
        })}::jsonb
      )
    `
    }
  }
}
