// Utility function to truncate description to 6–7 words
export const truncateDescription = (text: string): string => {
  const words = text.trim().split(/\s+/)
  const maxWords = 7
  const minWords = 6
  const wordCount = words.length

  if (wordCount <= minWords) {
    return text
  }

  const truncated = words.slice(0, Math.min(wordCount, maxWords)).join(' ')
  return wordCount > maxWords ? `${truncated}...` : truncated
}
