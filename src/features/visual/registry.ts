import { createRegistry } from '@core/registry/createRegistry'
import type { VisualAidRenderer } from '@core/contracts/visual-aid'

export const visualAidRegistry = createRegistry<VisualAidRenderer>()

const mods = import.meta.glob('./*/module.ts', { eager: true })
for (const m of Object.values(mods)) {
  const mod = (m as { default?: VisualAidRenderer }).default
  if (mod) visualAidRegistry.register(mod)
}
