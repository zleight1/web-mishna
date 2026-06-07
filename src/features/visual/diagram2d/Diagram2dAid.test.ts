import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Diagram2dAid from './Diagram2dAid.vue'
import type { VisualAid } from '@content/schema'

const sukkahAid: VisualAid = {
  kind: 'diagram2d',
  spec: {
    type: 'sukkah-dimensions',
    title: { en: 'Valid sukka dimensions', he: 'מידות סוכה כשרה' },
    minHeightTefachim: 10,
    maxHeightAmot: 20,
    minWalls: 3,
    dispute: {
      figure: { en: 'R. Yehuda', he: 'רבי יהודה' },
      opinion: { en: 'permits above 20 amot', he: 'מכשיר מעל כ׳ אמה' },
    },
  },
}

describe('Diagram2dAid', () => {
  it('renders sukkah height, walls, and shade panels', () => {
    const w = mount(Diagram2dAid, { props: { aid: sukkahAid, lang: 'en' } })
    expect(w.text()).toContain('Valid sukka dimensions')
    expect(w.text()).toContain('10 handbreadths min')
    expect(w.text()).toContain('20 cubits max')
    expect(w.text()).toContain('3 walls minimum')
    expect(w.text()).toContain('More shade than sun')
    expect(w.text()).toContain('R. Yehuda')
  })

  it('localizes labels in Hebrew', () => {
    const w = mount(Diagram2dAid, { props: { aid: sukkahAid, lang: 'he' } })
    expect(w.find('.diagram-shell--rtl').exists()).toBe(true)
    expect(w.text()).toContain('מידות סוכה כשרה')
    expect(w.text()).toContain('טפחים')
    expect(w.text()).toContain('דפנות')
  })

  it('renders sukkah layers diagram', () => {
    const aid: VisualAid = {
      kind: 'diagram2d',
      spec: { type: 'sukkah-layers', title: { en: 'Placement', he: 'מיקום' } },
    }
    const w = mount(Diagram2dAid, { props: { aid, lang: 'en' } })
    expect(w.text()).toContain('Under a tree')
    expect(w.text()).toContain('Upper — fit')
  })

  it('renders sukkah walls diagram', () => {
    const aid: VisualAid = {
      kind: 'diagram2d',
      spec: {
        type: 'sukkah-walls',
        title: { en: 'Walls', he: 'דפנות' },
        minWallTefachim: 10,
        maxGroundGapTefachim: 3,
      },
    }
    const w = mount(Diagram2dAid, { props: { aid, lang: 'en' } })
    expect(w.text()).toContain('Bottom → up')
    expect(w.text()).toContain('10 tefachim')
  })
})
