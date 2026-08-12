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

export interface BookListParams {
  query: string
  subject: string
  sort: SortOption
  page: number
}

export interface FiltersState {
  query: string
  subject: string
  sort: SortOption
  page: number
  setQuery: (query: string) => void
  setSubject: (subject: string) => void
  setSort: (sort: SortOption) => void
  setPage: (page: number) => void
}

export interface SpineColors {
  bg: string
  fg: string
}

export interface SubjectOption {
  label: string
  value: string
}

export interface SortOptionItem {
  value: SortOption
  label: string
}

export interface BookCardProps {
  book: Book
  onSelect: (book: Book) => void
}

export interface BookCoverProps {
  src: string | null
  title: string
}

export interface BookGridProps {
  books: Book[]
  onSelect: (book: Book) => void
}

export interface SkeletonGridProps {
  count?: number
}

export interface StatusMessageProps {
  title: string
  detail: string
  onRetry?: () => void
}

export interface BookDetailDialogProps {
  book: Book | null
  onClose: () => void
}
