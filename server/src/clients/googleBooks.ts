import { fetchJson } from '../lib/http'
import type { RatingInfo } from '../types'

const BASE_URL = process.env.GOOGLE_BOOKS_URL ?? 'https://www.googleapis.com/books/v1'

interface VolumesResponse {
  items?: { volumeInfo?: { averageRating?: number; ratingsCount?: number } }[]
}

export async function getRating(isbn: string | null, title: string, author?: string): Promise<RatingInfo | null> {
  if (isbn) {
    const byIsbn = await queryRating(`isbn:${isbn}`)
    if (byIsbn) return byIsbn
  }
  const titleQuery = author ? `intitle:"${title}" inauthor:"${author}"` : `intitle:"${title}"`
  return queryRating(titleQuery)
}

async function queryRating(q: string): Promise<RatingInfo | null> {
  const params = new URLSearchParams({
    q,
    maxResults: '5',
    fields: 'items/volumeInfo(averageRating,ratingsCount)',
  })
  const apiKey = process.env.GOOGLE_BOOKS_API_KEY
  if (apiKey) params.set('key', apiKey)
  try {
    const response = await fetchJson<VolumesResponse>(`${BASE_URL}/volumes?${params}`)
    const rated = response.items?.find((item) => item.volumeInfo?.averageRating !== undefined)
    if (rated?.volumeInfo?.averageRating === undefined) return null
    return {
      averageRating: rated.volumeInfo.averageRating,
      ratingsCount: rated.volumeInfo.ratingsCount ?? 0,
    }
  } catch {
    return null
  }
}
