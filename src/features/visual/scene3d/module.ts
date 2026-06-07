import { defineAsyncComponent } from 'vue'
import type { VisualAidRenderer } from '@core/contracts/visual-aid'

const mod: VisualAidRenderer = {
  kind: 'scene3d',
  lazy: true,
  component: defineAsyncComponent(() => import('./Scene3dAid.vue')),
}
export default mod
