import { create } from 'zustand'
import type { FiltersState } from '../types'

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
