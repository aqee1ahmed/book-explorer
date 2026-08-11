import request from 'supertest'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/clients/openLibrary')
vi.mock('../src/clients/googleBooks')

import { getWorkDetail, searchBooks } from '../src/clients/openLibrary'
import { getRating } from '../src/clients/googleBooks'
import { resetCaches } from '../src/services/bookService'
import { UpstreamError } from '../src/lib/http'
import { createApp } from '../src/app'

const searchBooksMock = vi.mocked(searchBooks)
const getWorkDetailMock = vi.mocked(getWorkDetail)
const getRatingMock = vi.mocked(getRating)
const app = createApp()

beforeEach(() => {
  vi.clearAllMocks()
  resetCaches()
})

describe('GET /api/health', () => {
  it('reports ok', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ status: 'ok' })
  })
})

describe('GET /api/books', () => {
  it('returns merged books', async () => {
    searchBooksMock.mockResolvedValue({
      books: [
        {
          id: 'OL1W',
          title: 'Dune',
          authors: ['Frank Herbert'],
          firstPublishYear: 1965,
          coverUrl: null,
          isbn: '9780441013593',
        },
      ],
      totalResults: 1,
    })
    getRatingMock.mockResolvedValue({ averageRating: 4.2, ratingsCount: 100 })
    const response = await request(app).get('/api/books?q=dune')
    expect(response.status).toBe(200)
    expect(response.body.books[0]).toMatchObject({ title: 'Dune', averageRating: 4.2 })
  })

  it('degrades to null ratings when google books is unavailable', async () => {
    searchBooksMock.mockResolvedValue({
      books: [
        { id: 'OL1W', title: 'Dune', authors: [], firstPublishYear: null, coverUrl: null, isbn: null },
      ],
      totalResults: 1,
    })
    getRatingMock.mockResolvedValue(null)
    const response = await request(app).get('/api/books?q=dune')
    expect(response.status).toBe(200)
    expect(response.body.books[0]).toMatchObject({ averageRating: null, ratingsSource: null })
  })

  it('returns 502 when open library is down', async () => {
    searchBooksMock.mockRejectedValue(new UpstreamError('openlibrary.org failed'))
    const response = await request(app).get('/api/books?q=dune')
    expect(response.status).toBe(502)
    expect(response.body.error.code).toBe('UPSTREAM_ERROR')
  })

  it('rejects an unknown sort option', async () => {
    const response = await request(app).get('/api/books?sort=magic')
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('INVALID_PARAMETER')
  })

  it('rejects a non-positive page', async () => {
    const response = await request(app).get('/api/books?page=0')
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('INVALID_PARAMETER')
  })

  it('rejects a non-numeric page', async () => {
    const response = await request(app).get('/api/books?page=abc')
    expect(response.status).toBe(400)
  })
})

describe('GET /api/books/:workId', () => {
  it('returns work details', async () => {
    getWorkDetailMock.mockResolvedValue({ id: 'OL1W', description: 'Desc', subjects: ['Sci-fi'] })
    const response = await request(app).get('/api/books/OL1W')
    expect(response.status).toBe(200)
    expect(response.body).toEqual({ id: 'OL1W', description: 'Desc', subjects: ['Sci-fi'] })
  })

  it('rejects malformed work ids', async () => {
    const response = await request(app).get('/api/books/not-a-work')
    expect(response.status).toBe(400)
    expect(response.body.error.code).toBe('INVALID_PARAMETER')
  })
})
