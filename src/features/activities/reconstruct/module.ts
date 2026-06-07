import { defineAsyncComponent } from 'vue'
import type { ActivityModule } from '@core/contracts/activity'
import {
  generateReconstruct,
  validateReconstruct,
  type ReconstructState,
  type ReconstructAnswer,
} from './logic'

const mod: ActivityModule<ReconstructState, ReconstructAnswer> = {
  kind: 'reconstruct',
  label: { en: 'Rebuild the phrase', he: 'בניית הביטוי' },
  isApplicable: (m) => m.phrases.some((p) => p.he.trim().split(/\s+/).length >= 2),
  generate: generateReconstruct,
  validate: validateReconstruct,
  component: defineAsyncComponent(() => import('./ReconstructActivity.vue')),
}
export default mod
