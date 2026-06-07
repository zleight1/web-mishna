import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelineAid from './TimelineAid.vue'
import { fixtureMishnah } from '@mocks/fixtures'

describe('TimelineAid', () => {
  it('renders one node per event with labels', () => {
    const aid = fixtureMishnah.visualAid!
    const w = mount(TimelineAid, { props: { aid, lang: 'en' } })
    expect(w.findAll('circle').length).toBe(aid.kind === 'timeline' ? aid.events.length : 0)
    expect(w.text()).toContain('Priests eat teruma')
  })
})
