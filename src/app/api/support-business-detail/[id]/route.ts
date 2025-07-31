import { NextRequest, NextResponse } from 'next/server'
import { getSupportDetailById } from '@/db/supportDetail'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'
import { SupportBusinessDetailSchema } from '@/app/(protected)/admin/support/_schemas/schema'
import { WeekDays } from '@/app/(protected)/admin/business-settings/_types/types'

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getSupportDetailById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: 'Support Business Detail with id not found' },
        { status: 404 },
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch support business detail' },
      { status: 500 },
    )
  }
}

// **UPDATE SupportBusinessDetail**
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Support Business ID is required' },
        { status: 400 },
      )
    }
    const body = await req.json()
    const parsedData = SupportBusinessDetailSchema.parse(body)

    const existingSupportDetail = await getSupportDetailById(id)

    if (!existingSupportDetail) {
      return NextResponse.json(
        { error: 'Support Business Detail not found' },
        { status: 404 },
      )
    }

    // update support details
    const updatedSupportDetail = await prisma.supportBusinessDetail.update({
      where: { id },
      data: {
        supportBusinessName: parsedData.supportBusinessName,
        supportEmail: parsedData.supportEmail,
        supportPhone: parsedData.supportPhone,
        // Handle addresses
        supportAddress: parsedData.supportAddress,

        // Handle business availability
        supportAvailability: {
          deleteMany: {}, // Delete all existing supportAvailability
          create: parsedData.supportAvailability.map((availability) => ({
            weekDay: availability.weekDay,
            type: availability.type,
            timeSlots: {
              create: availability.timeSlots.map((slot) => ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                type: "WORK",
              })),
            },
          })),
        },

        // Handle holidays
        supportHoliday: {
          deleteMany: {}, // Delete all existing supportHoliday
          create: parsedData.supportHoliday.map((holiday) => ({
            holiday: holiday.holiday as WeekDays,
            type: "SUPPORT",
            date: holiday.date,
          })),
        },
      },
      include: {
        supportAvailability: {
          include: {
            timeSlots: true,
          },
        },
        supportHoliday: true,
      },
    })

    return NextResponse.json(
      {
        message: 'Support Business Detail updated successfully',
        data: updatedSupportDetail,
      },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors,message: error.message },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}

// **DELETE SupportBusinessDetail**
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Support Detail ID is required' },
        { status: 400 },
      )
    }

    const existingSupportDetail = await getSupportDetailById(id)

    if (!existingSupportDetail) {
      return NextResponse.json(
        { error: 'Support Business Detail not found' },
        { status: 404 },
      )
    }

    const deletedSupportDetail = await prisma.supportBusinessDetail.delete({
      where: { id },
    })

    if (!deletedSupportDetail) {
      return NextResponse.json(
        { error: "Support Business Detail couldn't be deleted" },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        message: 'Support Business Detail deleted successfully',
        data: deletedSupportDetail,
      },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete support detail' },
      { status: 500 },
    )
  }
}
