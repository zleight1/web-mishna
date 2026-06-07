import { describe, it, expect } from 'vitest'
import { formatTransliteratedSlug, sederDisplayName } from './catalogLabels'

describe('catalogLabels', () => {
  it('title-cases transliterated slugs', () => {
    expect(formatTransliteratedSlug('moed')).toBe('Moed')
    expect(formatTransliteratedSlug('berakhot')).toBe('Berakhot')
    expect(formatTransliteratedSlug('moed-katan')).toBe('Moed Katan')
    expect(formatTransliteratedSlug('bava-kamma')).toBe('Bava Kamma')
  })

  it('resolves seder short names with fallback', () => {
    const t = (key: string) => key
    expect(sederDisplayName('moed', t, 'short')).toBe('Moed')
    expect(sederDisplayName('zeraim', t, 'short')).toBe('Zeraim')
  })

  it('uses i18n when present', () => {
    const t = (key: string) => (key === 'catalog.sederShort.moed' ? 'Moed' : key)
    expect(sederDisplayName('moed', t, 'short')).toBe('Moed')
  })
})
