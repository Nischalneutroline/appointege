import { NextRequest, NextResponse } from "next/server"
import { getAnnouncementOrOfferById } from "@/db/announcement-offer"
import { getAppointmentById } from "@/db/appointment"
import { appointmentSchema } from "@/features/appointment/schemas/schema"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getAppointmentById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "Appointment with id not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch appointment" },
      { status: 500 }
    )
  }
}

export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Appointment Id required!" },
        { status: 400 }
      )
    }

    // Find the service by ID
    const existingAppointment = await getAppointmentById(id)

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
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
    })

    if (!updatedService) {
      return NextResponse.json(
        { error: "Failed to update appointment" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Appointment updated successfully", service: updatedService },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    )
  }
}

//delete appointment
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Appointment Id required!" },
        { status: 400 }
      )
    }

    const existingAppointment = await getAppointmentById(id)

    if (!existingAppointment) {
      return NextResponse.json(
        { error: "Appointment not found" },
        { status: 404 }
      )
    }

    const deletedAppointment = await prisma.appointment.delete({
      where: { id },
    })

    if (!deletedAppointment) {
      return NextResponse.json(
        { error: "Failed to delete appointment" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Appointment deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to delete appointment",
        details: error,
      },
      { status: 500 }
    )
  }
}
