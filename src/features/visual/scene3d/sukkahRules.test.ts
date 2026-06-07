import { describe, it, expect } from 'vitest'
import { minHeightAmot, validateSukkahBuild } from './sukkahRules'

const rules = { minHeightTefachim: 10, maxHeightAmot: 20, minWalls: 3 }

describe('validateSukkahBuild', () => {
  it('accepts a typical kosher build', () => {
    const result = validateSukkahBuild({ wallCount: 3, heightAmot: 12 }, rules)
    expect(result.valid).toBe(true)
  })

  it('rejects too few walls', () => {
    const result = validateSukkahBuild({ wallCount: 2, heightAmot: 12 }, rules)
    expect(result.wallsOk).toBe(false)
    expect(result.valid).toBe(false)
  })

  it('rejects height above twenty amot', () => {
    const result = validateSukkahBuild({ wallCount: 3, heightAmot: 21 }, rules)
    expect(result.heightOk).toBe(false)
  })

  it('rejects height below ten tefachim', () => {
    const min = minHeightAmot(rules)
    const result = validateSukkahBuild({ wallCount: 3, heightAmot: min - 0.1 }, rules)
    expect(result.heightOk).toBe(false)
  })
})
