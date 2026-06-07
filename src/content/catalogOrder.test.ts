import { describe, it, expect } from 'vitest'
import type { CatalogChapter } from '@core/contracts/content-loader'
import { compareCatalogChapters, groupCatalogBySeder, sortCatalogChapters } from './catalogOrder'

function ch(order: string, tractate: string, chapter: number): CatalogChapter {
  return {
    order,
    tractate,
    chapter,
    title: { en: `${tractate} ${chapter}` },
    mishnayot: [
      { id: `${tractate}-${chapter}-2`, ref: '', heRef: '', number: 2 },
      { id: `${tractate}-${chapter}-1`, ref: '', heRef: '', number: 1 },
    ],
  }
}

describe('catalogOrder', () => {
  it('sorts by seder, tractate, then chapter', () => {
    const input = [ch('moed', 'sukkah', 1), ch('zeraim', 'berakhot', 1)]
    const sorted = sortCatalogChapters(input)
    expect(sorted.map((c) => `${c.order}/${c.tractate}`)).toEqual([
      'zeraim/berakhot',
      'moed/sukkah',
    ])
  })

  it('sorts mishnayot by number within a chapter', () => {
    const sorted = sortCatalogChapters([ch('zeraim', 'berakhot', 1)])
    expect(sorted[0]!.mishnayot.map((m) => m.number)).toEqual([1, 2])
  })

  it('groups consecutive chapters under the same seder', () => {
    const groups = groupCatalogBySeder([
      ch('zeraim', 'berakhot', 1),
      ch('moed', 'sukkah', 1),
      ch('moed', 'shabbat', 1),
    ])
    expect(groups.map((g) => g.order)).toEqual(['zeraim', 'moed'])
    expect(groups[1]!.chapters.map((c) => c.tractate)).toEqual(['shabbat', 'sukkah'])
  })

  it('compareCatalogChapters is transitive for tractate order', () => {
    expect(compareCatalogChapters(ch('moed', 'shabbat', 1), ch('moed', 'sukkah', 1))).toBeLessThan(
      0,
    )
  })
})
