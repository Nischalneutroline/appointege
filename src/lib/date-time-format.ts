// Helper function to format date and time
export const formatAppointmentDateTime = (dateString: string | undefined) => {
  // Return default values if no date string is provided
  if (!dateString) {
    return { formattedDate: 'N/A', formattedTime: 'N/A' }
  }

  // Try parsing the date with different formats
  let date: Date

  // First, try parsing as ISO string
  date = new Date(dateString)

  // If that fails, try parsing as a date string with time
  if (isNaN(date.getTime())) {
    // Try different date formats here if needed
    // For example, if your date is in 'MM/DD/YYYY' format:
    const parts = dateString.split(/[\/\s:-]/)
    if (parts.length >= 3) {
      // Try different formats based on the parts
      const year = parts[0].length === 4 ? parts[0] : parts[2]
      const month =
        parseInt(parts[0].length === 4 ? parts[1] : parts[0], 10) - 1
      const day = parts[0].length === 4 ? parts[2] : parts[1]

      date = new Date(parseInt(year, 10), month, parseInt(day, 10))
    }
  }

  // Check if the date is valid after all parsing attempts
  if (isNaN(date.getTime())) {
    console.warn('Invalid date string:', dateString)
    return {
      formattedDate: 'Invalid date',
      formattedTime: 'Invalid time',
      rawDate: dateString,
    }
  }

  // Format date as "MMM DD, YYYY" (e.g., "Jun 21, 2025")
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  // Format time as "HH:MM AM/PM" (e.g., "11:45 PM")
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return {
    formattedDate,
    formattedTime,
    rawDate: dateString,
  }
}
