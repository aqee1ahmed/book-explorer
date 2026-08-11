import { afterEach, describe, expect, it, vi } from 'vitest'
import { fetchJson } from '../src/lib/http'

describe('fetchJson', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('parses json from ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ ok: true })))
    await expect(fetchJson('https://example.com/data')).resolves.toEqual({ ok: true })
  })

  it('throws UpstreamError with status on non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('nope', { status: 503 })))
    await expect(fetchJson('https://example.com/data')).rejects.toMatchObject({
      name: 'UpstreamError',
      status: 503,
    })
  })

  it('throws UpstreamError when the request itself fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    await expect(fetchJson('https://example.com/data')).rejects.toMatchObject({
      name: 'UpstreamError',
    })
  })

  it('throws UpstreamError when ok response has invalid json body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('not json', { status: 200 })))
    await expect(fetchJson('https://example.com/data')).rejects.toMatchObject({
      name: 'UpstreamError',
    })
  })
})
