import type { ContentLoader } from './content-loader'
import type { ProgressRepository } from './progress'
import type { ProgressState } from './progress'

export interface Scheduler {
  next(ids: string[], progress: ProgressState): string[]
}

export interface Telemetry {
  track(event: string, props?: Record<string, unknown>): void
}

export interface Services {
  content: ContentLoader
  progress: ProgressRepository
  scheduler: Scheduler
  telemetry: Telemetry
}
