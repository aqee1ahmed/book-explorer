import { config } from '../config'
import { VOLUME_SCAN_LIMIT } from '../constants'
import { fetchJson } from '../utils/http'
import type { GoogleVolumesResponse, RatingInfo } from '../types'

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
    maxResults: String(VOLUME_SCAN_LIMIT),
    fields: 'items/volumeInfo(averageRating,ratingsCount)',
  })
  if (config.googleBooksApiKey) params.set('key', config.googleBooksApiKey)
  try {
    const response = await fetchJson<GoogleVolumesResponse>(`${config.googleBooksUrl}/volumes?${params}`)
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
