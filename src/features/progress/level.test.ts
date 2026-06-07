import { describe, it, expect } from 'vitest'
import { didLevelUp, levelFromXp, XP_PER_LEVEL } from './level'
import { comboBonus } from './combo'

describe('levelFromXp', () => {
  it('starts at level 1 with zero xp', () => {
    expect(levelFromXp(0)).toEqual({
      level: 1,
      xpIntoLevel: 0,
      xpToNext: XP_PER_LEVEL,
      progress: 0,
    })
  })

  it('levels up every XP_PER_LEVEL points', () => {
    expect(levelFromXp(XP_PER_LEVEL).level).toBe(2)
    expect(levelFromXp(XP_PER_LEVEL * 2 + 10).level).toBe(3)
  })

  it('detects level-up transitions', () => {
    expect(didLevelUp(39, 40)).toBe(true)
    expect(didLevelUp(40, 55)).toBe(false)
  })
})

describe('comboBonus', () => {
  it('rewards longer streaks', () => {
    expect(comboBonus(1)).toBe(0)
    expect(comboBonus(3)).toBe(3)
    expect(comboBonus(7)).toBe(7)
  })
})
