/** Bonus XP awarded when answering correctly on a streak within a lesson. */
export function comboBonus(combo: number): number {
  if (combo >= 7) return 7
  if (combo >= 5) return 5
  if (combo >= 3) return 3
  if (combo >= 2) return 1
  return 0
}
