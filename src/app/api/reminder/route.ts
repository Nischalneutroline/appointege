import { NextRequest, NextResponse } from "next/server";
import { ReminderSchema } from "@/features/reminder/schemas/schema"; // Adjust the path accordingly
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { getReminderById } from "@/db/reminder";

// Create a new reminder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ReminderSchema.parse(body);

    const newReminder = await prisma.reminder.create({
      data: {
        type: parsedData.type,
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        services: {
          connect: parsedData.services.map((service) => ({ id: service })), // Connect existing services
        },
        notifications: {
          create: parsedData.notifications.map((notification) => ({
            method: notification.method,
          })),
        },
        reminderOffset: {
          create: parsedData.reminderOffset.map((reminderOffset) => ({
            sendOffset: reminderOffset.sendOffset,
            // scheduledAt: new Date(reminderOffset.scheduledAt),
            sendBefore: reminderOffset.sendBefore,
          })),
        },
      },
      include: {
        services: true,
        notifications: true,
        reminderOffset: true,
      },
    });

    return NextResponse.json(
      { message: "Reminder created successfully", reminder: newReminder },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/reminder:", error);
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

// Fetch all reminders
export async function GET() {
  try {
    const reminders = await prisma.reminder.findMany({
      include: {
        services: true,
        notifications: true,
        reminderOffset: true,
      },
    });

    if (reminders.length === 0) {
      return NextResponse.json(
        { error: "No reminders found" },
        { status: 404 }
      );
    }
    return NextResponse.json(reminders, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch reminders" },
      { status: 500 }
    );
  }
}

// Update an existing reminder
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = ReminderSchema.parse(body);

    const { id } = body;
    if (!id) {
      return NextResponse.json(
        { error: "Reminder Id required!" },
        { status: 400 }
      );
    }

    const existingReminder = await getReminderById(id);

    if (!existingReminder) {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 }
      );
    }

    const updatedReminder = await prisma.reminder.update({
      where: { id },
      data: {
        type: parsedData.type,
        title: parsedData.title,
        description: parsedData.description,
        message: parsedData.message,
        services: {
          connect: parsedData.services.map((service) => ({ id: service })), // Connect existing services
        },
        notifications: {
          upsert: parsedData.notifications.map((notification) => ({
            where: { id: notification.id }, // If ID exists, update, otherwise create
            update: { method: notification.method },
            create: { method: notification.method },
          })),
        },
        reminderOffset: {
          upsert: parsedData.reminderOffset.map((reminderOffset) => ({
            where: { id: reminderOffset.id }, // If ID exists, update, otherwise create
            update: {
              sendOffset: reminderOffset.sendOffset,
              // scheduledAt: new Date(reminderOffset.scheduledAt),
              sendBefore: reminderOffset.sendBefore,
            },
            create: {
              sendOffset: reminderOffset.sendOffset,
              // scheduledAt: new Date(reminderOffset.scheduledAt),
              sendBefore: reminderOffset.sendBefore,
            },
          })),
        },
      },
      include: {
        services: true,
        notifications: true,
        reminderOffset: true,
      },
    });

    return NextResponse.json(
      { message: "Reminder updated successfully", reminder: updatedReminder },
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

// Delete a reminder
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Reminder Id required!" },
        { status: 400 }
      );
    }

    const existingReminder = await getReminderById(id);

    if (!existingReminder) {
      return NextResponse.json(
        { error: "Reminder not found" },
        { status: 404 }
      );
    }

    const deletedReminder = await prisma.reminder.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Reminder deleted successfully", reminder: deletedReminder },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete reminder" },
      { status: 500 }
    );
  }
}
