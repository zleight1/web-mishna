import { defineAsyncComponent } from 'vue'
import type { ActivityModule } from '@core/contracts/activity'
import { generateCloze, validateCloze, type ClozeState, type ClozeAnswer } from './logic'

const mod: ActivityModule<ClozeState, ClozeAnswer> = {
  kind: 'cloze',
  label: { en: 'Fill in the blank', he: 'השלמת מילה' },
  isApplicable: (m) => m.phrases.some((p) => p.he.trim().split(/\s+/).length >= 2),
  generate: generateCloze,
  validate: validateCloze,
  component: defineAsyncComponent(() => import('./ClozeActivity.vue')),
}
export default mod
