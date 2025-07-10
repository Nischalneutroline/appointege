import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth' // Assuming next-auth utility is set up
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAppointmentById } from '@/db/appointment'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma, Appointment } from '@prisma/client'

interface ParamsProps {
  params: Promise<{ id: string }>
}

// Helper function to check if user has access to an appointment
async function hasAppointmentAccess(
  user: {
    id: string
    role: string
    ownedBusinesses: { id: string }[]
    businessAdmins: { businessId: string }[]
  },
  appointment: Appointment,
): Promise<boolean> {
  if (user.role === 'SUPER_ADMIN') {
    return true // SUPER_ADMIN has access to all appointments
  }

  if (user.role === 'USER') {
    // USER can access their own appointments
    return appointment.userId === user.id || appointment.bookedById === user.id
  }

  if (user.role === 'ADMIN') {
    // ADMIN can access appointments for their businesses (owned or administered)
    const service = await prisma.service.findUnique({
      where: { id: appointment.serviceId },
      select: { businessDetailId: true },
    })
    if (!service?.businessDetailId) return false
    const adminBusinessIds = user.businessAdmins.map((ba) => ba.businessId)
    const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
    const accessibleBusinessIds = [
      ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
    ]
    return accessibleBusinessIds.includes(service.businessDetailId)
  }

  return false // Default: no access for other roles (e.g., GUEST)
}

export async function GET(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized: Please log in to view appointment',
          data: null,
          status: 401,
          success: false,
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    // Fetch user with ownedBusinesses and businessAdmins
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedBusinesses: true,
        businessAdmins: { include: { business: true } },
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Validate role
    if (
      user.role !== 'USER' &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        {
          message: 'Forbidden: Insufficient permissions to view appointment',
          data: null,
          status: 403,
          success: false,
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    const { id } = await params
    const appointment = await getAppointmentById(id)

    if (!appointment) {
      return NextResponse.json(
        {
          message: 'Appointment with id not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: 'Appointment with id not found',
        },
        { status: 404 },
      )
    }

    // Check if user has access to the appointment
    const hasAccess = await hasAppointmentAccess(user, appointment)
    if (!hasAccess) {
      return NextResponse.json(
        {
          message: 'Forbidden: You do not have access to this appointment',
          data: null,
          status: 403,
          success: false,
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    return NextResponse.json(
      {
        message: 'Appointment fetched successfully',
        data: appointment,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to fetch appointment',
        data: null,
        status: 500,
        success: false,
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized: Please log in to update appointment',
          data: null,
          status: 401,
          success: false,
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    // Fetch user with ownedBusinesses and businessAdmins
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedBusinesses: true,
        businessAdmins: { include: { business: true } },
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Validate role
    if (
      user.role !== 'USER' &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        {
          message: 'Forbidden: Insufficient permissions to update appointment',
          data: null,
          status: 403,
          success: false,
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json(
        {
          message: 'Appointment Id required!',
          data: null,
          status: 400,
          success: false,
          errorDetail: 'Appointment Id required!',
        },
        { status: 400 },
      )
    }

    // Find the appointment by ID
    const existingAppointment = await getAppointmentById(id)
    if (!existingAppointment) {
      return NextResponse.json(
        {
          message: 'Appointment not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: 'Appointment not found',
        },
        { status: 404 },
      )
    }

    // Check if user has access to the appointment
    const hasAccess = await hasAppointmentAccess(user, existingAppointment)
    if (!hasAccess) {
      return NextResponse.json(
        {
          message: 'Forbidden: You do not have access to this appointment',
          data: null,
          status: 403,
          success: false,
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    const body = await req.json()
    const parsedData = appointmentSchema.parse(body)

    // Validate business access for ADMIN if serviceId is updated
    if (
      user.role === 'ADMIN' &&
      parsedData.serviceId &&
      parsedData.serviceId !== existingAppointment.serviceId
    ) {
      const service = await prisma.service.findUnique({
        where: { id: parsedData.serviceId },
        select: { businessDetailId: true },
      })
      if (!service?.businessDetailId) {
        return NextResponse.json(
          {
            data: null,
            status: 400,
            success: false,
            message: 'Invalid service ID',
            errorDetail: null,
          },
          { status: 400 },
        )
      }
      const adminBusinessIds = user.businessAdmins.map((ba) => ba.businessId)
      const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
      const accessibleBusinessIds = [
        ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
      ]
      if (!accessibleBusinessIds.includes(service.businessDetailId)) {
        return NextResponse.json(
          {
            data: null,
            status: 403,
            success: false,
            message: 'Forbidden: You do not have access to this business',
            errorDetail: null,
          },
          { status: 403 },
        )
      }
    }

    // Update appointment in Prisma
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        customerName: parsedData.customerName,
        email: parsedData.email,
        phone: parsedData.phone,
        status: parsedData.status,
        userId: parsedData.userId,
        bookedById: parsedData.bookedById,
        serviceId: parsedData.serviceId,
        selectedDate: parsedData.selectedDate,
        selectedTime: parsedData.selectedTime,
        message: parsedData.message,
        isForSelf: parsedData.isForSelf,
        createdById: parsedData.createdById,
        resourceId: parsedData.resourceId,
      },
      include: {
        user: true,
        service: true,
        Resource: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Appointment updated successfully',
        data: updatedAppointment,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Prisma Validation failed',
          errorDetail: error.message,
        },
        { status: 400 },
      )
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          message: 'Zod Validation failed',
          data: null,
          status: 400,
          success: false,
          errorDetail: error.errors,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        message: 'Internal server error',
        data: null,
        status: 500,
        success: false,
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          message: 'Unauthorized: Please log in to delete appointment',
          data: null,
          status: 401,
          success: false,
          errorDetail: null,
        },
        { status: 401 },
      )
    }

    // Fetch user with ownedBusinesses and businessAdmins
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        ownedBusinesses: true,
        businessAdmins: { include: { business: true } },
      },
    })

    if (!user) {
      return NextResponse.json(
        {
          message: 'User not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Validate role
    if (
      user.role !== 'USER' &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        {
          message: 'Forbidden: Insufficient permissions to delete appointment',
          data: null,
          status: 403,
          success: false,
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    const { id } = await params
    if (!id) {
      return NextResponse.json(
        {
          message: 'Appointment Id required!',
          data: null,
          status: 400,
          success: false,
          errorDetail: null,
        },
        { status: 400 },
      )
    }

    // Find the appointment by ID
    const existingAppointment = await getAppointmentById(id)
    if (!existingAppointment) {
      return NextResponse.json(
        {
          message: 'Appointment not found',
          data: null,
          status: 404,
          success: false,
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Check if user has access to the appointment
    const hasAccess = await hasAppointmentAccess(user, existingAppointment)
    if (!hasAccess) {
      return NextResponse.json(
        {
          message: 'Forbidden: You do not have access to this appointment',
          data: null,
          status: 403,
          success: false,
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Delete appointment
    const deletedAppointment = await prisma.appointment.delete({
      where: { id },
    })

    return NextResponse.json(
      {
        message: 'Appointment deleted successfully',
        data: deletedAppointment,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Failed to delete appointment',
        data: null,
        status: 500,
        success: false,
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
