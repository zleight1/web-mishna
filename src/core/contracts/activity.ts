import type { Component } from 'vue'
import type { LangCode, Mishnah } from '@content/schema'

export type ActivityKind = 'cloze' | 'reconstruct' | 'match' | 'quiz'

export interface ActivityContext {
  mishnah: Mishnah
  lang: LangCode
  rng: () => number
}

export interface ActivityResult {
  correct: boolean
  score: number
  attempts: number
}

export interface ActivityModule<State = unknown, Answer = unknown> {
  kind: ActivityKind
  label: Record<string, string>
  isApplicable(mishnah: Mishnah): boolean
  generate(ctx: ActivityContext): State
  validate(state: State, answer: Answer): ActivityResult
  component: Component
}
