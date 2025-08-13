// ✅ Simplified utilities for business availability logic

import {
  WeekDays,
  AvailabilityType,
  BusinessTimeType,
  BusinessAvailability,
  BusinessTime,
  HolidayType,
} from '@/app/(protected)/admin/business-settings/_types/types'
import { SupportBusinessDetail } from '@prisma/client'

// --- Types ---
// ApiTimeSlot is now just an alias for BusinessTime
type ApiTimeSlot = BusinessTime

// ApiBusinessAvailability is now just an alias for BusinessAvailability
type ApiBusinessAvailability = BusinessAvailability

interface ApiBusinessData {
  businessAvailability?: ApiBusinessAvailability[]
  timeZone?: string
}
interface ApiServiceData {
  businessAvailability?: ApiBusinessAvailability[]
}

interface FormTimeSlot {
  open: string
  close: string
}

export interface DaySchedule {
  [key: string]: FormTimeSlot[]
}

interface FormBusinessAvailability {
  timezone: string
  businessDays: { from: string; to: string }[]
  businessHours: DaySchedule
  breakHours: DaySchedule
}
interface FormServiceAvailability {
  businessDays: { from: string; to: string }[]
  businessHours: DaySchedule
  breakHours: DaySchedule
}

const daysOfWeek = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

const emptySchedule: DaySchedule = Object.fromEntries(
  daysOfWeek.map((day) => [day, []]),
) as DaySchedule

const formatTime = (dateStr: string): string => {
  // Extract just the time part (HH:MM) from the date string
  const timePart = dateStr.match(/\d{2}:\d{2}/)?.[0]

  if (!timePart) {
    return 'Invalid time format'
  }

  return timePart // Returns the time as-is (e.g., "09:00")
}

// --- Transform API response to form values ---
export const transformBusinessAvailability = (
  apiData: ApiBusinessData,
): FormBusinessAvailability => {
  const businessHours = structuredClone(emptySchedule)
  const breakHours = structuredClone(emptySchedule)

  apiData?.businessAvailability?.forEach(({ weekDay, timeSlots }) => {
    const day = weekDay.toLowerCase()
    if (!daysOfWeek.includes(day as any)) return

    timeSlots.forEach(({ type, startTime, endTime }) => {
      const slot = { open: formatTime(startTime), close: formatTime(endTime) }
      if (type === 'WORK') businessHours[day].push(slot)
      else if (type === 'BREAK') breakHours[day].push(slot)
    })
  })

  const selectedDays = daysOfWeek.filter((day) => businessHours[day].length)
  const businessDays: { from: string; to: string }[] = []
  let start = selectedDays[0]
  for (let i = 1; i <= selectedDays.length; i++) {
    const current = selectedDays[i]
    const prev = selectedDays[i - 1]
    const isSequential =
      daysOfWeek.indexOf(current as any) === daysOfWeek.indexOf(prev) + 1
    if (!isSequential || !current) {
      businessDays.push({ from: start, to: prev })
      start = current
    }
  }

  return {
    timezone: apiData.timeZone || 'UTC',
    businessDays: businessDays.length
      ? businessDays
      : [{ from: 'monday', to: 'friday' }],
    businessHours,
    breakHours,
  }
}

