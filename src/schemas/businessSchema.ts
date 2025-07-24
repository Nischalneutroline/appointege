import { z } from 'zod'
import { getTimezoneInfo } from '@/lib/utils'
import {
  WeekDay,
  WeekDays,
} from '@/app/(protected)/admin/service/_types/service'

export const daysOfWeek = [
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
  'Sun',
] as const

type TimeRange = {
  open: string
  close: string
}

type DayKeys = (typeof daysOfWeek)[number] | 'Mon'

export const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export type DaySchedule = {
  [K in DayKeys]: TimeRange[]
} & {
  Mon: TimeRange[]
  Tue: TimeRange[]
  Wed: TimeRange[]
  Thu: TimeRange[]
  Fri: TimeRange[]
  Sat: TimeRange[]
  Sun: TimeRange[]
}

export const timeSlotSchema = z
  .object({
    open: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
    close: z.string().regex(timeRegex, 'Invalid time format (HH:MM)'),
  })
  .refine(
    (data) => {
      const [openHour, openMinute] = data.open.split(':').map(Number)
      const [closeHour, closeMinute] = data.close.split(':').map(Number)

      // Convert to minutes for comparison
      const openInMinutes = openHour * 60 + openMinute
      const closeInMinutes = closeHour * 60 + closeMinute

      return closeInMinutes > openInMinutes
    },
    {
      message: 'Close time must be after open time',
      path: ['close'],
    },
  )

export const businessAvailabilitySchema = z.object({
  timezone: z.string().min(1, 'Timezone is required'),
  businessAvailability: z.object({
    Mon: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
    Tue: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
    Wed: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
    Thu: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
    Fri: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
    Sat: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
    Sun: z.array(
      z.object({
        open: z.string(),
        close: z.string(),
      }),
    ),
  }),
  holidays: z.array(z.string()),
})

// ======================================================================================


export const timezoneData = [
  'UTC',
  'GMT',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Kathmandu',
  'Asia/Kolkata',
  'Asia/Dhaka',
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Shanghai',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland',
  'America/Los_Angeles',
  'America/Chicago',
  'America/New_York',
  'America/Toronto',
  'America/Sao_Paulo',
  'Africa/Johannesburg',
]

export const timezoneOptions = timezoneData
  .map(getTimezoneInfo)
  .sort((a, b) => b.offset - a.offset) // Sort by offset (highest to lowest)
  .map(({ label, value }) => ({
    label, // Use monospace font for consistent width
    value,
  }))
