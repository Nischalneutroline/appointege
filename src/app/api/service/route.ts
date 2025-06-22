import { NextRequest, NextResponse } from "next/server";
import { serviceSchema } from "@/features/service/schemas/schema";
import { Service } from "@/features/service/types/types";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getServiceById } from "@/db/service";
import { createReminderForService } from "@/lib/prepopulateReminder";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Service;

    const parsedData = serviceSchema.parse(body);

    const newService = await prisma.service.create({
      data: {
        title: parsedData.title,
        description: parsedData.description,
        estimatedDuration: parsedData.estimatedDuration,
        status: parsedData.status || "ACTIVE", // Fallback to default if undefined
        serviceAvailability: {
          create: parsedData.serviceAvailability?.map((availability) => ({
            weekDay: availability.weekDay,
            timeSlots: {
              create: availability.timeSlots?.map((timeSlot) => ({
                startTime: new Date(timeSlot.startTime), // Explicitly convert to Date
                endTime: new Date(timeSlot.endTime), // Explicitly convert to Date
              })),
            },
          })),
        },
        businessDetailId: parsedData.businessDetailId,
      },
    });

    if (!newService) {
      return NextResponse.json(
        { error: "Failed to create service" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "New Service created successfully", service: newService },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
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
        BusinessDetail: {
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
    });

    if (services.length === 0) {
      return NextResponse.json({ error: "No services found" }, { status: 404 });
    }

    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch services" },
      { status: 500 }
    );
  }
}

//edit or  update service
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();

    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Service Id required!" },
        { status: 400 }
      );
    }

    const parsedData = serviceSchema.parse(body);

    const existingService = await getServiceById(id);

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    // update service
    const updatedService = await prisma.service.update({
      where: { id },
      data: {
        title: parsedData.title,
        description: parsedData.description,
        estimatedDuration: parsedData.estimatedDuration,
        status: parsedData.status,
        // businessDetailId: parsedData.businessDetailId,
        serviceAvailability: {
          create: parsedData.serviceAvailability?.map((availability) => ({
            weekDay: availability.weekDay,
            timeSlots: {
              create: availability.timeSlots?.map((timeSlot) => ({
                startTime: timeSlot.startTime,
                endTime: timeSlot.endTime,
              })),
            },
          })),
        },
      },
    });

    return NextResponse.json(
      { message: "Service updated successfully", service: updatedService },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", message: error },
      { status: 500 }
    );
  }
}

//delete service
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Service Id required!" },
        { status: 400 }
      );
    }

    const existingService = await getServiceById(id);

    if (!existingService) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const deletedService = await prisma.service.delete({
      where: { id },
    });

    if (!deletedService) {
      return NextResponse.json(
        { error: "Service could not be deleted" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Service deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete service", message: error },
      { status: 500 }
    );
  }
}
