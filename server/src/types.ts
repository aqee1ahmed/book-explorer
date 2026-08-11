export type SortOption = 'relevance' | 'rating' | 'new'

export interface Book {
  id: string
  title: string
  authors: string[]
  firstPublishYear: number | null
  coverUrl: string | null
  isbn: string | null
  averageRating: number | null
  ratingsCount: number | null
  ratingsSource: 'google-books' | null
}

export type BaseBook = Omit<Book, 'averageRating' | 'ratingsCount' | 'ratingsSource'>

export interface RatingInfo {
  averageRating: number
  ratingsCount: number
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
