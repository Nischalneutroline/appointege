export const timeOptions = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 4) + 8
  const minutes = (i % 4) * 15
  const period = hours >= 12 ? 'PM' : 'AM'
  const hour12 = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours
  return `${hour12.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`
})

/* Convert time to minutes since midnight (e.g., "09:30 PM" -> 1290) */
export const toMin = (t: string) => {
  if (!t) return -1
  const [hm, ap] = t.split(' ')
  let [h, m] = hm.split(':').map(Number)
  if (ap === 'PM' && h !== 12) h += 12
  if (ap === 'AM' && h === 12) h = 0
  return h * 60 + m
}

export const toDate = (timeString: string): string => {
  const today = new Date()
  const [hours, minutes, modifier] = timeString.split(/[: ]/)
  let hour = parseInt(hours, 10)

  if (modifier === 'PM' && hour !== 12) {
    hour += 12
  } else if (modifier === 'AM' && hour === 12) {
    hour = 0
  }

  today.setHours(hour, parseInt(minutes, 10), 0, 0)
  return today.toISOString() // Return the date in ISO 8601 format
}
