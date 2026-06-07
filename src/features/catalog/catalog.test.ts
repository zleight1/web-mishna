import { describe, it, expect } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { renderWithHarness } from '@mocks/renderWithHarness'
import ChapterMap from './ChapterMap.vue'
import { fixtureChapter } from '@mocks/fixtures'

describe('ChapterMap', () => {
  it('renders 5 mishnah nodes with correct links', () => {
    setActivePinia(createPinia())
    const w = renderWithHarness(
      ChapterMap,
      {
        props: { chapter: fixtureChapter },
      },
      {
        global: {
          stubs: { RouterLink: { template: '<a :href="to"><slot /></a>', props: ['to'] } },
        },
      },
    )
    const links = w.findAll('a')
    expect(links.length).toBe(5)
    expect(links[0]!.attributes('href')).toBe('/learn/zeraim/berakhot/1/1')
  })
})
