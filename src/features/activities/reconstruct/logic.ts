import type { ActivityContext, ActivityResult } from '@core/contracts/activity'
import { shuffle } from '@core/utils/shuffle'

export interface ReconstructState {
  correctOrder: string[]
  shuffled: string[]
}
export type ReconstructAnswer = { order: string[] }

export function generateReconstruct(ctx: ActivityContext): ReconstructState {
  const { mishnah, rng } = ctx
  const phrase = mishnah.phrases[Math.floor(rng() * mishnah.phrases.length)]!
  const correctOrder = phrase.he.trim().split(/\s+/).filter(Boolean)
  return { correctOrder, shuffled: shuffle(correctOrder, rng) }
}

export function validateReconstruct(
  state: ReconstructState,
  ans: ReconstructAnswer,
): ActivityResult {
  const total = state.correctOrder.length
  let correctCount = 0
  for (let i = 0; i < total; i++) {
    if (ans.order[i] === state.correctOrder[i]) correctCount++
  }
  const score = total > 0 ? correctCount / total : 0
  return { correct: score === 1, score, attempts: 1 }
}
