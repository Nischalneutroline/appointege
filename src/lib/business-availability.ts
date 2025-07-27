// import {
//   AvailabilityType,
//   BusinessAvailability,
//   BusinessTime,
//   Holiday,
//   HolidayType,
//   WeekDays,
// } from '@/store/slices/businessSlice'
// import { BusinessTimeType } from '@/store/slices/businessSlice'

// interface FormFormat {
//   timeZone: string
//   businessAvailability: string[] // ["Mon", "Tue", ...]
//   businessHours: Record<string, [string, string][]>
//   breakHours: Record<string, [string, string][]>
//   holidays: string[]
// }

// interface TransformedFormat {
//   timeZone: string
//   businessAvailability: BusinessAvailability[]
//   holiday: Holiday[]
// }
// // Utility: 24-hour to 12-hour format
// const to12HourFormat = (timeStr: string): string => {
//   if (!timeStr) return ''
//   const [hourStr, minuteStr] = timeStr.split(':')
//   let hour = Number(hourStr)
//   const minute = Number(minuteStr)
//   const ampm = hour >= 12 ? 'PM' : 'AM'
//   hour = hour % 12 === 0 ? 12 : hour % 12
//   return `${hour.toString().padStart(2, '0')}:${minute
//     .toString()
//     .padStart(2, '0')} ${ampm}`
// }

// // Utility: 12-hour to 24-hour format
// const to24HourFormat = (timeStr: string): string => {
//   if (!timeStr) return ''
//   const [time, modifier] = timeStr.split(' ')
//   let [hour, minute] = time.split(':').map(Number)
//   if (modifier === 'PM' && hour !== 12) hour += 12
//   if (modifier === 'AM' && hour === 12) hour = 0
//   return `${hour.toString().padStart(2, '0')}:${minute
//     .toString()
//     .padStart(2, '0')}:00`
// }

// const dayMap = {
//   Mon: 'MONDAY',
//   Tue: 'TUESDAY',
//   Wed: 'WEDNESDAY',
//   Thu: 'THURSDAY',
//   Fri: 'FRIDAY',
//   Sat: 'SATURDAY',
//   Sun: 'SUNDAY',
// } as const

// const dayMapReverse = Object.fromEntries(
//   Object.entries(dayMap).map(([k, v]) => [v, k]),
// ) as Record<string, string>

// // --- Convert form data to API format ---
// export const convertToApiFormat = (formData: FormFormat): TransformedFormat => {
//   const timeZone = formData.timeZone
//   const fixedDate = '2000-01-01'
//   const businessAvailability: BusinessAvailability[] = (
//     formData.businessAvailability ?? []
//   ).map((dayKey) => {
//     const weekDay = (dayMap[dayKey as keyof typeof dayMap] ||
//       dayKey) as WeekDays
//     const workSlots = formData.businessHours?.[dayKey] ?? []
//     const breakSlots = formData.breakHours?.[dayKey] ?? []
//     const timeSlots: BusinessTime[] = [
//       ...workSlots.map(([start, end]) => ({
//         type: BusinessTimeType.WORK,
//         startTime: `${fixedDate}T${to24HourFormat(start)}`,
//         endTime: `${fixedDate}T${to24HourFormat(end)}`,
//       })),
//       ...breakSlots.map(([start, end]) => ({
//         type: BusinessTimeType.BREAK,
//         startTime: `${fixedDate}T${to24HourFormat(start)}`,
//         endTime: `${fixedDate}T${to24HourFormat(end)}`,
//       })),
//     ]
//     return {
//       weekDay,
//       type: AvailabilityType.GENERAL,
//       timeSlots,
//     }
//   })

//   const holiday: Holiday[] = formData.holidays.map((day) => ({
//     holiday: dayMap[day as keyof typeof dayMap] as WeekDays,
//     date: '2000-01-01T00:00:00.000Z', // dummy
//     type: HolidayType.GENERAL,
//   }))

//   return { timeZone, businessAvailability, holiday }
// }

// // --- Convert API data to form data ---
// export const convertFromApiFormat = (
//   apiData: TransformedFormat,
// ): FormFormat => {
//   const timeZone = apiData.timeZone
//   const businessAvailability: string[] = []
//   const businessHours: Record<string, [string, string][]> = {}
//   const breakHours: Record<string, [string, string][]> = {}
//   ;(apiData.businessAvailability ?? []).forEach((day: BusinessAvailability) => {
//     const dayKey = dayMapReverse[day.weekDay] || day.weekDay
//     businessAvailability.push(dayKey)
//     businessHours[dayKey] = []
//     breakHours[dayKey] = []
//     ;(day.timeSlots ?? []).forEach((slot: BusinessTime) => {
//       const start = to12HourFormat(slot.startTime.split('T')[1])
//       const end = to12HourFormat(slot.endTime.split('T')[1])
//       if (slot.type === BusinessTimeType.WORK) {
//         businessHours[dayKey].push([start, end])
//       } else if (slot.type === BusinessTimeType.BREAK) {
//         breakHours[dayKey].push([start, end])
//       }
//     })
//   })

//   const holidays =
//     apiData.holiday?.map((h) => dayMapReverse[h.holiday] || h.holiday) ?? []

//   return {
//     timeZone,
//     businessAvailability,
//     businessHours,
//     breakHours,
//     holidays,
//   }
// }

// // --- Convert API service availability to object ---
// export const convertServiceAvailabilityToObject = (
//   serviceAvailabilityArray: {
//     weekDay: string
//     timeSlots: { startTime: string; endTime: string }[]
//   }[],
// ): Record<string, [string, string][]> => {
//   console.log(serviceAvailabilityArray, 'serviceAvailabilityArray')
//   const result: Record<string, [string, string][]> = {}

//   if (!Array.isArray(serviceAvailabilityArray)) {
//     console.warn(
//       'serviceAvailabilityArray is not an array:',
//       serviceAvailabilityArray,
//     )
//     return result
//   }

//   serviceAvailabilityArray.forEach(({ weekDay, timeSlots }) => {
//     const shortDay = dayMapReverse[weekDay as keyof typeof dayMapReverse]
//     if (!shortDay) {
//       console.warn(`Invalid weekDay: ${weekDay}`)
//       return
//     }
//     result[shortDay] = (timeSlots ?? []).map(({ startTime, endTime }) => {
//       const start = to12HourFormat(startTime.split('T')[1])
//       const end = to12HourFormat(endTime.split('T')[1])
//       return [start, end]
//     })
//   })
//   console.log(result, 'result')
//   return result
// }

// // --- Convert service availability object to API format ---
// export const convertServiceAvailabilityToApi = (
//   serviceAvailabilityObject: Record<string, [string, string][]>,
// ) => {
//   const fixedDate = '2000-01-01'
//   return Object.entries(serviceAvailabilityObject ?? {})
//     .filter(([, slots]) => Array.isArray(slots) && slots.length > 0)
//     .map(([shortDay, slots]) => {
//       const weekDay = dayMap[shortDay as keyof typeof dayMap] as WeekDays
//       if (!weekDay) {
//         console.warn(`Invalid day key: ${shortDay}`)
//         return null
//       }
//       return {
//         weekDay,
//         timeSlots: (slots ?? []).map(([start, end]) => ({
//           startTime: `${fixedDate}T${to24HourFormat(start)}`,
//           endTime: `${fixedDate}T${to24HourFormat(end)}`,
//         })),
//       }
//     })
//     .filter((item): item is NonNullable<typeof item> => item !== null)
// }
