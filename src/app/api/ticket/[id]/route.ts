import { NextRequest, NextResponse } from "next/server"
import { getAnnouncementOrOfferById } from "@/db/announcement-offer"
import { getAppointmentById } from "@/db/appointment"
import { getTicketById } from "@/db/ticket"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"
import { ticketSchema } from "@/features/ticket/schemas/schema"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getTicketById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "Ticket with id not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch ticket" },
      { status: 500 }
    )
  }
}

// Update an existing ticket (PUT)
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Ticket Id required!" },
        { status: 400 }
      )
    }

    const body = await req.json()
    const parsedData = ticketSchema.parse(body) // Validate incoming data

    const existingTicket = await getTicketById(id)

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        userType: parsedData.userType,
        subject: parsedData.subject,
        ticketDescription: parsedData.ticketDescription,
        category: parsedData.category,
        priority: parsedData.priority,
        status: parsedData.status,
        assignedTo: parsedData.assignedTo,
        resolutionDescription: parsedData.resolutionDescription || "",
        proofFiles: parsedData.proofFiles,
        initiatedById: parsedData.initiatedById,
        userId: parsedData.userId,
      },
    })

    return NextResponse.json(
      { message: "Ticket updated successfully", ticket: updatedTicket },
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
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Delete a ticket (DELETE)
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Ticket Id required!" },
        { status: 400 }
      )
    }

    const existingTicket = await getTicketById(id)

    if (!existingTicket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    const deletedTicket = await prisma.ticket.delete({
      where: { id },
    })

    if (!deletedTicket) {
      return NextResponse.json(
        { error: "Ticket couldn't be deleted" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Ticket deleted successfully", ticket: deletedTicket },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete ticket", detail: error },
      { status: 500 }
    )
  }
}
