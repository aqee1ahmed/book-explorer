import type { CacheEntry, TtlCache } from '../types'

export function createTtlCache<T>(ttlMs: number): TtlCache<T> {
  const entries = new Map<string, CacheEntry<T>>()

  const get = (key: string): T | undefined => {
    const entry = entries.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      entries.delete(key)
      return undefined
    }
    return entry.value
  }

  const set = (key: string, value: T): void => {
    entries.set(key, { value, expiresAt: Date.now() + ttlMs })
  }

  const clear = (): void => {
    entries.clear()
  }

  return { get, set, clear }
}
