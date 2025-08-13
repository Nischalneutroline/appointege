import { NextRequest, NextResponse } from "next/server";
import { ResourceSchema } from "@/features/resource/schemas/schema"; // Adjust the path accordingly
import { ZodError } from "zod";
import { Resource } from "@/features/resource/types/types";
import { prisma } from "@/lib/prisma";
import { Details } from "@mui/icons-material";
import { getResourceDetailById } from "@/db/resources";

// **CREATE Resource**
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ResourceSchema.parse(body);

    const newResource = await prisma.resource.create({
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
    });

    if (!newResource) {
      return NextResponse.json(
        { error: "Failed to create resource" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Resource created successfully", resource: newResource },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 }
    );
  }
}

// **READ all Resources**
export async function GET() {
  try {
    //use prisma logic

    const resources = await prisma.resource.findMany({
      include: {
        services: true,
      },
    });

    if (resources.length === 0) {
      return NextResponse.json(
        { error: "No resources found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resources, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

// **UPDATE Resource**
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ResourceSchema.parse(body);

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Resource Id required!" },
        { status: 400 }
      );
    }

    const existingResource = await getResourceDetailById(id);

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
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
    });

    if (!updatedResource) {
      return NextResponse.json(
        { error: "Failed to update resource" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Resource updated successfully", resource: updatedResource },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// **DELETE Resource**
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Resource Id required!" },
        { status: 400 }
      );
    }

    const existingResource = await getResourceDetailById(id);

    if (!existingResource) {
      return NextResponse.json(
        { error: "Resource not found" },
        { status: 404 }
      );
    }

    const deletedResource = await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Resource deleted successfully", resources: deletedResource },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}
