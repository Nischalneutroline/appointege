import { WeekDay } from '@/app/(protected)/admin/business-settings/_components/form/business-availability'

type TimeSlot = [string, string]
type BreakRecord = Record<WeekDay, TimeSlot[]>

/**
 * Normalizes business days and break hours to match the expected format for BusinessHourSelector
 * @param businessDays - Array of business days (e.g., ['Mon', 'Tue', 'Wed'])
 * @param breakHours - Record of break hours for each day
 * @returns Normalized object with businessDays and breakHours
 */
export const normalizeBusinessHours = (
  businessDays: WeekDay[],
  breakHours: Record<string, TimeSlot[]> = {}
): { businessDays: WeekDay[]; breakHours: BreakRecord } => {
  const allDays: WeekDay[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  
  // Ensure businessDays only contains valid WeekDay values
  const normalizedBusinessDays = businessDays.filter((day): day is WeekDay => 
    allDays.includes(day as WeekDay)
  )

  // Initialize break hours for all days with empty arrays
  const normalizedBreakHours = allDays.reduce((acc, day) => {
    // Use existing breaks if they exist and are in the correct format, otherwise use empty array
    const existingBreaks = breakHours[day]
    acc[day] = Array.isArray(existingBreaks) 
      ? existingBreaks.filter(slot => 
          Array.isArray(slot) && 
          slot.length === 2 && 
          typeof slot[0] === 'string' && 
          typeof slot[1] === 'string'
        )
      : []
    return acc
  }, {} as BreakRecord)

  return {
    businessDays: normalizedBusinessDays.length > 0 ? normalizedBusinessDays : [...allDays],
    breakHours: normalizedBreakHours
  }
}

/**
 * Validates if a time string is in the expected format (HH:MM AM/PM)
 * @param time - Time string to validate
 * @returns boolean indicating if the time string is valid
 */
const isValidTimeFormat = (time: string): boolean => {
  return /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(?:AM|PM)$/i.test(time)
}

/**
 * Converts a time string to minutes since midnight for comparison
 * @param time - Time string in format 'HH:MM AM/PM'
 * @returns Number of minutes since midnight
 */
export const timeToMinutes = (time: string): number => {
  if (!isValidTimeFormat(time)) return 0
  
  const [timePart, period] = time.split(' ')
  const [hours, minutes] = timePart.split(':').map(Number)
  
  let totalMinutes = hours % 12 * 60 + minutes
  if (period.toUpperCase() === 'PM') {
    totalMinutes += 12 * 60
  }
  
  return totalMinutes
}

/**
 * Ensures break times are within business hours
 * @param breaks - Array of break time slots
 * @param businessHours - Array of business hour slots for the day
 * @returns Array of validated break time slots
 */
export const validateBreaksAgainstBusinessHours = (
  breaks: TimeSlot[],
  businessHours: TimeSlot[]
): TimeSlot[] => {
  if (!businessHours.length) return []
  
  return breaks.filter(([start, end]) => {
    const startMin = timeToMinutes(start)
    const endMin = timeToMinutes(end)
    
    // Skip invalid time slots
    if (startMin >= endMin) return false
    
    // Check if break is within any business hour slot
    return businessHours.some(([busStart, busEnd]) => {
      const busStartMin = timeToMinutes(busStart)
      const busEndMin = timeToMinutes(busEnd)
      
      return startMin >= busStartMin && endMin <= busEndMin
    })
  })
}
