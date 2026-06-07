import { describe, it, expect } from 'vitest'
import { generateQuiz, validateQuiz } from './logic'
import { fixtureMishnah } from '@mocks/fixtures'

describe('quiz', () => {
  it('keeps answer correct after shuffle', () => {
    const s = generateQuiz({ mishnah: fixtureMishnah, lang: 'en', rng: () => 0.3 })
    for (const q of s.questions) {
      expect(q.choices[q.answerIdx]).toBeDefined()
    }
  })

  it('wrong pick scores below 1', () => {
    const s = generateQuiz({ mishnah: fixtureMishnah, lang: 'en', rng: () => 0 })
    const wrong = s.questions.map(() => 999)
    expect(validateQuiz(s, { answers: wrong }).score).toBeLessThan(1)
  })
})
