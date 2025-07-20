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

function generateSupportHolidaysFromServiceDays(serviceDays: string[]) {
  const allWeekDays = Object.values(WeekDays)

  // Filter days not in serviceDays → holidays
  const holidays = allWeekDays
    .filter((day) => !serviceDays.includes(day))
    .map((day) => ({
      holiday: day as WeekDays,
      type: HolidayType.SUPPORT,
      // no date
    }))

  return holidays
}

interface Slot {
  open: string
  close: string
}

export function transformFormToSupportBusinessDetailAPI(
  formData: any,
  businessId: string,
) {
  const supportAvailability: BusinessAvailability[] = []

  const businessHours = formData?.  businessHours || {}
  const breakHours = formData?.breakHours || {}
  const serviceDays: string[] = formData?.serviceDays || []

  const allDays = Object.keys(businessHours)

  allDays.forEach((day) => {
    // Create WORK timeSlots from businessHours
    const workSlots = (businessHours[day] || []).map((slot: Slot) => ({
      startTime: `2000-01-01T${slot.open}:00`,
      endTime: `2000-01-01T${slot.close}:00`,
      type: 'WORK',
    }))

    // Create BREAK timeSlots from breakHours
    const breakSlots = (breakHours[day] || []).map((slot: Slot) => ({
      startTime: `2000-01-01T${slot.open}:00`,
      endTime: `2000-01-01T${slot.close}:00`,
      type: 'BREAK',
    }))

    const allSlots = [...workSlots, ...breakSlots]

    if (allSlots.length > 0) {
      supportAvailability.push({
        weekDay: WeekDays[day.toUpperCase() as keyof typeof WeekDays],
        type: AvailabilityType.SUPPORT,
        timeSlots: allSlots,
      })
    }
  })

  // Derive holidays from days NOT in serviceDays
  const allWeekDays = Object.values(WeekDays)
  const derivedHolidays = allWeekDays
    .filter((day) => !serviceDays.includes(day))
    .map((holidayDay) => ({
      holiday: holidayDay,
      type: HolidayType.SUPPORT,
    }))

  // Combine with existing holidays from formData, removing any 'id'
  const existingHolidays = (formData.supportHoliday || []).map(
    ({ id, ...rest }: any) => rest,
  )

  const supportHoliday = [...derivedHolidays, ...existingHolidays]

  return {
    supportBusinessName: formData.supportTeamName,
    supportEmail: formData.supportEmail,
    supportPhone: formData.supportNumber,
    businessId,
    supportAddress: formData.physicalAddress,
    supportGoogleMap: formData.googleMap,
    supportAvailability,
    supportHoliday,
  }
}
