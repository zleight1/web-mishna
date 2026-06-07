import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimelineAid from './TimelineAid.vue'
import { fixtureMishnah } from '@mocks/fixtures'

describe('TimelineAid', () => {
  it('renders one marker per event with readable labels', () => {
    const aid = fixtureMishnah.visualAid!
    const w = mount(TimelineAid, { props: { aid, lang: 'en' } })
    expect(w.findAll('.timeline-dot').length).toBe(aid.kind === 'timeline' ? aid.events.length : 0)
    expect(w.text()).toContain('Priests eat teruma')
    expect(w.text()).toContain('R. Eliezer')
    expect(w.find('.timeline-edge--start').text()).toBe('Nightfall')
    expect(w.find('.timeline-edge--end').text()).toBe('Dawn')
  })

  it('staggers labels above and below the track', () => {
    const aid = fixtureMishnah.visualAid!
    const w = mount(TimelineAid, { props: { aid, lang: 'en' } })
    expect(w.findAll('.timeline-event--above').length).toBeGreaterThan(0)
    expect(w.findAll('.timeline-event--below').length).toBeGreaterThan(0)
  })
})
