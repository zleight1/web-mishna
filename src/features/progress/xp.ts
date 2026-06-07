import type { ActivityResult } from '@core/contracts/activity'

const XP_PER_SCORE = 10

export function xpFromResult(result: ActivityResult): number {
  return Math.round(result.score * XP_PER_SCORE)
}
