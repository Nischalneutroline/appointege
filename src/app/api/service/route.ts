import { NextRequest, NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { prisma } from '@/lib/prisma'
import { getServiceById } from '@/db/service'
import { Prisma } from '@prisma/client'
import { Service } from '@/app/(protected)/admin/service/_types/service'
import { serviceSchema } from '@/app/(protected)/admin/service/_schemas/service'
import { ReturnType } from '@/features/shared/api-route-types'

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ReturnType>> {
  try {
    const body = (await req.json()) as Service

    const parsedData = serviceSchema.parse(body)

    const newService = await prisma.service.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        estimatedDuration: parsedData.estimatedDuration,
        status: parsedData.status || 'ACTIVE', // Fallback to default if undefined
        serviceAvailability: {
          create: parsedData.serviceAvailability?.map((availability) => ({
            weekDay: availability.weekDay,
            timeSlots: {
              create: availability.timeSlots?.map((timeSlot) => ({
                startTime: timeSlot.startTime, // Explicitly convert to Date
                endTime: timeSlot.endTime, // Explicitly convert to Date
              })),
            },
          })),
        },
        businessDetailId: parsedData.businessDetailId,
      },
    })

    if (!newService) {
      return NextResponse.json(
        {
          data: null,
          status: 500,
          sucess: false,
          message: 'Failed to create service',
          errorDetail: 'Service creation returned null',
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        data: newService,
        status: 201,
        sucess: true,
        message: 'New Service created successfully!',
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
          sucess: false,
          message: 'Prisma Validation failed',
          errorDetail: error,
        },
        { status: 400 },
      )
    }
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          data: null,
          status: 400,
          sucess: false,
          message: 'Zod Validation failed!',
          errorDetail: error,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      {
        data: null,
        status: 500,
        sucess: false,
        message: 'Failed to create service!',
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}

//fetch all service
export async function GET() {
  try {
    // get all services
    const services = await prisma.service.findMany({
      include: {
        appointments: true,
        serviceAvailability: {
          include: {
            timeSlots: true,
          },
        },
        businessDetail: {
          include: {
            businessAvailability: {
              include: {
                timeSlots: true,
              },
            },
            holiday: true,
          },
        },
      },
    })

    if (services.length === 0) {
      return NextResponse.json(
        { message: 'No services found!', success: false },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        data: services,
        success: true,
        message: 'Services fetched successfully!',
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      {
        data: null,
        status: 500,
        sucess: false,
        message: 'Failed to fetch services!',
        errorDetail: error,
      },
      { status: 500 },
    )
  }
}
