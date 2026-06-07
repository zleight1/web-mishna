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

  it('mirrors layout for Hebrew RTL', () => {
    const aid = fixtureMishnah.visualAid!
    if (aid.kind !== 'timeline') return
    const en = mount(TimelineAid, { props: { aid, lang: 'en' } })
    const he = mount(TimelineAid, { props: { aid, lang: 'he' } })
    expect(he.find('.timeline-shell--rtl').exists()).toBe(true)
    expect(he.find('.timeline-shell').attributes('dir')).toBe('rtl')

    const firstAt = aid.events[0]!.at
    const enLeft = Number(
      en
        .find('.timeline-event')!
        .attributes('style')!
        .match(/left:\s*([\d.]+)%/)![1],
    )
    const heLeft = Number(
      he
        .find('.timeline-event')!
        .attributes('style')!
        .match(/left:\s*([\d.]+)%/)![1],
    )
    const pad = 8
    const ltr = pad + firstAt * (100 - 2 * pad)
    expect(enLeft).toBeCloseTo(ltr, 1)
    expect(heLeft).toBeCloseTo(100 - ltr, 1)
  })
})
