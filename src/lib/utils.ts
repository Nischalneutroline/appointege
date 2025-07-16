import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getInitials(name: string): string {
  if (!name) return ''

  return name
    .trim()
    .split(/\s+/) // split by any whitespace
    .map((word) => word[0].toUpperCase())
    .join('')
    .slice(0, 2) // optional: limit to 2 characters
}


// Format timezone with offset and get offset in minutes for sorting
export const getTimezoneInfo = (timezone: string) => {
  try {
    // Create a date object
    const now = new Date()
    const offsetMinutes = now.getTimezoneOffset()
    const offsetHours = Math.abs(offsetMinutes) / 60
    const hours = Math.floor(offsetHours)
    const minutes = Math.round((offsetHours - hours) * 60)

    // Format with leading zeros for single digits
    const formattedHours = hours.toString().padStart(2, '0')
    const formattedMinutes =
      minutes > 0 ? `:${minutes.toString().padStart(2, '0')}` : ''

    const sign = offsetMinutes <= 0 ? '+' : '-'
    const offsetString = `GMT${sign}${formattedHours}${formattedMinutes}`

    // Pad the timezone name to ensure consistent alignment
    const paddedTimezone = timezone.padEnd(18, ' ')

    return {
      label: `${paddedTimezone} (${offsetString})`,
      value: timezone,
      offset: -offsetMinutes, // Sort key (in minutes)
    }
  } catch (e) {
    return {
      label: timezone.padEnd(18, ' ') + ' (GMT+00:00)',
      value: timezone,
      offset: 0,
    }
  }
}