import { ReminderType } from "@prisma/client"
import { prisma } from "../lib/prisma"

// get service by id
async function getReminderById(id: string) {
  return await prisma.reminder.findUnique({
    where: {
      id,
    },
    include: {
      services: true,
      notifications: true,
      reminderOffset: true,
    },
  })
}

export { getReminderById }

// get service by id
async function getRemindersByType(type: ReminderType) {
  return await prisma.reminder.findMany({
    where: { type },
    include: {
      services: true, // Fetch related services
      notifications: true, // Fetch related notifications
      reminderOffset: true, // Fetch related reminder offsets
    },
  })
}

export { getRemindersByType }
