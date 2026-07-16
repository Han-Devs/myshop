export const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/'

export function getImageUrl(image) {
  if (!image) return ''

  if (image.startsWith('/uploads')) {
    return `${API_BASE_URL}${image}`
  }

  return image
}