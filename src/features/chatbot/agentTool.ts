import { tool } from '@langchain/core/tools'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import z from 'zod'
import { appointmentGraph } from './appointmentGraph'
import { extractFieldsFromMessage } from './extraction'
import { getServiceIdByName } from '@/db/service'
import { handleAgentConversationFlow } from './conversationState'
import { User } from '@prisma/client'
import { getUserById } from '@/db/user'
import {
  getExampleForMissingFields,
  getMissingBookingFields,
} from './intentDetection'
import { NextResponse } from 'next/server'

const bookAppointmentSchema = appointmentSchema
  .pick({
    customerName: true,
    email: true,
    phone: true,
    status: true,
    bookedById: true,
    userId: true,
    message: true,
    isForSelf: true,
  })
  .extend({
    serviceName: z.string(),
    appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    appointmentTime: z.string(),
  })
  .partial()

export type BookAppointmentInput = {
  customerName?: string
  email?: string
  phone?: string
  serviceName?: string
  status?: string
  bookedById?: string
  selectedDate?: string
  selectedTime?: string
  message?: string
  isForSelf?: boolean
}

// Schema for rescheduling (updating) an existing appointment
const rescheduleAppointmentSchema = appointmentSchema
  .pick({
    customerName: true,
    email: true,
    phone: true,
    serviceId: true,
    selectedDate: true,
    selectedTime: true,
    userId: true,
  })
  .extend({
    appointmentId: z.string(), // Required for identifying which appointment to update
  })

const BASE_URL = process.env.BASE_URL

function normalizeDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toISOString() // e.g., '2025-07-05T00:00:00.000Z'
  }
  throw new Error('Invalid date format: ' + dateStr)
}

function cleanNullStrings(obj: any): any {
  const cleaned: any = {}
  for (const key in obj) {
    if (key === 'resourceId' && !obj[key]) {
      // Do not include resourceId if it is null/empty/undefined
      continue
    }
    cleaned[key] = obj[key] === null ? '' : obj[key]
  }
  return cleaned
}

async function bookAppointmentTool(
  data: BookAppointmentInput,
  userId: string,
  userRole: string,
) {
  console.log('data is', data)
  console.log('booking is called')
  const missingFields = getMissingBookingFields(data)
  if (!data || missingFields.length > 0) {
    const example = getExampleForMissingFields(missingFields)
    return (
      `Please provide: ${missingFields.join(', ')}\n` +
      (example ? `_e.g._: ${example}` : '')
    )
  }

  // Just delegate to your robust, permission-aware orchestrator!
  const result = await handleAgentConversationFlow({
    data,
    userId,
    userRole,
  })

  // Fallback: Still missing something or awaiting confirmation.
  return result
}

export async function bookAppointmentRaw(data: any) {
  const selectedDate = data.appointmentDate
    ? normalizeDate(data.appointmentDate)
    : undefined

  const selectedTime = data.appointmentTime

  console.log('booking data is', data)
  const { appointmentDate, appointmentTime, ...rest } = data
  const filledData = {
    ...rest,
    selectedDate,
    selectedTime,
    status: data.status || 'SCHEDULED',
    bookedById: data.bookedById || data.userId,
    message: data.message || '',
    isForSelf: data.isForSelf ?? true,
    createdById: data.userId,
  }

  console.log('filled data is', filledData)
  const response = await fetch(`${BASE_URL}/api/appointment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(filledData),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to book appointment')
  }
  return await response.json()
}

// Function to reschedule an appointment (PUT)
async function rescheduleAppointment(data: any) {
  console.log('rescheduleAppointment tool called with:', data)
  const { appointmentId, ...updateFields } = data
  const response = await fetch(`/api/appointment/${appointmentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateFields),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to reschedule appointment')
  }
  return await response.json()
}

// Add to your existing tool imports
const cancelAppointmentSchema = z.object({
  appointmentId: z.string().min(1, 'Appointment ID is required'),
})

export async function cancelAppointment(data: { appointmentId: string }) {
  // Fetch existing appointment data first
  const resGet = await fetch(
    `${BASE_URL}/api/appointment/${data.appointmentId}`,
  )
  if (!resGet.ok) {
    throw new Error('Appointment not found')
  }
  const existingAppointment = await resGet.json()

  // Clean nulls before updating
  const cleanedData = cleanNullStrings(existingAppointment.data)

  // Prepare full updated data with status CANCELLED
  const updatedData = {
    ...cleanedData,
    status: 'CANCELLED',
    cancelledAt: new Date().toISOString(),
  }

  // Send full data in PUT request
  const resPut = await fetch(
    `${BASE_URL}/api/appointment/${data.appointmentId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    },
  )

  if (!resPut.ok) {
    const error = await resPut.json()
    throw new Error(error.message || 'Failed to cancel appointment')
  }

  return await resPut.json()
}

export function getTools(userId: string, userRole: string) {
  return [
    tool(
      async (data) =>
        // Always inject userId here!
        bookAppointmentTool(data, userId, userRole),
      {
        name: 'bookAppointment',
        description:
          'Book an appointment for a user. CALL bookAppointmentTool function  IMMEDIATELY if the user expresses any intent to book, even if none of the required information is provided yet. It is OK to leave fields blank—call the function as soon as there is booking intent. This tool will prompt for additional details as needed',
        schema: bookAppointmentSchema,
      },
    ),
    /*  tool(rescheduleAppointment, {
    name: 'rescheduleAppointment',
    description: 'Reschedule (update) an existing appointment by ID.',
    schema: rescheduleAppointmentSchema,
  }),
  tool(cancelAppointment, {
    name: 'cancelAppointment',
    description: 'Cancel an appointment by ID.',
    schema: cancelAppointmentSchema,
  }), */
  ]
}
