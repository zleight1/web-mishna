/**
 * Builds docs/mishnah-catalog.json — full Mishnah structure (chapters + mishnah counts).
 * Uses Sefaria legacy texts API. Run: pnpm tsx scripts/generate-mishnah-catalog.ts
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { SEDER_ORDER, TRACTATE_ORDER } from '../src/content/catalogOrder.ts'

const SLUG_TO_SEFARIA: Record<string, string> = {
  berakhot: 'Berakhot',
  peah: 'Peah',
  demai: 'Demai',
  kilayim: 'Kilayim',
  sheviit: 'Sheviit',
  terumot: 'Terumot',
  maaserot: 'Maasrot',
  'maaser-sheni': 'Maaser_Sheni',
  challah: 'Challah',
  orlah: 'Orlah',
  bikkurim: 'Bikkurim',
  shabbat: 'Shabbat',
  eruvin: 'Eruvin',
  pesachim: 'Pesachim',
  shekalim: 'Shekalim',
  yoma: 'Yoma',
  sukkah: 'Sukkah',
  beitzah: 'Beitzah',
  'rosh-hashanah': 'Rosh_Hashanah',
  taanit: 'Taanit',
  megillah: 'Megillah',
  'moed-katan': 'Moed_Katan',
  chagigah: 'Chagigah',
  yevamot: 'Yevamot',
  ketubot: 'Ketubot',
  nedarim: 'Nedarim',
  nazir: 'Nazir',
  sotah: 'Sotah',
  gittin: 'Gittin',
  kiddushin: 'Kiddushin',
  'bava-kamma': 'Bava_Kamma',
  'bava-metzia': 'Bava_Metzia',
  'bava-batra': 'Bava_Batra',
  sanhedrin: 'Sanhedrin',
  makkot: 'Makkot',
  shevuot: 'Shevuot',
  eduyot: 'Eduyot',
  'avodah-zarah': 'Avodah_Zarah',
  avot: 'Avot',
  horayot: 'Horayot',
  zevachim: 'Zevachim',
  menachot: 'Menachot',
  chullin: 'Chullin',
  bekhorot: 'Bekhorot',
  arakhin: 'Arakhin',
  temurah: 'Temurah',
  keritot: 'Keritot',
  meilah: 'Meilah',
  tamid: 'Tamid',
  middot: 'Middot',
  kinnim: 'Kinnim',
  keilim: 'Kelim',
  oholot: 'Ohalot',
  negaim: 'Negaim',
  parah: 'Parah',
  tahorot: 'Tahorot',
  mikvaot: 'Mikvaot',
  niddah: 'Niddah',
  makhshirin: 'Makhshirin',
  zavim: 'Zavim',
  'tevul-yom': 'Tevul_Yom',
  yadayim: 'Yadayim',
  uktzim: 'Oktzin',
}

function sefariaTractate(slug: string) {
  return (
    SLUG_TO_SEFARIA[slug] ??
    slug
      .split('-')
      .map((p) => p[0]!.toUpperCase() + p.slice(1))
      .join('_')
  )
}

interface ChapterEntry {
  chapter: number
  mishnahCount: number
  mishnayot: number[]
}

interface TractateEntry {
  slug: string
  sefariaRef: string
  chapters: ChapterEntry[]
  totalMishnayot: number
}

interface SederEntry {
  order: string
  tractates: TractateEntry[]
  totalChapters: number
  totalMishnayot: number
}

async function fetchChapterMishnahCount(tractate: string, chapter: number): Promise<number> {
  const ref = `Mishnah_${tractate}.${chapter}`
  const url = `https://www.sefaria.org/api/texts/${encodeURIComponent(ref)}?context=0&commentary=0&pad=0`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${ref} → ${res.status}`)
  const data = (await res.json()) as { he?: unknown[] }
  return Array.isArray(data.he) ? data.he.length : 0
}

async function fetchTractateMeta(
  slug: string,
): Promise<{ chapterCount: number; totalMishnayot: number }> {
  const tractate = sefariaTractate(slug)
  const ref = `Mishnah_${tractate}`
  const url = `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=hebrew`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`${ref} → ${res.status}`)
  const data = (await res.json()) as { lengths?: number[] }
  return { chapterCount: data.lengths?.[0] ?? 0, totalMishnayot: data.lengths?.[1] ?? 0 }
}

async function buildTractate(slug: string): Promise<TractateEntry> {
  const sefariaRef = sefariaTractate(slug)
  const meta = await fetchTractateMeta(slug)
  const chapters: ChapterEntry[] = []
  for (let ch = 1; ch <= meta.chapterCount; ch++) {
    const count = await fetchChapterMishnahCount(sefariaRef, ch)
    chapters.push({
      chapter: ch,
      mishnahCount: count,
      mishnayot: Array.from({ length: count }, (_, i) => i + 1),
    })
    process.stdout.write(`  ch ${ch}/${meta.chapterCount} (${count} mishnayot)\n`)
    await new Promise((r) => setTimeout(r, 100))
  }
  const totalMishnayot = chapters.reduce((s, c) => s + c.mishnahCount, 0)
  return { slug, sefariaRef, chapters, totalMishnayot }
}

const sedarim: SederEntry[] = []
let grandChapters = 0
let grandMishnayot = 0

for (const order of SEDER_ORDER) {
  const tractates = TRACTATE_ORDER[order] ?? []
  const seder: SederEntry = { order, tractates: [], totalChapters: 0, totalMishnayot: 0 }
  console.log(`\n=== ${order} ===`)
  for (const slug of tractates) {
    console.log(`${slug}…`)
    const tr = await buildTractate(slug)
    seder.tractates.push(tr)
    seder.totalChapters += tr.chapters.length
    seder.totalMishnayot += tr.totalMishnayot
  }
  grandChapters += seder.totalChapters
  grandMishnayot += seder.totalMishnayot
  sedarim.push(seder)
}

const out = {
  generatedAt: new Date().toISOString(),
  source: 'Sefaria API (hebrew text array lengths per chapter)',
  totals: {
    sedarim: sedarim.length,
    tractates: sedarim.reduce((s, x) => s + x.tractates.length, 0),
    chapters: grandChapters,
    mishnayot: grandMishnayot,
  },
  sedarim,
}

const outPath = join(import.meta.dirname, '../docs/mishnah-catalog.json')
writeFileSync(outPath, JSON.stringify(out, null, 2))
console.log(`\nWrote ${outPath}`)
console.log(out.totals)
