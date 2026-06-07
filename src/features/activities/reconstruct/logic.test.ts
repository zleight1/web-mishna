import { describe, it, expect } from 'vitest'
import { generateReconstruct, validateReconstruct } from './logic'
import { fixtureMishnah } from '@mocks/fixtures'

const rng = () => 0.5

describe('reconstruct', () => {
  it('restores original order from shuffle', () => {
    const s = generateReconstruct({ mishnah: fixtureMishnah, lang: 'en', rng })
    const result = validateReconstruct(s, { order: s.correctOrder })
    expect(result.score).toBe(1)
    expect(result.correct).toBe(true)
  })

  it('partial order yields fractional score', () => {
    const s = generateReconstruct({ mishnah: fixtureMishnah, lang: 'en', rng: () => 0 })
    const partial = [...s.correctOrder]
    if (partial.length >= 2) partial[0] = 'wrong'
    const result = validateReconstruct(s, { order: partial })
    expect(result.score).toBeLessThan(1)
  })
})
