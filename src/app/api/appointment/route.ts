import { NextRequest, NextResponse } from 'next/server'

import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { getAppointmentById } from '@/db/appointment'
import { createAppointment } from '@/lib/appointment'
import { Appointment } from '@/app/(protected)/admin/appointment/_types/appointment'
import { appointmentSchema } from '@/app/(protected)/admin/appointment/_schema/appoinment'
import { ReturnType } from '@/features/shared/api-route-types'
import { Prisma } from '@prisma/client'

//create new appointment
export async function POST(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  try {
    // Parse the request body
    const body = await req.json()

    // Validate the request body
    const parsedData: Appointment = appointmentSchema.parse(body)

    console.log(parsedData, 'parsedData')

    // Create a new appointment in prisma
    const newAppointment = await createAppointment({
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

    // Handle validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          success: false,
          message: 'Zod Validation failed!',
          errorDetail: error,
        },
        { status: 400 },
      )
    }
    // Handle other errors
    return NextResponse.json(
      {
        data: null,
        status: 500,
        success: false,
        message: 'Failed to book appointment!',
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}

//read all appointment
export async function GET(): Promise<NextResponse<ReturnType>> {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        user: true,
        service: true,
        Resource: true,
      },
    })
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
        data: appointments,
        status: 200,
        success: true,
        message: 'Appointment fetched successfully!',
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
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}
