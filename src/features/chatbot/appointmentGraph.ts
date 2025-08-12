import { StateGraph, START, END } from '@langchain/langgraph'
import { z } from 'zod'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import { bookAppointmentRaw, getTools } from './agentTool'
import { prisma } from '@/lib/prisma'
import { WeekDays } from '@prisma/client'
import { getServiceIdByName } from '@/db/service'

// 1. Define the LangGraph state schema using your appointment schema
const AppointmentGraphStateSchema = appointmentSchema
  .pick({
    userId: true,
    serviceId: true,
    customerName: true,
    email: true,
    phone: true,
    status: true,
    bookedById: true,
    message: true,
    isForSelf: true,
    createdById: true,
  })
  .extend({
    missingFields: z.array(z.string()).optional(),
    appointmentDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
      message: 'Invalid date format',
    }),
    appointmentTime: z.string(),
    confirmed: z.boolean().optional(),
    error: z.string().optional(),
  })

export type AppointmentGraphState = z.infer<typeof AppointmentGraphStateSchema>

function normalizeDate(dateStr: string): string {
  // Accepts most user-entered date formats and outputs YYYY-MM-DD
  const date = new Date(dateStr)
  if (!isNaN(date.getTime())) {
    return date.toISOString().slice(0, 10)
  }
  throw new Error('Invalid date format: ' + dateStr)
}

// 2. Node: Collect Service
async function collectService(
  state: AppointmentGraphState,
): Promise<Partial<AppointmentGraphState>> {
  console.log('collectService node called:', state)
  // If we already have a valid serviceId, we're done.
  if (state.serviceId) {
    return {}
  }
  // Neither serviceId nor resolvable serviceName—prompt for required info
  return { missingFields: ['serviceId'] }
}

// 3. Node: Collect Date and Time
async function collectDateTime(
  state: AppointmentGraphState,
): Promise<Partial<AppointmentGraphState>> {
  const missing: string[] = []
  console.log('collectDateTime node called:', state)
  if (!state.appointmentDate) missing.push('appointmentDate')
  if (!state.appointmentTime) missing.push('appointmentTime')
  if (missing.length > 0) {
    return { missingFields: missing }
  }
  return {}
}

// 4. Node: Confirm Details
async function confirmDetails(
  state: AppointmentGraphState,
): Promise<Partial<AppointmentGraphState>> {
  // In a real chatbot, you'd confirm details with the user.
  console.log('hello')
  if (state.confirmed) {
    return {}
  }
  return { confirmed: false } // Or prompt for confirmation
}

// 5. Node: Book Appointment (calls your tool)
async function bookAppointmentNode(
  state: AppointmentGraphState,
): Promise<Partial<AppointmentGraphState>> {
  try {
    if (state.error) {
      // Do not proceed if there is an error
      return {}
    }
    console.log('state is', state)
    const result = await bookAppointmentRaw(state)

    return { confirmed: true, ...result }
  } catch (error) {
    // Check if error is an object and has a message property
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return {
        error: (error as { message?: string }).message || 'Booking failed',
      }
    }
    // fallback: error is not an object with 'message'
    return { error: 'Booking failed' }
  }
}

async function checkAvailability(
  state: AppointmentGraphState,
): Promise<Partial<AppointmentGraphState>> {
  if (!state.serviceId || !state.appointmentDate || !state.appointmentTime) {
    const requiredFields: (keyof AppointmentGraphState)[] = [
      'serviceId',
      'appointmentDate',
      'appointmentTime',
    ]
    const missingFields = requiredFields.filter((f) => !state[f])
    return { missingFields }
  }

  const now = new Date()
  // Convert selectedDate to weekday string (e.g., MONDAY)

  const dateObj = new Date(state.appointmentDate)

  now.setHours(0, 0, 0, 0)
  dateObj.setHours(0, 0, 0, 0)
  if (dateObj < now) {
    console.log('true')
    return {
      error:
        'You cannot book an appointment in the past. Please select a future date.',
    }
  }

  const weekDayString = dateObj
    .toLocaleDateString('en-US', { weekday: 'long' })
    .toUpperCase()

  // Convert string to Prisma enum
  const weekDayEnum: WeekDays = WeekDays[weekDayString as keyof typeof WeekDays]

  // Query service with availability for the given weekday
  const service = await prisma.service.findUnique({
    where: { id: state.serviceId },
    include: {
      serviceAvailability: {
        where: { weekDay: weekDayEnum },
        include: { timeSlots: true },
      },
    },
  })
  console.log('service', service)

  if (
    !service ||
    !service.serviceAvailability ||
    service.serviceAvailability.length === 0
  ) {
    return { error: 'Service or availability not found for the selected day.' }
  }

  const availability = service.serviceAvailability[0]
  console.log('availability', availability)
  const slot = availability.timeSlots.find(
    (t) => t.startTime === state.appointmentTime,
  )
  console.log('slot', slot)

  const availableTimes = availability.timeSlots.map((ts) => ts.startTime)

  if (!slot) {
    return {
      error: `Requested time slot is not available. Available times: ${availableTimes.join(', ')}`,
    }
  }

  // Check if someone already booked this slot
  const existingBooking = await prisma.appointment.findFirst({
    where: {
      serviceId: state.serviceId,
      selectedDate: new Date(state.appointmentDate),
      selectedTime: state.appointmentTime,
      status: 'SCHEDULED', // Only scheduled, not cancelled or completed
    },
  })

  if (existingBooking) {
    return {
      error:
        'The requested time slot has already been booked. Please select another time.',
    }
  }
  console.log('checkAvailability ending. Returning:', {})

  return {}
}

// 6. Node: Handle Error
async function handleError(
  state: AppointmentGraphState,
): Promise<Partial<AppointmentGraphState>> {
  // Here you could log the error or notify the user
  return {}
}

// 7. Build the graph
const graphBuilder = new StateGraph(AppointmentGraphStateSchema)

graphBuilder
  .addNode('collectService', collectService)
  .addNode('collectDateTime', collectDateTime)
  .addNode('checkAvailability', checkAvailability)
  .addNode('confirmDetails', confirmDetails)
  // Specify possible ends for bookAppointmentNode
  .addNode('bookAppointment', bookAppointmentNode, {
    ends: ['handleError', '__end__'],
  })
  // Mark handleError as an end node
  .addNode('handleError', handleError, { ends: ['__end__'] })

// Edges (transitions)
graphBuilder.addEdge(START, 'collectService' as any)
graphBuilder.addEdge('collectService' as any, 'collectDateTime' as any)
graphBuilder.addEdge('collectDateTime' as any, 'checkAvailability' as any)
graphBuilder.addEdge('checkAvailability' as any, 'confirmDetails' as any)
graphBuilder.addEdge('confirmDetails' as any, 'bookAppointment' as any)
graphBuilder.addEdge('bookAppointment' as any, END)
// Add this edge so handleError is reachable
graphBuilder.addEdge('bookAppointment' as any, 'handleError' as any)
graphBuilder.addEdge('handleError' as any, END)
// 8. Export the compiled graph
export const appointmentGraph = graphBuilder.compile()
