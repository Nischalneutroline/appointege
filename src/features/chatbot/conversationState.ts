import { prisma } from '@/lib/prisma'
import { extractEmailFromMessage, extractFieldsFromMessage } from './extraction'
import { getAppointmentIdByEmail } from '@/db/appointment'
import { NextResponse } from 'next/server'
import { canUserCancelAppointment } from './appointmentHistory'
import { BookAppointmentInput, cancelAppointment } from './agentTool'
import { getServiceIdByName } from '@/db/service'
import { appointmentGraph } from './appointmentGraph'
import { getUserIdByEmail } from '@/db/user'
import {
  getExampleForMissingFields,
  getMissingBookingFields,
  getMissingCancellationFields,
  isAppointmentAction,
  isCancellationAction,
  isNegativeIntent,
  isServiceDiscoveryQuery,
} from './intentDetection'

async function handleAgentConversationFlow({
  data,
  userId,
  userRole,
}: {
  data: BookAppointmentInput
  userId: string
  userRole: string
}) {
  let updatedFields: Record<string, any> = { ...data }
  if (updatedFields.serviceName) {
    console.log('service name is', updatedFields.serviceName)
    updatedFields.serviceId = await getServiceIdByName(
      updatedFields.serviceName,
    )
    if (!updatedFields.serviceId) {
      return `Service named '${updatedFields.serviceName}' not found. Please provide a valid service name.`
    }
  }
  if (updatedFields.email) {
    updatedFields.userId = await getUserIdByEmail(updatedFields.email)
    if (!updatedFields.userId) {
      console.log('no user')
      return `${updatedFields.email} not found. Please provide a valid email to book a appointment.`
    }
  }

  if (
    userRole !== 'ADMIN' &&
    userRole !== 'SUPERADMIN' &&
    updatedFields.userId !== userId
  ) {
    return `You do not have permission to book an appointment for another user.`
  }

  const result = await appointmentGraph.invoke({
    userId,
    ...updatedFields,
  })

  if (result.error) {
    console.log('error is', result.error)
    return `Booking failed: ${result.error}`
  }

  return {
    bookingConfirmation: true,
    bookingData: result,
  }

  // If no known flow, return null so the route can continue with fallback logic (e.g., RAG/LLM)
  return null
}

export { handleAgentConversationFlow }
