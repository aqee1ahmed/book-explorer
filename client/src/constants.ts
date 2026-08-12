import type { SortOptionItem, SubjectOption } from './types'

export const DEBOUNCE_MS = 400
export const MAX_PAGES = 100
export const SKELETON_COUNT = 10

export const SUBJECTS: SubjectOption[] = [
  { label: 'Fiction', value: 'fiction' },
  { label: 'Fantasy', value: 'fantasy' },
  { label: 'Mystery', value: 'mystery' },
  { label: 'Sci-Fi', value: 'science fiction' },
  { label: 'History', value: 'history' },
  { label: 'Biography', value: 'biography' },
  { label: 'Romance', value: 'romance' },
]

export const SORT_OPTIONS: SortOptionItem[] = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'new', label: 'Newest' },
]
