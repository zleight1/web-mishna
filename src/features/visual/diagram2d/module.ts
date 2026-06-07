import { defineAsyncComponent } from 'vue'
import type { VisualAidRenderer } from '@core/contracts/visual-aid'

const mod: VisualAidRenderer = {
  kind: 'diagram2d',
  component: defineAsyncComponent(() => import('./Diagram2dAid.vue')),
}
export default mod
