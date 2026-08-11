import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchBookDetail, fetchBooks } from '../api/books'
import { useFiltersStore } from '../store/filtersStore'

export function useBooks() {
  const query = useFiltersStore((state) => state.query)
  const subject = useFiltersStore((state) => state.subject)
  const sort = useFiltersStore((state) => state.sort)
  const page = useFiltersStore((state) => state.page)

  return useQuery({
    queryKey: ['books', { query, subject, sort, page }],
    queryFn: () => fetchBooks({ query, subject, sort, page }),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60_000,
  })
}

export function useBookDetail(id: string | null) {
  return useQuery({
    queryKey: ['book-detail', id],
    queryFn: () => fetchBookDetail(id as string),
    enabled: id !== null,
    staleTime: 60 * 60_000,
  })
}
