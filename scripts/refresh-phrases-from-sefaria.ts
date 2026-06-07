/**
 * Refresh mishnah phrases from Sefaria (Torat Emet Hebrew + Kulp English).
 * Preserves quiz, visualAid, and other authoring overlays in Mishnah_Berakhot_1.json.
 *
 * Usage: pnpm exec tsx scripts/refresh-phrases-from-sefaria.ts
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { ChapterSchema, type Phrase } from '../src/content/schema.ts'

const authoringPath = join(import.meta.dirname, '../src/content/authoring/Mishnah_Berakhot_1.json')
const outAuthoring = authoringPath
const outData = join(import.meta.dirname, '../src/content/data/zeraim/berakhot/1.json')

function splitHebrew(text: string): string[] {
  return text
    .trim()
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

function splitEnglish(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
}

/** Zip he/en when counts differ slightly (common with ? vs . splits). */
function alignPhrases(heParts: string[], enParts: string[]): Phrase[] {
  const en = [...enParts]
  if (en.length > heParts.length) {
    const extra = en.splice(heParts.length - 1)
    en[heParts.length - 1] = [en[heParts.length - 1], ...extra].filter(Boolean).join(' ')
  }
  while (en.length < heParts.length) {
    en.push('')
  }

  return heParts.map((he, i) => ({
    he,
    translations: { en: en[i] ?? '' },
  }))
}

async function fetchMishnah(number: number) {
  const ref = `Mishnah_Berakhot.1.${number}`
  const url = `https://www.sefaria.org/api/texts/${ref}?ven=Torat_Emet_357&ven=Mishnah_Yomit_by_Dr._Joshua_Kulp`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Sefaria ${ref}: ${res.status}`)
  const data = (await res.json()) as { he?: string | string[]; text?: string | string[] }
  const heRaw = Array.isArray(data.he) ? data.he[number - 1] : data.he
  const enRaw = Array.isArray(data.text) ? data.text[number - 1] : data.text
  if (!heRaw || !enRaw) throw new Error(`Missing text for ${ref}`)
  return { he: heRaw.trim(), en: enRaw.trim() }
}

const chapter = ChapterSchema.parse(JSON.parse(readFileSync(authoringPath, 'utf8')))

for (const mishnah of chapter.mishnayot) {
  const { he, en } = await fetchMishnah(mishnah.number)
  const phrases = alignPhrases(splitHebrew(he), splitEnglish(en))
  const existing = chapter.mishnayot.find((m) => m.number === mishnah.number)
  if (!existing) continue

  // Keep hand-authored translit for phrases that still match prefix of new text.
  for (const phrase of phrases) {
    const old = existing.phrases.find((p) => phrase.he.startsWith(p.he.slice(0, 12)))
    if (old?.translit) phrase.translit = old.translit
  }

  existing.phrases = phrases
  console.log(`Mishnah 1:${mishnah.number} → ${phrases.length} phrases`)
}

writeFileSync(outAuthoring, JSON.stringify(chapter, null, 2) + '\n')
writeFileSync(outData, JSON.stringify(chapter, null, 2) + '\n')
console.log(`Updated ${outAuthoring} and ${outData}`)
