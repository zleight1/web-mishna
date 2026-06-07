/** XP required to advance each level (tier grows slowly for kids). */
export const XP_PER_LEVEL = 40

export interface LevelInfo {
  level: number
  xpIntoLevel: number
  xpToNext: number
  progress: number
}

export function levelFromXp(xp: number): LevelInfo {
  const safeXp = Math.max(0, xp)
  const level = Math.floor(safeXp / XP_PER_LEVEL) + 1
  const xpIntoLevel = safeXp % XP_PER_LEVEL
  return {
    level,
    xpIntoLevel,
    xpToNext: XP_PER_LEVEL,
    progress: xpIntoLevel / XP_PER_LEVEL,
  }
}

export function didLevelUp(previousXp: number, nextXp: number): boolean {
  return levelFromXp(nextXp).level > levelFromXp(previousXp).level
}
