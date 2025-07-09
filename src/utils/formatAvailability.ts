import { Service } from '@/app/(protected)/admin/service/_types/service'

// Format availability as a comma-separated string with consecutive days using a dash and abbreviated names
export const formatAvailability = (
  availability?: Service['serviceAvailability'],
) => {
  if (!availability || availability.length === 0) return 'Not available'

  // Map database weekday format (all caps) to abbreviated display format
  const weekdayMap: { [key: string]: string } = {
    MONDAY: 'Mon',
    TUESDAY: 'Tue',
    WEDNESDAY: 'Wed',
    THURSDAY: 'Thu',
    FRIDAY: 'Fri',
    SATURDAY: 'Sat',
    SUNDAY: 'Sun',
  }

  // List of weekdays in order to determine consecutiveness
  const weekdaysOrder = [
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ]

  // Map availability to their weekday names and sort by order
  const sortedDays = availability
    .map((avail) => avail.weekDay)
    .sort((a, b) => weekdaysOrder.indexOf(a) - weekdaysOrder.indexOf(b))

  if (sortedDays.length === 1) return weekdayMap[sortedDays[0]]

  const result: string[] = []
  let start = sortedDays[0]
  let prevIndex = weekdaysOrder.indexOf(sortedDays[0])

  for (let i = 1; i < sortedDays.length; i++) {
    const currentIndex = weekdaysOrder.indexOf(sortedDays[i])

    // Check if current day is consecutive to the previous day
    if (currentIndex === prevIndex + 1) {
      // If this is the last day, finalize the range
      if (i === sortedDays.length - 1) {
        result.push(`${weekdayMap[start]}-${weekdayMap[sortedDays[i]]}`)
      }
    } else {
      // Non-consecutive: finalize the previous range or single day
      if (start === sortedDays[i - 1]) {
        result.push(weekdayMap[start])
      } else {
        result.push(`${weekdayMap[start]}-${weekdayMap[sortedDays[i - 1]]}`)
      }
      // Start a new range
      start = sortedDays[i]
      // If this is the last day and not consecutive, add it as a single day
      if (i === sortedDays.length - 1) {
        result.push(weekdayMap[start])
      }
    }
    prevIndex = currentIndex
  }

  // Handle case where there's only one range or a single day at the start
  if (
    sortedDays.length === 2 &&
    weekdaysOrder.indexOf(sortedDays[1]) ===
      weekdaysOrder.indexOf(sortedDays[0]) + 1
  ) {
    return `${weekdayMap[sortedDays[0]]}-${weekdayMap[sortedDays[1]]}`
  }

  return result.join(', ')
}
