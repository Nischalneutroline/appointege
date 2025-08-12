import { NextRequest, NextResponse } from 'next/server'
import { getAnnouncementOrOfferById } from '@/db/announcement-offer'
import { getAppointmentById } from '@/db/appointment'
import { getReminderById } from '@/db/reminder'
import { prisma } from '@/lib/prisma'
import { ZodError } from 'zod'
import { ReminderSchema } from '@/app/(protected)/admin/reminders/schema/schema'

interface ParamsProps {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    const announcement = await getReminderById(id)

    if (!announcement) {
      return NextResponse.json(
        { error: 'Reminder with id not found', success: false },
        { status: 404 },
      )
    }
    return NextResponse.json(announcement, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reminder', success: false },
      { status: 500 },
    )
  }
}

// Update an existing reminder
export async function PUT(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params
    if (!id) {
      return NextResponse.json(
        { error: 'Reminder Id required!' },
        { status: 400 },
      )
    }

    const body = await req.json()
    const parsedData = ReminderSchema.parse(body)

    const existingReminder = await getReminderById(id)

    if (!existingReminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }

    const deletedReminder = await prisma.reminder.delete({
      where: {
        id,
      },
    })

    if (deletedReminder) {
      const newReminder = await prisma.reminder.create({
        data: {
          id,
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
              customScheduleAt: reminderOffset.scheduledAt,
              sendOffset: reminderOffset.sendOffset
                ? reminderOffset.sendOffset
                : null,
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
      })

      return NextResponse.json({ status: 200, sucess: true, data: newReminder })
    }

    // const updatedReminder = await prisma.reminder.update({
    //   where: { id },
    //   data: {
    //     type: parsedData.type,
    //     title: parsedData.title,
    //     description: parsedData.description,
    //     message: parsedData.message,
    //     services: {
    //       connect: parsedData.services.map((service) => ({ id: service })), // Connect existing services
    //     },
    //     notifications: {
    //       upsert: parsedData.notifications.map((notification) => ({
    //         where: { id: notification.id }, // If ID exists, update, otherwise create
    //         update: { method: notification.method },
    //         create: { method: notification.method },
    //       })),
    //     },
    //     reminderOffset: {
    //       upsert: parsedData.reminderOffset.map((reminderOffset) => ({
    //         where: { id: reminderOffset.id }, // If ID exists, update, otherwise create
    //         update: {
    //           sendOffset: reminderOffset.sendOffset,
    //           scheduledAt: reminderOffset.scheduledAt,
    //           sendBefore: reminderOffset.sendBefore,
    //         },
    //         create: {
    //           sendOffset: reminderOffset.sendOffset,
    //           scheduledAt: new Date(reminderOffset.scheduledAt),
    //           sendBefore: reminderOffset.sendBefore,
    //         },
    //       })),
    //     },
    //   },
    //   include: {
    //     services: true,
    //     notifications: true,
    //     reminderOffset: true,
    //   },
    // })

    return NextResponse.json({
      message: 'Something went wrong while updating reminder',
      status: 500,
      success: false,
    })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error,
          status: 400,
          success: false,
        },
        { status: 400 },
      )
    }
    return NextResponse.json(
      { error: 'Internal server error', success: false },
      { status: 500 },
    )
  }
}

// Delete a reminder
export async function DELETE(req: NextRequest, { params }: ParamsProps) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json(
        { error: 'Reminder Id required!' },
        { status: 400 },
      )
    }

    const existingReminder = await getReminderById(id)

    if (!existingReminder) {
      return NextResponse.json({ error: 'Reminder not found' }, { status: 404 })
    }

    const deletedReminder = await prisma.reminder.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Reminder deleted successfully', reminder: deletedReminder },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete reminder' },
      { status: 500 },
    )
  }
}
