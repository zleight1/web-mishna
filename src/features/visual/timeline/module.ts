import { defineAsyncComponent } from 'vue'
import type { VisualAidRenderer } from '@core/contracts/visual-aid'

const mod: VisualAidRenderer = {
  kind: 'timeline',
  component: defineAsyncComponent(() => import('./TimelineAid.vue')),
}
export default mod
