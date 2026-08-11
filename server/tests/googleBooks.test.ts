import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/lib/http', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../src/lib/http')>()),
  fetchJson: vi.fn(),
}))

import { fetchJson } from '../src/lib/http'
import { getRating } from '../src/clients/googleBooks'

const fetchJsonMock = vi.mocked(fetchJson)

describe('getRating', () => {
  beforeEach(() => {
    fetchJsonMock.mockReset()
  })

  it('returns the rating found by isbn', async () => {
    fetchJsonMock.mockResolvedValue({
      items: [{ volumeInfo: { averageRating: 4.2, ratingsCount: 100 } }],
    })
    await expect(getRating('9780441013593', 'Dune', 'Frank Herbert')).resolves.toEqual({
      averageRating: 4.2,
      ratingsCount: 100,
    })
    expect(fetchJsonMock).toHaveBeenCalledTimes(1)
    expect(fetchJsonMock.mock.calls[0][0]).toContain('isbn%3A9780441013593')
  })

  it('falls back to title and author when the isbn lookup has no rating', async () => {
    fetchJsonMock
      .mockResolvedValueOnce({ items: [{ volumeInfo: {} }] })
      .mockResolvedValueOnce({ items: [{ volumeInfo: { averageRating: 3.9, ratingsCount: 12 } }] })
    await expect(getRating('123', 'Dune', 'Frank Herbert')).resolves.toEqual({
      averageRating: 3.9,
      ratingsCount: 12,
    })
    expect(fetchJsonMock).toHaveBeenCalledTimes(2)
    expect(fetchJsonMock.mock.calls[1][0]).toContain('intitle')
  })

  it('skips the isbn lookup when there is no isbn', async () => {
    fetchJsonMock.mockResolvedValue({ items: [{ volumeInfo: { averageRating: 4.0, ratingsCount: 5 } }] })
    await expect(getRating(null, 'Dune', 'Frank Herbert')).resolves.toEqual({
      averageRating: 4.0,
      ratingsCount: 5,
    })
    expect(fetchJsonMock).toHaveBeenCalledTimes(1)
    expect(fetchJsonMock.mock.calls[0][0]).toContain('intitle')
  })

  it('returns null when no volume has a rating', async () => {
    fetchJsonMock.mockResolvedValue({})
    await expect(getRating('123', 'Dune', 'Frank Herbert')).resolves.toBeNull()
  })

  it('returns null when the lookup fails', async () => {
    fetchJsonMock.mockRejectedValue(new Error('quota exceeded'))
    await expect(getRating('123', 'Dune', 'Frank Herbert')).resolves.toBeNull()
  })
})
