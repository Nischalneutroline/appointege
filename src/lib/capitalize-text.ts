export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return str // Handle empty or null/undefined
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
