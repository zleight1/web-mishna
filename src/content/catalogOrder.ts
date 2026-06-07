import type { CatalogChapter } from '@core/contracts/content-loader'

/** Canonical Mishnah seder sequence. */
export const SEDER_ORDER = ['zeraim', 'moed', 'nashim', 'nezikin', 'kodshim', 'tahorot'] as const

/** Tractate order within each seder (known tractates); unknown tractates sort alphabetically after. */
export const TRACTATE_ORDER: Record<string, readonly string[]> = {
  zeraim: [
    'berakhot',
    'peah',
    'demai',
    'kilayim',
    'sheviit',
    'terumot',
    'maaserot',
    'maaser-sheni',
    'challah',
    'orlah',
    'bikkurim',
  ],
  moed: [
    'shabbat',
    'eruvin',
    'pesachim',
    'shekalim',
    'yoma',
    'sukkah',
    'beitzah',
    'rosh-hashanah',
    'taanit',
    'megillah',
    'moed-katan',
    'chagigah',
  ],
  nashim: ['yevamot', 'ketubot', 'nedarim', 'nazir', 'sotah', 'gittin', 'kiddushin'],
  nezikin: [
    'bava-kamma',
    'bava-metzia',
    'bava-batra',
    'sanhedrin',
    'makkot',
    'shevuot',
    'eduyot',
    'avodah-zarah',
    'avot',
    'horayot',
  ],
  kodshim: [
    'zevachim',
    'menachot',
    'chullin',
    'bekhorot',
    'arakhin',
    'temurah',
    'keritot',
    'meilah',
    'tamid',
    'middot',
    'kinnim',
  ],
  tahorot: [
    'keilim',
    'oholot',
    'negaim',
    'parah',
    'tahorot',
    'mikvaot',
    'niddah',
    'makhshirin',
    'zavim',
    'tevul-yom',
    'yadayim',
    'uktzim',
  ],
}

function indexIn(list: readonly string[] | undefined, value: string) {
  if (!list) return Number.MAX_SAFE_INTEGER
  const i = list.indexOf(value)
  return i === -1 ? Number.MAX_SAFE_INTEGER : i
}

export function compareCatalogChapters(a: CatalogChapter, b: CatalogChapter): number {
  const sederA = indexIn(SEDER_ORDER, a.order)
  const sederB = indexIn(SEDER_ORDER, b.order)
  if (sederA !== sederB) return sederA - sederB

  const tractateA = indexIn(TRACTATE_ORDER[a.order], a.tractate)
  const tractateB = indexIn(TRACTATE_ORDER[b.order], b.tractate)
  if (tractateA !== tractateB) return tractateA - tractateB
  if (a.tractate !== b.tractate) return a.tractate.localeCompare(b.tractate)

  return a.chapter - b.chapter
}

export function sortCatalogChapters(chapters: CatalogChapter[]): CatalogChapter[] {
  return [...chapters].sort(compareCatalogChapters).map((ch) => ({
    ...ch,
    mishnayot: [...ch.mishnayot].sort((a, b) => a.number - b.number),
  }))
}

export interface CatalogSederGroup {
  order: string
  chapters: CatalogChapter[]
}

export function groupCatalogBySeder(chapters: CatalogChapter[]): CatalogSederGroup[] {
  const sorted = sortCatalogChapters(chapters)
  const groups: CatalogSederGroup[] = []
  for (const ch of sorted) {
    const last = groups[groups.length - 1]
    if (last?.order === ch.order) {
      last.chapters.push(ch)
    } else {
      groups.push({ order: ch.order, chapters: [ch] })
    }
  }
  return groups
}

export interface CatalogTractateGroup {
  order: string
  tractate: string
  chapters: CatalogChapter[]
}

export function groupChaptersByTractate(chapters: CatalogChapter[]): CatalogTractateGroup[] {
  const groups: CatalogTractateGroup[] = []
  for (const ch of chapters) {
    const last = groups[groups.length - 1]
    if (last?.tractate === ch.tractate) {
      last.chapters.push(ch)
    } else {
      groups.push({ order: ch.order, tractate: ch.tractate, chapters: [ch] })
    }
  }
  return groups
}
