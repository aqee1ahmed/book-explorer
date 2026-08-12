import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./api/books')

import App from './App'
import { fetchBooks } from './api/books'
import type { Book } from './types'
import { useFiltersStore } from './store/filtersStore'

const initialState = useFiltersStore.getState()

const bookFixture: Book = {
  id: 'OL1W',
  title: 'Dune',
  authors: ['Frank Herbert'],
  firstPublishYear: 1965,
  coverUrl: null,
  isbn: null,
  averageRating: 4.2,
  ratingsCount: 1234,
  ratingsSource: 'google-books',
}

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>,
  )
}

beforeEach(() => {
  useFiltersStore.setState(initialState, true)
  vi.mocked(fetchBooks).mockReset()
})

describe('App', () => {
  it('shows skeletons and then the loaded books', async () => {
    vi.mocked(fetchBooks).mockResolvedValue({
      books: [bookFixture],
      page: 1,
      pageSize: 20,
      totalResults: 1,
      totalPages: 1,
    })
    renderApp()
    expect(screen.getAllByTestId('skeleton-card').length).toBeGreaterThan(0)
    expect((await screen.findAllByText('Dune')).length).toBeGreaterThan(0)
  })

  it('shows the empty state when nothing matches', async () => {
    vi.mocked(fetchBooks).mockResolvedValue({
      books: [],
      page: 1,
      pageSize: 20,
      totalResults: 0,
      totalPages: 0,
    })
    renderApp()
    expect(await screen.findByText('No books found')).toBeInTheDocument()
  })

  it('shows the error state when the request fails', async () => {
    vi.mocked(fetchBooks).mockRejectedValue(new Error('boom'))
    renderApp()
    expect(await screen.findByText('Something went wrong')).toBeInTheDocument()
  })
})
