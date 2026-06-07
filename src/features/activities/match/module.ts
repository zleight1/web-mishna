import { defineAsyncComponent } from 'vue'
import type { ActivityModule } from '@core/contracts/activity'
import { generateMatch, validateMatch, type MatchState, type MatchAnswer } from './logic'

const mod: ActivityModule<MatchState, MatchAnswer> = {
  kind: 'match',
  label: { en: 'Match Hebrew & English', he: 'התאמת עברית ואנגלית' },
  isApplicable: (m) => m.phrases.length >= 2,
  generate: generateMatch,
  validate: validateMatch,
  component: defineAsyncComponent(() => import('./MatchActivity.vue')),
}
export default mod
