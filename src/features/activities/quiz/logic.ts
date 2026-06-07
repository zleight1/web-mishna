import type { ActivityContext, ActivityResult } from '@core/contracts/activity'
import { shuffle } from '@core/utils/shuffle'

export interface QuizQuestionState {
  id: string
  prompt: string
  choices: string[]
  answerIdx: number
  explanation?: string
}
export interface QuizState {
  questions: QuizQuestionState[]
}
export type QuizAnswer = { answers: number[] }

export function generateQuiz(ctx: ActivityContext): QuizState {
  const { mishnah, lang, rng } = ctx
  const questions = mishnah.quiz.map((q) => {
    const choices = q.choices.map((c) => c[lang] ?? c.en ?? '')
    const correctText = choices[q.answerIdx]!
    const shuffled = shuffle(choices, rng)
    const answerIdx = shuffled.indexOf(correctText)
    return {
      id: q.id,
      prompt: q.prompt[lang] ?? q.prompt.en ?? '',
      choices: shuffled,
      answerIdx,
      explanation: q.explanation?.[lang] ?? q.explanation?.en,
    }
  })
  return { questions }
}

export function validateQuiz(state: QuizState, ans: QuizAnswer): ActivityResult {
  let correct = 0
  for (let i = 0; i < state.questions.length; i++) {
    const q = state.questions[i]!
    if (ans.answers[i] === q.answerIdx) correct++
  }
  const score = state.questions.length > 0 ? correct / state.questions.length : 0
  return { correct: score === 1, score, attempts: 1 }
}
