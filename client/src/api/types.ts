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
