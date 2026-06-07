import { describe, it, expect } from 'vitest'
import { xpFromResult } from './xp'
import { updateStreak } from './streak'

describe('progress helpers', () => {
  it('awards xp proportional to score', () => {
    expect(xpFromResult({ correct: true, score: 1, attempts: 1 })).toBe(10)
    expect(xpFromResult({ correct: false, score: 0.5, attempts: 1 })).toBe(5)
  })

  it('increments streak on consecutive days then resets after a gap', () => {
    expect(updateStreak('2026-06-05', 2, '2026-06-06')).toBe(3)
    expect(updateStreak('2026-06-05', 2, '2026-06-07')).toBe(1)
    expect(updateStreak('2026-06-07', 3, '2026-06-07')).toBe(3)
  })
})