// --- Transform form values to API format ---
export const transformToBusinessAvailability = (
  formData: FormBusinessAvailability & { selectedDays: string[] },
  businessDetailFormValues: any,
): {
  businessAvailability: BusinessAvailability[]
  holidays: any[]
  updatedBusinessDetails: any
} => {
  const businessAvailability: BusinessAvailability[] = []

  // Process each day range in businessDays
  formData.businessDays.forEach(({ from, to }) => {
    const startIndex = daysOfWeek.indexOf(from.toLowerCase() as any)
    const endIndex = daysOfWeek.indexOf(to.toLowerCase() as any)

    // If either day is not found, skip this range
    if (startIndex === -1 || endIndex === -1) return

    // Get all days in the range (inclusive)
    const daysInRange = daysOfWeek.slice(
      Math.min(startIndex, endIndex),
      Math.max(startIndex, endIndex) + 1,
    )

    // Process each day in the range
    daysInRange.forEach((day) => {
      const dayName = day as string
      const slots: BusinessTime[] = []

      // Add business hours
      if (formData.businessHours[dayName]?.length) {
        formData.businessHours[dayName].forEach(({ open, close }) => {
          if (open && close) {
            const timeSlot: BusinessTime = {
              type: BusinessTimeType.WORK,
              startTime: `2000-01-01T${open}:00`,
              endTime: `2000-01-01T${close}:00`,
            }
            slots.push(timeSlot)
          }
        })
      }

      // Add break hours if they exist
      if (formData.breakHours?.[dayName]?.length) {
        formData.breakHours[dayName].forEach(({ open, close }) => {
          if (open && close) {
            const timeSlot: BusinessTime = {
              type: BusinessTimeType.BREAK,
              startTime: `2000-01-01T${open}:00`,
              endTime: `2000-01-01T${close}:00`,
            }
            slots.push(timeSlot)
          }
        })
      }

      // Only add the day if there are time slots
      if (slots.length > 0) {
        const availability: BusinessAvailability = {
          weekDay: dayName.toUpperCase() as WeekDays,
          type: AvailabilityType.GENERAL.toUpperCase() as AvailabilityType,
          timeSlots: slots,
        }
        businessAvailability.push(availability)
      }
    })
  })

  // Create holidays for days not present in businessAvailability
  const availableDays = businessAvailability.map((entry) => entry.weekDay)
  const holidays = daysOfWeek
    .filter((day) => !availableDays.includes(day.toUpperCase() as WeekDays))
    .map((day) => ({
      holiday: day.toUpperCase() as WeekDays,
      type: HolidayType.GENERAL,
      date: new Date(`2000-01-01`).toISOString(), // Set default or computed holiday date
    }))

  return {
    businessAvailability,
    updatedBusinessDetails: {
      ...businessDetailFormValues,
      timeZone: formData.timezone,
    },
    holidays,
  }
}

// --- Reusable conversion to API format ---
export const transformToApiFormat = (formData: FormBusinessAvailability) => {
  return {
    timeZone: formData.timezone,
    businessAvailability: daysOfWeek.flatMap((day) => {
      const allSlots = [
        ...(formData.businessHours[day] || []).map((slot) => ({
          type: 'WORK',
          startTime: `2000-01-01T${slot.open}:00`,
          endTime: `2000-01-01T${slot.close}:00`,
        })),
        ...(formData.breakHours?.[day] || []).map((slot) => ({
          type: 'BREAK',
          startTime: `2000-01-01T${slot.open}:00`,
          endTime: `2000-01-01T${slot.close}:00`,
        })),
      ]

      return allSlots.length
        ? [
            {
              weekDay: day.charAt(0).toUpperCase() + day.slice(1),
              timeSlots: allSlots,
            },
          ]
        : []
    }),
  }
}

// --- Convert business availability to service settings ---
export const transformBusinessToServiceSettings = (
  availability: ApiBusinessAvailability[],
) => {
  const serviceHours = structuredClone(emptySchedule)
  availability.forEach(({ weekDay, timeSlots }) => {
    const day = weekDay.toLowerCase()
    timeSlots?.forEach((slot) => {
      if (slot.type === 'WORK') {
        serviceHours[day].push({
          open: formatTime(slot.startTime),
          close: formatTime(slot.endTime),
        })
      }
    })
  })

  const selectedDays = daysOfWeek.filter((day) => serviceHours[day].length)
  const serviceDays: { from: string; to: string }[] = []
  let start = selectedDays[0]
  for (let i = 1; i <= selectedDays.length; i++) {
    const current = selectedDays[i]
    const prev = selectedDays[i - 1]
    const isSequential =
      daysOfWeek.indexOf(current as any) === daysOfWeek.indexOf(prev) + 1
    if (!isSequential || !current) {
      serviceDays.push({ from: start, to: prev })
      start = current
    }
  }

  return {
    serviceDays: serviceDays.length
      ? serviceDays
      : [{ from: 'monday', to: 'friday' }],
    serviceHours,
  }
}

// --- Convert form service settings to API ---
export const transformServiceSettingsToApi = (formData: {
  serviceDays: { from: string; to: string }[]
  serviceHours: DaySchedule
  serviceType: string
  isServiceVisible: boolean
  isPricingEnabled: boolean
}) => {
  return {
    serviceAvailability: daysOfWeek.flatMap((day) => {
      const slots = formData.serviceHours[day] || []
      return slots.length
        ? [
            {
              weekDay: day.charAt(0).toUpperCase() + day.slice(1),
              timeSlots: slots.map((slot) => ({
                startTime: `2000-01-01T${slot.open}:00`,
                endTime: `2000-01-01T${slot.close}:00`,
              })),
            },
          ]
        : []
    }),
    serviceType: formData.serviceType,
    isServiceVisible: formData.isServiceVisible,
    isPricingEnabled: formData.isPricingEnabled,
  }
}

