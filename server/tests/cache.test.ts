import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createTtlCache } from '../src/lib/cache'

describe('createTtlCache', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns a stored value within the ttl', () => {
    const cache = createTtlCache<string>(10_000)
    cache.set('key', 'value')
    vi.advanceTimersByTime(9_999)
    expect(cache.get('key')).toBe('value')
  })

  it('expires a value after the ttl', () => {
    const cache = createTtlCache<string>(10_000)
    cache.set('key', 'value')
    vi.advanceTimersByTime(10_001)
    expect(cache.get('key')).toBeUndefined()
  })

  it('misses on unknown keys', () => {
    const cache = createTtlCache<string>(10_000)
    expect(cache.get('missing')).toBeUndefined()
  })

  it('clears all entries', () => {
    const cache = createTtlCache<string>(10_000)
    cache.set('key', 'value')
    cache.clear()
    expect(cache.get('key')).toBeUndefined()
  })
})
