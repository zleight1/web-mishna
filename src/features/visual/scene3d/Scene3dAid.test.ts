import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VisualAid } from '@content/schema'
import Scene3dAid from './Scene3dAid.vue'

const sukkahBossAid: VisualAid = {
  kind: 'scene3d',
  spec: {
    preset: 'sukkah-boss',
    title: { en: 'Build the sukkah', he: 'בונים סוכה' },
    minHeightTefachim: 10,
    maxHeightAmot: 20,
    minWalls: 3,
  },
}

describe('Scene3dAid', () => {
  it('renders 3D build tab and controls', () => {
    const w = mount(Scene3dAid, { props: { aid: sukkahBossAid, lang: 'en' } })
    expect(w.text()).toContain('Build the sukkah')
    expect(w.text()).toContain('3D Build')
    expect(w.text()).toContain('Make it kosher!')
  })

  it('switches to 2D diagram tab', async () => {
    const w = mount(Scene3dAid, { props: { aid: sukkahBossAid, lang: 'en' } })
    await w.findAll('[role="tab"]')[1]!.trigger('click')
    expect(w.text()).toContain('Height (side view)')
  })
})
