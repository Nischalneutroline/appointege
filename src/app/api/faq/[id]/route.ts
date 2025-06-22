import { NextRequest, NextResponse } from "next/server"
import { getAnnouncementOrOfferById } from "@/db/announcement-offer"
import { getAppointmentById } from "@/db/appointment"
import { getFAQSById } from "@/db/faq"
import { faqSchema } from "@/features/faq/schemas/schema"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getFAQSById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "FAQ with id not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch faq" }, { status: 500 })
  }
}

// PUT: Update an existing FAQ
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "FAQ Id required!" }, { status: 400 })
    }

    const body = await req.json()
    const parsedData = faqSchema.parse(body)

    // Find the FAQ by ID
    const existingFAQ = await getFAQSById(id)

    if (!existingFAQ) {
      return NextResponse.json({ error: "FAQ not found" }, { status: 404 })
    }

    // Update the FAQ entry in prisma
    const updatedFAQ = await prisma.fAQ.update({
      where: { id },
      data: {
        question: parsedData.question,
        answer: parsedData.answer,
        category: parsedData.category,
        isActive: parsedData.isActive,
        order: parsedData.order,
        lastUpdatedById: parsedData.lastUpdatedById,
        createdById: parsedData.createdById,
      },
    })

    return NextResponse.json(
      { message: "FAQ updated successfully", faq: updatedFAQ },
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

// DELETE: Delete an FAQ
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json({ error: "FAQ Id required!" }, { status: 400 })
    }

    const body = await req.json()

    // Find the FAQ by ID
    const existingFAQ = await getFAQSById(id)

    if (!existingFAQ) {
      return NextResponse.json({ error: "FAQ not found!" }, { status: 404 })
    }
    const deletedFAQ = await prisma.fAQ.delete({
      where: { id },
    })

    if (!deletedFAQ) {
      return NextResponse.json(
        { error: "FAQ couldn't be deleted!" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "FAQ deleted successfully" },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    )
  }
}
