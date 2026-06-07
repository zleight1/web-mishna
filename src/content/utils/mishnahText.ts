import type { LangCode, Mishnah } from '@content/schema'

export function mishnahFullHebrew(mishnah: Mishnah): string {
  return mishnah.phrases.map((p) => p.he).join(' ')
}

export function mishnahFullTranslation(mishnah: Mishnah, lang: LangCode): string {
  return mishnah.phrases
    .map((p) => p.translations[lang] ?? p.translations.en ?? '')
    .filter(Boolean)
    .join(' ')
}
