import { describe, it, expect } from 'vitest'
import { generateMatch, validateMatch } from './logic'
import { fixtureMishnah } from '@mocks/fixtures'

describe('match', () => {
  it('all correct links score 1', () => {
    const s = generateMatch({ mishnah: fixtureMishnah, lang: 'en', rng: () => 0 })
    const links = Object.fromEntries(s.pairs.map((p) => [p.id, p.en]))
    expect(validateMatch(s, { links }).score).toBe(1)
  })

  it('mismatched link reduces score', () => {
    const s = generateMatch({ mishnah: fixtureMishnah, lang: 'en', rng: () => 0 })
    const links = Object.fromEntries(s.pairs.map((p) => [p.id, 'wrong']))
    expect(validateMatch(s, { links }).score).toBeLessThan(1)
  })
})
