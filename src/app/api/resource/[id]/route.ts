import { NextRequest, NextResponse } from "next/server"
import { getAnnouncementOrOfferById } from "@/db/announcement-offer"
import { getAppointmentById } from "@/db/appointment"
import { getResourceDetailById } from "@/db/resources"
import { prisma } from "@/lib/prisma"
import { ZodError } from "zod"
import { ResourceSchema } from "@/features/resource/schemas/schema"

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getResourceDetailById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: "Resource with id not found" },
        { status: 404 }
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resource" },
      { status: 500 }
    )
  }
}

// **UPDATE Resource**
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Resource Id required!" },
        { status: 400 }
      )
    }
    const body = await req.json()
    const parsedData = ResourceSchema.parse(body)

    const existingResource = await getResourceDetailById(id)

    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    const updatedResource = await prisma.resource.update({
      where: { id },
      data: {
        name: parsedData.name,
        email: parsedData.email,
        role: parsedData.role,
        phone: parsedData.phone,
        address: parsedData.address || "",
        businessId: parsedData.businessId, // ✅ Required Field
        services: {
          connect: parsedData.services.map((service) => ({ id: service.id })),
        },
      },
    })

    if (!updatedResource) {
      return NextResponse.json(
        { error: "Failed to update resource" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: "Resource updated successfully", resource: updatedResource },
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

// **DELETE Resource**
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: "Resource Id required!" },
        { status: 400 }
      )
    }

    const existingResource = await getResourceDetailById(id)

    if (!existingResource) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 })
    }

    const deletedResource = await prisma.resource.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: "Resource deleted successfully", resources: deletedResource },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    )
  }
}
