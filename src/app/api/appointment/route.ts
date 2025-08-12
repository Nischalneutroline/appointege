import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth' // Assuming next-auth utility is set up
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { createAppointment } from '@/lib/appointment'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma, Appointment, User } from '@prisma/client'

// Create new appointment
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to book an appointment',
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
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Validate role for creating appointments
    if (
      user.role !== 'USER' &&
      user.role !== 'ADMIN' &&
      user.role !== 'SUPER_ADMIN'
    ) {
      return NextResponse.json(
        {
          data: null,
          status: 403,
          success: false,
          message: 'Forbidden: Insufficient permissions to create appointments',
          errorDetail: null,
        },
        { status: 403 },
      )
    }

    // Parse the request body
    const body = await req.json()
    const parsedData = appointmentSchema.parse(body)

    // Validate business access for ADMIN (check both businessAdmins and ownedBusinesses)
    if (user.role === 'ADMIN' && parsedData.serviceId) {
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
      ] // Combine and deduplicate
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

    // Create a new appointment in Prisma
    const newAppointment = await prisma.appointment.create({
      data: {
        customerName: parsedData.customerName,
        email: parsedData.email,
        phone: parsedData.phone,
        status: parsedData.status as any,
        userId: parsedData.userId,
        bookedById: parsedData.bookedById,
        serviceId: parsedData.serviceId,
        selectedDate: new Date(parsedData.selectedDate),
        selectedTime: parsedData.selectedTime,
        message: parsedData.message,
        isForSelf: parsedData.isForSelf,
        createdById: parsedData.createdById,
        resourceId: parsedData.resourceId,
      },
    })

    // Return a success response
    return NextResponse.json(
      {
        data: newAppointment,
        status: 201,
        success: true,
        message: 'Appointment booked successfully!',
        errorDetail: null,
      },
      { status: 201 },
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
          data: null,
          status: 400,
          success: false,
          message: 'Zod Validation failed!',
          errorDetail: error.errors,
        },
        { status: 400 },
      )
    }

    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to book appointment!',
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}

// Read all appointments
export async function GET(): Promise<NextResponse<ReturnType>> {
  try {
    // Check authentication
    const session = await auth()
    if (!session || !session.user?.id) {
      return NextResponse.json(
        {
          data: null,
          status: 401,
          success: false,
          message: 'Unauthorized: Please log in to view appointments',
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
          data: null,
          status: 404,
          success: false,
          message: 'User not found',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    // Fetch appointments based on user role
    let appointments: Appointment[]
    if (user.role === 'SUPER_ADMIN') {
      // SUPER_ADMIN can access all appointments
      appointments = await prisma.appointment.findMany({
        include: {
          user: true,
          service: { include: { businessDetail: true } },
          Resource: true,
        },
      })
    } else if (user.role === 'ADMIN') {
      // ADMIN can access appointments for their businesses (both administered and owned)
      const adminBusinessIds = user.businessAdmins.map((ba) => ba.businessId)
      const ownedBusinessIds = user.ownedBusinesses.map((b) => b.id)
      const accessibleBusinessIds = [
        ...new Set([...adminBusinessIds, ...ownedBusinessIds]),
      ] // Combine and deduplicate
      if (accessibleBusinessIds.length === 0) {
        return NextResponse.json(
          {
            data: null,
            status: 403,
            success: false,
            message: 'Forbidden: No businesses assigned or owned by this admin',
            errorDetail: null,
          },
          { status: 403 },
        )
      }
      appointments = await prisma.appointment.findMany({
        where: {
          service: {
            businessDetailId: { in: accessibleBusinessIds },
          },
        },
        include: {
          user: true,
          service: { include: { businessDetail: true } },
          Resource: true,
        },
      })
    } else {
      // USER can access only their own appointments
      appointments = await prisma.appointment.findMany({
        where: { userId: session.user.id },
        include: {
          user: true,
          service: { include: { businessDetail: true } },
          Resource: true,
        },
      })
    }

    if (appointments.length === 0) {
      return NextResponse.json(
        {
          data: null,
          status: 404,
          success: false,
          message: 'No appointments found!',
          errorDetail: null,
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        data: appointments, // Return raw user and appointments
        status: 200,
        success: true,
        message: 'Appointments fetched successfully!',
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to fetch appointments!',
        errorDetail: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    )
  }
}
