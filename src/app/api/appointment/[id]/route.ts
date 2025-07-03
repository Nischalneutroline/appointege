import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncementOrOfferById } from '@/db/announcement-offer'
import { getAppointmentById } from '@/db/appointment'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma } from '@prisma/client'

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
    const { id } = await params
    const announcement = await getAppointmentById(id)

    if (!announcement) {
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
    return NextResponse.json(
      {
        message: 'Appointment fetched successfully',
        data: announcement,
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

    // Find the service by ID
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

    const body = await req.json()
    const parsedData = appointmentSchema.parse(body)

    // update appointment in prisma database
    const updatedService = await prisma.appointment.update({
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

    if (!updatedService) {
      return NextResponse.json(
        {
          message: 'Failed to update appointment',
          data: null,
          status: 500,
          success: false,
          errorDetail: 'Failed to update appointment',
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        message: 'Appointment updated successfully',
        data: updatedService,
        status: 200,
        success: true,
        errorDetail: null,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof Prisma.PrismaClientValidationError) {
      // Handle the validation error specifically
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Prisma Validation failed',
          errorDetail: error,
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
          errorDetail: error,
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
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}

//delete appointment
export async function DELETE(
  req: NextRequest,
  { params }: ParamsProps,
): Promise<NextResponse<ReturnType>> {
  try {
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
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}