export const transformServiceAvailability = (
  apiData: ApiServiceData,
): FormServiceAvailability => {
  const businessHours = structuredClone(emptySchedule)
  const breakHours = structuredClone(emptySchedule)

  apiData?.businessAvailability?.forEach(({ weekDay, timeSlots }) => {
    const day = weekDay.toLowerCase()
    if (!daysOfWeek.includes(day as any)) return

    timeSlots.forEach(({ type, startTime, endTime }) => {
      const slot = { open: formatTime(startTime), close: formatTime(endTime) }
      if (type === 'WORK') businessHours[day].push(slot)
      else if (type === 'BREAK') breakHours[day].push(slot)
    })
  })

  const selectedDays = daysOfWeek.filter((day) => businessHours[day].length)
  const businessDays: { from: string; to: string }[] = []
  let start = selectedDays[0]
  for (let i = 1; i <= selectedDays.length; i++) {
    const current = selectedDays[i]
    const prev = selectedDays[i - 1]
    const isSequential =
      daysOfWeek.indexOf(current as any) === daysOfWeek.indexOf(prev) + 1
    if (!isSequential || !current) {
      businessDays.push({ from: start, to: prev })
      start = current
    }
  }

  return {
    businessDays: businessDays.length
      ? businessDays
      : [{ from: 'monday', to: 'friday' }],
    businessHours,
    breakHours,
  }
}

function formatTimeTo24Hour(time: string) {
  // Remove AM/PM (case insensitive) and trim whitespace
  let cleaned = time.replace(/\s*(AM|PM)$/i, '').trim()

  // Parse hour and minute from cleaned time (assumes format like '9:00', '12:30', etc)
  let [hourStr, minuteStr] = cleaned.split(':')
  let hour = parseInt(hourStr, 10)
  let minute = minuteStr ? parseInt(minuteStr, 10) : 0

  // Check if original time had PM to convert hour to 24-hour format
  if (/PM$/i.test(time) && hour < 12) {
    hour += 12
  }
  // Handle midnight AM (12 AM = 0)
  if (/AM$/i.test(time) && hour === 12) {
    hour = 0
  }

  // Zero pad hour and minute
  const hh = hour.toString().padStart(2, '0')
  const mm = minute.toString().padStart(2, '0')

  return `${hh}:${mm}`
}

// Transform form data to support business detail api data
export function transformToSupportBusinessDetail(
  formData: any,
  businessId: string,
) {
  const {
    supportTeamName,
    supportEmail,
    supportNumber,
    physicalAddress,
    googleMap,
    businessHours,
    breakHours,
    businessAvailability,
  } = formData

  // Map short day names to full day names
  const dayMap: Record<string, string> = {
    Mon: 'MONDAY',
    Tue: 'TUESDAY',
    Wed: 'WEDNESDAY',
    Thu: 'THURSDAY',
    Fri: 'FRIDAY',
    Sat: 'SATURDAY',
    Sun: 'SUNDAY',
  }

  // 1. Transform business hours and break hours into supportAvailability
  const supportAvailability: any[] = []
  const supportedDays = businessAvailability || []

  // Process each day in business hours
  Object.entries(businessHours || {}).forEach(([day, slots]) => {
    if (!supportedDays.includes(day)) return

    const fullDayName = dayMap[day] || day.toUpperCase()
    const workSlots = (slots as any[]).map(([start, end]) => ({
      type: 'WORK',
      startTime: `2000-01-01T${formatTimeTo24Hour(start)}:00`,
      endTime: `2000-01-01T${formatTimeTo24Hour(end)}:00`,
    }))

    const allSlots = [...workSlots]

    if (allSlots.length > 0) {
      supportAvailability.push({
        weekDay: fullDayName, // Now using full uppercase day name
        type: 'SUPPORT',
        timeSlots: allSlots,
      })
    }
  })

  // 2. Create supportHoliday (days not in businessAvailability)
  const allWeekDays = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]
  const supportedWeekDays = supportedDays.map(
    (day: string) => dayMap[day] || day.toUpperCase(),
  )
  const supportHoliday = allWeekDays
    .filter((day) => !supportedWeekDays.includes(day))
    .map((holidayDay) => ({
      holiday: holidayDay as WeekDays, // Already in full uppercase
      type: 'SUPPORT',
      date: new Date('2000-01-01T00:00:00Z').toISOString(), // Proper ISO-8601 with timezone
    }))

  // 3. Create the final object matching SupportBusinessDetail
  return {
    supportBusinessName: supportTeamName,
    supportEmail,
    supportPhone: supportNumber,
    supportAddress: physicalAddress,
    supportGoogleMap: googleMap,
    businessId,
    supportAvailability,
    supportHoliday,
  }
}
// }
