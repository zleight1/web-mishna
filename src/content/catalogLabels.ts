import { sederLabelKey } from './catalogNav'

/** Fallback short names when i18n is unavailable (URLs/slugs stay lowercase). */
export const SEDER_SHORT_NAMES: Record<string, string> = {
  zeraim: 'Zeraim',
  moed: 'Moed',
  nashim: 'Nashim',
  nezikin: 'Nezikin',
  kodshim: 'Kodshim',
  tahorot: 'Tahorot',
}

export function sederShortLabelKey(order: string) {
  return `catalog.sederShort.${order}`
}

/** Title-case a transliterated slug: `moed-katan` → `Moed Katan`. */
export function formatTransliteratedSlug(slug: string): string {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function sederDisplayName(
  order: string,
  t: (key: string) => string,
  variant: 'full' | 'short' = 'short',
): string {
  const key = variant === 'full' ? sederLabelKey(order) : sederShortLabelKey(order)
  const label = t(key)
  if (label !== key) return label
  return SEDER_SHORT_NAMES[order] ?? formatTransliteratedSlug(order)
}

export function tractateDisplayName(tractate: string, t?: (key: string) => string): string {
  const key = `catalog.tractate.${tractate}`
  if (t) {
    const label = t(key)
    if (label !== key) return label
  }
  return formatTransliteratedSlug(tractate)
}
