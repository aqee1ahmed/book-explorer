import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/lib/http', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/lib/http')>()),
  fetchJson: vi.fn(),
}))

import { fetchJson } from '../src/lib/http'
import { getWorkDetail, searchBooks } from '../src/clients/openLibrary'

const fetchJsonMock = vi.mocked(fetchJson)

describe('searchBooks', () => {
  beforeEach(() => {
    fetchJsonMock.mockReset()
  })

  it('maps search docs to base books and skips malformed docs', async () => {
    fetchJsonMock.mockResolvedValue({
      numFound: 2,
      docs: [
        {
          key: '/works/OL1W',
          title: 'Dune',
          author_name: ['Frank Herbert'],
          first_publish_year: 1965,
          cover_i: 11481354,
          isbn: ['0441013597', '9780441013593'],
          ratings_average: 4.3061223,
          ratings_count: 441,
        },
        { title: 'Doc without key' },
      ],
    })
    const result = await searchBooks({ q: 'dune', sort: 'relevance', page: 1 })
    expect(result.totalResults).toBe(2)
    expect(result.books).toEqual([
      {
        id: 'OL1W',
        title: 'Dune',
        authors: ['Frank Herbert'],
        firstPublishYear: 1965,
        coverUrl: 'https://covers.openlibrary.org/b/id/11481354-M.jpg',
        isbn: '9780441013593',
        openLibraryRating: { averageRating: 4.31, ratingsCount: 441 },
      },
    ])
  })

  it('fills nulls for missing optional fields', async () => {
    fetchJsonMock.mockResolvedValue({
      numFound: 1,
      docs: [{ key: '/works/OL2W', title: 'Obscure Book' }],
    })
    const result = await searchBooks({ q: 'obscure', sort: 'relevance', page: 1 })
    expect(result.books[0]).toEqual({
      id: 'OL2W',
      title: 'Obscure Book',
      authors: [],
      firstPublishYear: null,
      coverUrl: null,
      isbn: null,
      openLibraryRating: null,
    })
  })

  it('requests the default subject when no query is given', async () => {
    fetchJsonMock.mockResolvedValue({ numFound: 0, docs: [] })
    await searchBooks({ sort: 'relevance', page: 1 })
    expect(fetchJsonMock.mock.calls[0][0]).toContain('subject=fiction')
  })

  it('passes the search query and sort through', async () => {
    fetchJsonMock.mockResolvedValue({ numFound: 0, docs: [] })
    await searchBooks({ q: 'dune', sort: 'rating', page: 2 })
    const url = fetchJsonMock.mock.calls[0][0]
    expect(url).toContain('q=dune')
    expect(url).toContain('sort=rating')
    expect(url).toContain('page=2')
    expect(url).not.toContain('subject=')
  })
})

describe('getWorkDetail', () => {
  beforeEach(() => {
    fetchJsonMock.mockReset()
  })

  it('unwraps wrapped descriptions', async () => {
    fetchJsonMock.mockResolvedValue({
      description: { value: 'A desert planet.' },
      subjects: ['Science fiction'],
    })
    await expect(getWorkDetail('OL1W')).resolves.toEqual({
      id: 'OL1W',
      description: 'A desert planet.',
      subjects: ['Science fiction'],
    })
  })

  it('handles plain string descriptions and missing fields', async () => {
    fetchJsonMock.mockResolvedValue({ description: 'Plain text.' })
    await expect(getWorkDetail('OL2W')).resolves.toEqual({
      id: 'OL2W',
      description: 'Plain text.',
      subjects: [],
    })
  })
})
