import { describe, it, expect } from 'vitest'
import { buildLessonBreadcrumbs, chapterPath, mishnahPath, sederPath } from './catalogNav'

describe('catalogNav', () => {
  it('builds paths for home, seder, chapter, mishnah', () => {
    expect(sederPath('zeraim')).toBe('/#seder-zeraim')
    expect(chapterPath('zeraim', 'berakhot', 1)).toBe('/learn/zeraim/berakhot/1')
    expect(mishnahPath('moed', 'sukkah', 1, 3)).toBe('/learn/moed/sukkah/1/3')
  })

  it('builds lesson breadcrumbs with mishnah as current page', () => {
    const crumbs = buildLessonBreadcrumbs({
      homeLabel: 'Web Mishnah',
      order: 'zeraim',
      tractate: 'berakhot',
      chapter: '1',
      mishnah: '2',
      sederName: 'Zeraim',
      chapterTitle: 'Berakhot Chapter 1',
      mishnahLabel: 'Mishnah Berakhot 1:2',
    })
    expect(crumbs.map((c) => c.label)).toEqual([
      'Web Mishnah',
      'Zeraim',
      'Berakhot Chapter 1',
      'Mishnah Berakhot 1:2',
    ])
    expect(crumbs[0]!.to).toBe('/')
    expect(crumbs[1]!.to).toBe('/#seder-zeraim')
    expect(crumbs[2]!.to).toBe('/learn/zeraim/berakhot/1')
    expect(crumbs[3]!.to).toBeUndefined()
  })

  it('builds chapter breadcrumbs without mishnah', () => {
    const crumbs = buildLessonBreadcrumbs({
      homeLabel: 'Web Mishnah',
      order: 'moed',
      tractate: 'sukkah',
      chapter: '1',
      sederName: 'Moed',
      chapterTitle: 'Sukkah Chapter 1',
    })
    expect(crumbs).toHaveLength(3)
    expect(crumbs.at(-1)!.to).toBeUndefined()
    expect(crumbs.at(-1)!.label).toBe('Sukkah Chapter 1')
  })
})
