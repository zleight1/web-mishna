import { defineAsyncComponent } from 'vue'
import type { ActivityModule } from '@core/contracts/activity'
import { generateQuiz, validateQuiz, type QuizState, type QuizAnswer } from './logic'

const mod: ActivityModule<QuizState, QuizAnswer> = {
  kind: 'quiz',
  label: { en: 'Comprehension quiz', he: 'חידון הבנה' },
  isApplicable: (m) => m.quiz.length > 0,
  generate: generateQuiz,
  validate: validateQuiz,
  component: defineAsyncComponent(() => import('./QuizActivity.vue')),
}
export default mod
