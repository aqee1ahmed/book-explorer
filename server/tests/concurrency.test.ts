import { describe, expect, it } from 'vitest'
import { mapWithConcurrency } from '../src/lib/concurrency'

describe('mapWithConcurrency', () => {
  it('maps all items preserving order', async () => {
    const results = await mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async (item) => item * 10)
    expect(results).toEqual([10, 20, 30, 40, 50, 60])
  })

  it('never runs more than the limit at once', async () => {
    let active = 0
    let peak = 0
    await mapWithConcurrency([1, 2, 3, 4, 5, 6], 2, async (item) => {
      active += 1
      peak = Math.max(peak, active)
      await new Promise((resolve) => setTimeout(resolve, 5))
      active -= 1
      return item
    })
    expect(peak).toBeLessThanOrEqual(2)
  })

  it('handles an empty list', async () => {
    const results = await mapWithConcurrency([], 5, async (item) => item)
    expect(results).toEqual([])
  })
})
