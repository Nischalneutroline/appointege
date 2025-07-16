// this function creates the form value from the business Availability structure from the API
import { DaySchedule } from './businessSchema'

type DayKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

interface TimeSlot {
  open: string;
  close: string;
}

const daysOfWeek = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
]

export const transformBusinessToServiceSettings = (availability: any[]) => {
  const serviceHours: DaySchedule = {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
    default: [],
  } as const

  const activeDays: string[] = []

  availability.forEach((dayData) => {
    const day = dayData.weekDay.toLowerCase()
    const timeSlots = dayData.timeSlots || []

    const workSlots = timeSlots.filter((slot: any) => slot.type === 'WORK')
    const breakSlots = timeSlots.filter((slot: any) => slot.type === 'BREAK')

    if (workSlots.length > 0) {
      activeDays.push(day)

      // Sort breaks and works
      const breaks = breakSlots
        .map((b: any) => ({
          open: b.startTime?.slice(11, 16),
          close: b.endTime?.slice(11, 16),
        }))
        .sort((a: TimeSlot, b: TimeSlot) => a.open.localeCompare(b.open))

      workSlots.forEach((workSlot: any) => {
        const workStart = workSlot.startTime.slice(11, 16)
        const workEnd = workSlot.endTime.slice(11, 16)

        // If no breaks, add the full work slot
        if (breaks.length === 0) {
          const dayKey = day.toLowerCase() as DayKey;
          if (dayKey in serviceHours) {
            serviceHours[dayKey].push({ open: workStart, close: workEnd });
          }
        } else {
          let currentStart = workStart
          for (const br of breaks) {
            if (currentStart < br.open) {
              const dayKey = day.toLowerCase() as DayKey;
              if (dayKey in serviceHours) {
                serviceHours[dayKey].push({ open: currentStart, close: br.open });
              }
            }
            currentStart = br.close > currentStart ? br.close : currentStart
          }
          if (currentStart < workEnd) {
            const dayKey = day.toLowerCase() as DayKey;
            if (dayKey in serviceHours) {
              serviceHours[dayKey].push({ open: currentStart, close: workEnd });
            }
          }
        }
      })
    }
  })

  // Convert active days into ranges like [{ from: 'monday', to: 'friday' }]
  const activeIndexes = activeDays
    .map((day) => daysOfWeek.indexOf(day))
    .filter((i) => i !== -1)
    .sort((a, b) => a - b)

  const serviceDays: { from: string; to: string }[] = []
  if (activeIndexes.length > 0) {
    let start = activeIndexes[0]
    let end = activeIndexes[0]

    for (let i = 1; i < activeIndexes.length; i++) {
      if (activeIndexes[i] === end + 1) {
        end = activeIndexes[i]
      } else {
        serviceDays.push({ from: daysOfWeek[start], to: daysOfWeek[end] })
        start = activeIndexes[i]
        end = activeIndexes[i]
      }
    }

    serviceDays.push({ from: daysOfWeek[start], to: daysOfWeek[end] })
  }

  return { serviceDays, serviceHours }
}
