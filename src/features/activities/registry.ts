import { createRegistry } from '@core/registry/createRegistry'
import type { ActivityModule } from '@core/contracts/activity'

export const activityRegistry = createRegistry<ActivityModule>()

const mods = import.meta.glob('./*/module.ts', { eager: true })
for (const m of Object.values(mods)) {
  const mod = (m as { default?: ActivityModule }).default
  if (mod) activityRegistry.register(mod)
}
