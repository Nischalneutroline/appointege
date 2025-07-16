import { z } from 'zod'
import { getTimezoneInfo } from './utils'

export const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

type TimeRange = {
  open: string
  close: string
}

type DayKeys = (typeof daysOfWeek)[number] | 'default'

export const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/

export type DaySchedule = {
  [K in DayKeys]: TimeRange[]
} & {
  monday: TimeRange[]
  tuesday: TimeRange[]
  wednesday: TimeRange[]
  thursday: TimeRange[]
  friday: TimeRange[]
  saturday: TimeRange[]
  sunday: TimeRange[]
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
  businessDays: z.array(
    z.object({
      from: z.string(),
      to: z.string(),
    }),
  ),
  businessHours: z.object(
    Object.fromEntries(daysOfWeek.map((day) => [day, z.array(timeSlotSchema)])),
  ) as unknown as z.ZodType<DaySchedule>,
  breakHours: z
    .object(
      Object.fromEntries(
        daysOfWeek.map((day) => [day, z.array(timeSlotSchema).optional()]),
      ),
    )
    .optional() as unknown as z.ZodType<DaySchedule | undefined>,
})

// ======================================================================================
export interface BusinessAvailabilityFormValues {
  timezone: string
  businessDays: { from: string; to: string }[]
  businessHours: DaySchedule
  breakHours?: DaySchedule
}

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
