import { NextRequest, NextResponse } from "next/server"
import { getSupportDetailById } from "@/db/supportDetail"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"
import { SupportBusinessDetailSchema } from "@/features/support-detail/schemas/schema"
import { WeekDays } from "@/features/business-detail/types/types"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getSupportDetailById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "Support Business Detail with id not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch support business detail" },
      { status: 500 }
    )
  }
}

// **UPDATE SupportBusinessDetail**
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Support Business ID is required" },
        { status: 400 }
      )
    }
    const body = await req.json()
    const parsedData = SupportBusinessDetailSchema.parse(body)

    const existingSupportDetail = await getSupportDetailById(id)

    if (!existingSupportDetail) {
      return NextResponse.json(
        { error: "Support Business Detail not found" },
        { status: 404 }
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
        supportAddress: {
          upsert: parsedData.supportAddress.map((addr) => ({
            where: { id: addr.id || "" }, // Use empty string as fallback if no ID
            update: {
              street: addr.street,
              city: addr.city,
              country: addr.country,
              zipCode: addr.zipCode,
              googleMap: addr.googleMap || "",
            },
            create: {
              street: addr.street,
              city: addr.city,
              country: addr.country,
              zipCode: addr.zipCode,
              googleMap: addr.googleMap || "",
            },
          })),
        },

        // Handle business availability
        supportAvailability: {
          upsert: parsedData.supportAvailability.map((availability) => ({
            where: { id: availability.id || "" },
            update: {
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                upsert: availability.timeSlots.map((slot) => ({
                  where: { id: slot.id || "" },
                  update: {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  },
                  create: {
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                  },
                })),
              },
            },
            create: {
              weekDay: availability.weekDay,
              type: availability.type,
              timeSlots: {
                create: availability.timeSlots.map((slot) => ({
                  startTime: slot.startTime,
                  endTime: slot.endTime,
                })),
              },
            },
          })),
        },

        // Handle holidays
        supportHoliday: {
          upsert: parsedData.supportHoliday.map((holiday) => ({
            where: { id: holiday.id || "" },
            update: {
              holiday: holiday.holiday as WeekDays,
              type: holiday.type,
              date: holiday.date,
            },
            create: {
              holiday: holiday.holiday as WeekDays,
              type: holiday.type,
              date: holiday.date,
            },
          })),
        },
      },
      include: {
        supportAddress: true,
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
        message: "Support Business Detail updated successfully",
        data: updatedSupportDetail,
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// **DELETE SupportBusinessDetail**
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Support Detail ID is required" },
        { status: 400 }
      )
    }

    const existingSupportDetail = await getSupportDetailById(id)

    if (!existingSupportDetail) {
      return NextResponse.json(
        { error: "Support Business Detail not found" },
        { status: 404 }
      )
    }

    const deletedSupportDetail = await prisma.supportBusinessDetail.delete({
      where: { id },
    })

    if (!deletedSupportDetail) {
      return NextResponse.json(
        { error: "Support Business Detail couldn't be deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: "Support Business Detail deleted successfully",
        data: deletedSupportDetail,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete support detail" },
      { status: 500 }
    )
  }
}
