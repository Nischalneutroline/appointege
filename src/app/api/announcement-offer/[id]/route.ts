import { NextRequest, NextResponse } from "next/server"
import { getAnnouncementOrOfferById } from "@/db/announcement-offer"
import { prisma } from "@/lib/prisma"
import { announcementOrOfferSchema } from "@/features/announcement-offer/schemas/schema"
import { ZodError } from "zod"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getAnnouncementOrOfferById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "Announcement or offer not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch announcement" },
      { status: 500 }
    )
  }
}

// Update an existing announcement or offer
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: "Announcement/Offer Id required!" },
        { status: 400 }
      )
    }

    const existingAnnouncement = await getAnnouncementOrOfferById(id)

    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement not found" },
        { status: 404 }
      )
    }

    const body = await req.json()
    const parsedData = announcementOrOfferSchema.parse(body)

    // update announcement in prisma
    const updatedAnnouncement = await prisma.announcementOrOffer.update({
      where: { id },
      data: {
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        audience: parsedData.audience,
        isImmediate: parsedData.isImmediate,
        scheduledAt: parsedData.scheduledAt,
        showOn: parsedData.showOn,
        expiredAt: parsedData.expiredAt,
      },
    })

    if (!updatedAnnouncement) {
      return NextResponse.json(
        { error: "Announcement/Offer couldn't be updated" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      {
        message: "Announcement updated successfully",
        announcement: updatedAnnouncement,
      },
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

// Delete an announcement or offer
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: "Announcement/Offer Id required!" },
        { status: 400 }
      )
    }

    const existingAnnouncement = await getAnnouncementOrOfferById(id)
    if (!existingAnnouncement) {
      return NextResponse.json(
        { error: "Announcement/Offer not found" },
        { status: 404 }
      )
    }

    const deletedAnnouncement = await prisma.announcementOrOffer.delete({
      where: { id },
    })

    return NextResponse.json(
      {
        message: "Announcement deleted successfully",
        announcement: deletedAnnouncement,
      },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete announcement" },
      { status: 500 }
    )
  }
}
