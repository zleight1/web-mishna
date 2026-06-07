import { describe, it, expect } from 'vitest'
import { generateCloze, validateCloze } from './logic'
import { fixtureMishnah } from '@mocks/fixtures'

const rng = () => 0

describe('cloze', () => {
  it('blanks a real token and offers it among options', () => {
    const s = generateCloze({ mishnah: fixtureMishnah, lang: 'en', rng })
    expect(s.tokens[s.blankIndex]).toBe(s.answer)
    expect(s.options).toContain(s.answer)
  })

  it('scores the correct choice 1 and a wrong choice 0', () => {
    const s = generateCloze({ mishnah: fixtureMishnah, lang: 'en', rng })
    expect(validateCloze(s, { choice: s.answer }).score).toBe(1)
    expect(validateCloze(s, { choice: '___nope___' }).score).toBe(0)
  })
})
