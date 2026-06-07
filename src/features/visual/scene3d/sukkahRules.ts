export interface SukkahBuildRules {
  minHeightTefachim: number
  maxHeightAmot: number
  minWalls: number
}

export interface SukkahBuildState {
  wallCount: number
  heightAmot: number
}

export interface SukkahValidation {
  wallsOk: boolean
  heightOk: boolean
  valid: boolean
}

/** Six tefachim per amah (simplified for kids' UI). */
export const TEFACHIM_PER_AMAH = 6

export function minHeightAmot(rules: SukkahBuildRules) {
  return rules.minHeightTefachim / TEFACHIM_PER_AMAH
}

export function validateSukkahBuild(
  state: SukkahBuildState,
  rules: SukkahBuildRules,
): SukkahValidation {
  const wallsOk = state.wallCount >= rules.minWalls
  const heightOk =
    state.heightAmot >= minHeightAmot(rules) && state.heightAmot <= rules.maxHeightAmot
  return { wallsOk, heightOk, valid: wallsOk && heightOk }
}
