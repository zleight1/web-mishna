import type { ActivityContext, ActivityResult } from '@core/contracts/activity'
import { shuffle } from '@core/utils/shuffle'

export interface MatchPair {
  he: string
  en: string
  id: string
}
export interface MatchState {
  pairs: MatchPair[]
  shuffledEn: string[]
}
export type MatchAnswer = { links: Record<string, string> }

export function generateMatch(ctx: ActivityContext): MatchState {
  const { mishnah, rng } = ctx
  const pairs = mishnah.phrases.map((p, i) => ({
    id: `p${i}`,
    he: p.he,
    en: p.translations.en ?? p.translations[ctx.lang] ?? '',
  }))
  const shuffledEn = shuffle(
    pairs.map((p) => p.en),
    rng,
  )
  return { pairs, shuffledEn }
}

export function validateMatch(state: MatchState, ans: MatchAnswer): ActivityResult {
  let correct = 0
  for (const pair of state.pairs) {
    if (ans.links[pair.id] === pair.en) correct++
  }
  const score = state.pairs.length > 0 ? correct / state.pairs.length : 0
  return { correct: score === 1, score, attempts: 1 }
}
