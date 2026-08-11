import { create } from 'zustand'
import type { SortOption } from '../api/types'

interface FiltersState {
  query: string
  subject: string
  sort: SortOption
  page: number
  setQuery: (query: string) => void
  setSubject: (subject: string) => void
  setSort: (sort: SortOption) => void
  setPage: (page: number) => void
}

export const useFiltersStore = create<FiltersState>()((set) => ({
  query: '',
  subject: 'fiction',
  sort: 'relevance',
  page: 1,
  setQuery: (query) => set({ query, page: 1 }),
  setSubject: (subject) => set({ subject, query: '', page: 1 }),
  setSort: (sort) => set({ sort, page: 1 }),
  setPage: (page) => set({ page }),
}))
