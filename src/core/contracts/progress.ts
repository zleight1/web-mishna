export interface MishnahProgress {
  completed: boolean
  bestScore: number
  lastSeen: string
  box: number
}

export interface ProgressState {
  schemaVersion: number
  xp: number
  streak: number
  lastActiveDate: string
  perMishnah: Record<string, MishnahProgress>
}

export interface ProgressRepository {
  load(): Promise<ProgressState>
  save(state: ProgressState): Promise<void>
}
