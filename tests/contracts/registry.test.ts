import { describe, it, expect } from 'vitest'
import { activityRegistry } from '@features/activities/registry'
import { visualAidRegistry } from '@features/visual/registry'
import { fixtureMishnah } from '@mocks/fixtures'

describe('registry contracts', () => {
  it('all activities satisfy ActivityModule contract', () => {
    for (const mod of activityRegistry.all()) {
      expect(mod.kind).toBeTruthy()
      expect(mod.label.en).toBeTruthy()
      expect(typeof mod.isApplicable).toBe('function')
      expect(typeof mod.generate).toBe('function')
      expect(typeof mod.validate).toBe('function')
      if (mod.isApplicable(fixtureMishnah)) {
        const state = mod.generate({ mishnah: fixtureMishnah, lang: 'en', rng: () => 0 })
        expect(state).toBeDefined()
      }
    }
    expect(activityRegistry.all().length).toBeGreaterThanOrEqual(4)
  })

  it('visual aid registry has timeline and diagram2d renderers', () => {
    expect(visualAidRegistry.get('timeline')).toBeDefined()
    expect(visualAidRegistry.get('diagram2d')).toBeDefined()
  })
})
