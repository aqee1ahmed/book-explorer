export type SortOption = 'relevance' | 'rating' | 'new'

export type RatingSource = 'google-books' | 'open-library'

export interface Book {
  id: string
  title: string
  authors: string[]
  firstPublishYear: number | null
  coverUrl: string | null
  isbn: string | null
  averageRating: number | null
  ratingsCount: number | null
  ratingsSource: RatingSource | null
}

export type BaseBook = Omit<Book, 'averageRating' | 'ratingsCount' | 'ratingsSource'>

export interface RatingInfo {
  averageRating: number
  ratingsCount: number
}

export interface SearchResultBook extends BaseBook {
  openLibraryRating: RatingInfo | null
}

export interface BookDetail {
  id: string
  description: string | null
  subjects: string[]
}

export interface BookListResponse {
  books: Book[]
  page: number
  pageSize: number
  totalResults: number
  totalPages: number
}

export interface BookQuery {
  q?: string
  subject?: string
  sort: SortOption
  page: number
}

export interface ApiError {
  error: {
    message: string
    code: string
  }
}

export interface OpenLibrarySearchDoc {
  key?: string
  title?: string
  author_name?: string[]
  first_publish_year?: number
  cover_i?: number
  isbn?: string[]
  ratings_average?: number
  ratings_count?: number
}

export interface OpenLibrarySearchResponse {
  numFound: number
  docs: OpenLibrarySearchDoc[]
}

export interface OpenLibraryWorkResponse {
  description?: string | { value: string }
  subjects?: string[]
}

export interface GoogleVolumesResponse {
  items?: { volumeInfo?: { averageRating?: number; ratingsCount?: number } }[]
}

export interface CacheEntry<T> {
  value: T
  expiresAt: number
}

export interface TtlCache<T> {
  get: (key: string) => T | undefined
  set: (key: string, value: T) => void
  clear: () => void
}
