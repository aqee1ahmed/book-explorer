import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/clients/openLibrary')
vi.mock('../src/clients/googleBooks')

import { searchBooks, getWorkDetail } from '../src/clients/openLibrary'
import { getRating } from '../src/clients/googleBooks'
import { getBookDetail, getBooks, resetCaches } from '../src/services/bookService'
import type { BaseBook } from '../src/types'

const searchBooksMock = vi.mocked(searchBooks)
const getWorkDetailMock = vi.mocked(getWorkDetail)
const getRatingMock = vi.mocked(getRating)

function baseBook(id: string, title: string): BaseBook {
  return {
    id,
    title,
    authors: ['Author'],
    firstPublishYear: 2000,
    coverUrl: null,
    isbn: null,
  }
}

beforeEach(() => {
  vi.clearAllMocks()
  resetCaches()
})

describe('getBooks', () => {
  it('merges google ratings into open library books', async () => {
    searchBooksMock.mockResolvedValue({ books: [baseBook('OL1W', 'Dune')], totalResults: 45 })
    getRatingMock.mockResolvedValue({ averageRating: 4.2, ratingsCount: 100 })
    const result = await getBooks({ q: 'dune', sort: 'relevance', page: 1 })
    expect(result.books[0]).toMatchObject({
      id: 'OL1W',
      averageRating: 4.2,
      ratingsCount: 100,
      ratingsSource: 'google-books',
    })
    expect(result).toMatchObject({ page: 1, pageSize: 20, totalResults: 45, totalPages: 3 })
  })

  it('returns null rating fields when google has no data', async () => {
    searchBooksMock.mockResolvedValue({ books: [baseBook('OL1W', 'Dune')], totalResults: 1 })
    getRatingMock.mockResolvedValue(null)
    const result = await getBooks({ q: 'dune', sort: 'relevance', page: 1 })
    expect(result.books[0]).toMatchObject({
      averageRating: null,
      ratingsCount: null,
      ratingsSource: null,
    })
  })

  it('sorts the page by rating with unrated books last', async () => {
    searchBooksMock.mockResolvedValue({
      books: [baseBook('OL1W', 'A'), baseBook('OL2W', 'B'), baseBook('OL3W', 'C')],
      totalResults: 3,
    })
    getRatingMock
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ averageRating: 4.5, ratingsCount: 10 })
      .mockResolvedValueOnce({ averageRating: 3.1, ratingsCount: 5 })
    const result = await getBooks({ q: 'x', sort: 'rating', page: 1 })
    expect(result.books.map((book) => book.id)).toEqual(['OL2W', 'OL3W', 'OL1W'])
  })

  it('serves repeated queries from the cache', async () => {
    searchBooksMock.mockResolvedValue({ books: [], totalResults: 0 })
    const query = { q: 'dune', sort: 'relevance', page: 1 } as const
    await getBooks(query)
    await getBooks(query)
    expect(searchBooksMock).toHaveBeenCalledTimes(1)
  })
})

describe('getBookDetail', () => {
  it('caches work details', async () => {
    getWorkDetailMock.mockResolvedValue({ id: 'OL1W', description: 'Desc', subjects: [] })
    await getBookDetail('OL1W')
    await getBookDetail('OL1W')
    expect(getWorkDetailMock).toHaveBeenCalledTimes(1)
  })
})
