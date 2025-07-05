/**
 * Generates a random avatar color in HSL format.
 *
 * The hue is a random value between 0 and 359 degrees.
 * The saturation is a random value between 40% and 80%.
 * The lightness is a random value between 40% and 70%.
 *
 * @returns {string} A string representing the color in HSL format.
 */

export function getRandomAvatarColor(): string {
  const hue = Math.floor(Math.random() * 360)
  const saturation = Math.floor(Math.random() * (80 - 40 + 1)) + 40
  const lightness = Math.floor(Math.random() * (70 - 40 + 1)) + 40
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
