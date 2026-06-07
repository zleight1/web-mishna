import type { ActivityContext, ActivityResult } from '@core/contracts/activity'

export interface ClozeState {
  tokens: string[]
  blankIndex: number
  options: string[]
  answer: string
  phraseEn: string
}
export type ClozeAnswer = { choice: string }

const tokenize = (he: string) => he.trim().split(/\s+/).filter(Boolean)

import { shuffle } from '@core/utils/shuffle'

export function generateCloze(ctx: ActivityContext): ClozeState {
  const { mishnah, rng } = ctx
  const phrase = mishnah.phrases[Math.floor(rng() * mishnah.phrases.length)]!
  const tokens = tokenize(phrase.he)
  const blankIndex = Math.floor(rng() * tokens.length)
  const answer = tokens[blankIndex]!
  const pool = [...new Set(mishnah.phrases.flatMap((p) => tokenize(p.he)))].filter(
    (w) => w !== answer,
  )
  const options = shuffle([answer, ...shuffle(pool, rng).slice(0, 3)], rng)
  return { tokens, blankIndex, options, answer, phraseEn: phrase.translations.en ?? '' }
}

export function validateCloze(state: ClozeState, ans: ClozeAnswer): ActivityResult {
  const correct = ans.choice === state.answer
  return { correct, score: correct ? 1 : 0, attempts: 1 }
}
