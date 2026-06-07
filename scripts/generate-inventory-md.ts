/**
 * Generates docs/MISHNAH_INVENTORY.md from docs/mishnah-catalog.json + shipped content.
 * Run: pnpm tsx scripts/generate-inventory-md.ts
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface CatalogChapter {
  chapter: number
  mishnahCount: number
  mishnayot: number[]
}

interface CatalogTractate {
  slug: string
  sefariaRef: string
  chapters: CatalogChapter[]
  totalMishnayot: number
}

interface CatalogSeder {
  order: string
  tractates: CatalogTractate[]
  totalChapters: number
  totalMishnayot: number
}

interface Catalog {
  generatedAt: string
  totals: { sedarim: number; tractates: number; chapters: number; mishnayot: number }
  sedarim: CatalogSeder[]
}

interface ShippedMishnah {
  number: number
  ref: string
  phrases: unknown[]
  quiz: unknown[]
  visualAid?: { kind: string; spec?: { type?: string; preset?: string } }
}

interface ShippedChapter {
  order: string
  tractate: string
  chapter: number
  mishnayot: ShippedMishnah[]
}

const catalog = JSON.parse(
  readFileSync(join(import.meta.dirname, '../docs/mishnah-catalog.json'), 'utf8'),
) as Catalog

const dataDir = join(import.meta.dirname, '../src/content/data')
const shipped = new Map<string, ShippedChapter>()

for (const order of readdirSync(dataDir)) {
  const orderPath = join(dataDir, order)
  for (const tractate of readdirSync(orderPath)) {
    const trPath = join(orderPath, tractate)
    for (const file of readdirSync(trPath).filter((f) => f.endsWith('.json'))) {
      const ch = JSON.parse(readFileSync(join(trPath, file), 'utf8')) as ShippedChapter
      shipped.set(`${ch.order}/${ch.tractate}/${ch.chapter}`, ch)
    }
  }
}

const SEDER_NAMES: Record<string, string> = {
  zeraim: 'Zeraim (זרעים) — Seeds / agriculture & blessings',
  moed: 'Moed (מועד) — Festivals & sacred time',
  nashim: 'Nashim (נשים) — Women & family law',
  nezikin: 'Nezikin (נזיקין) — Damages & civil law',
  kodshim: 'Kodshim (קדשים) — Sacrifices & Temple',
  tahorot: 'Tahorot (טהרות) — Purity & impurity',
}

function visualLabel(m: ShippedMishnah) {
  if (!m.visualAid) return '—'
  const spec = m.visualAid.spec
  if (m.visualAid.kind === 'scene3d') return `scene3d:${spec?.preset ?? '?'}`
  if (m.visualAid.kind === 'diagram2d') return `diagram2d:${spec?.type ?? '?'}`
  if (m.visualAid.kind === 'timeline') return 'timeline'
  return m.visualAid.kind
}

const lines: string[] = [
  '# Mishnah inventory (complete)',
  '',
  `Auto-generated from [mishnah-catalog.json](./mishnah-catalog.json) on ${new Date().toISOString().slice(0, 10)}.`,
  '',
  '**Canonical totals:** 6 sedarim · 63 tractates · 525 chapters · **4,192 mishnayot**',
  '',
  '**Shipped in app:** _calculated below_',
  '',
  'Legend: ✅ = interactive lesson live in `src/content/data/`',
  '',
  '---',
  '',
]

let shippedCount = 0

for (const seder of catalog.sedarim) {
  lines.push(`## ${SEDER_NAMES[seder.order] ?? seder.order}`)
  lines.push('')
  lines.push(
    `*${seder.tractates.length} tractates · ${seder.totalChapters} chapters · ${seder.totalMishnayot} mishnayot*`,
  )
  lines.push('')

  for (const tr of seder.tractates) {
    const shippedChapters = tr.chapters.filter((ch) =>
      shipped.has(`${seder.order}/${tr.slug}/${ch.chapter}`),
    )
    lines.push(`### ${tr.slug} (\`${tr.sefariaRef}\`)`)
    lines.push('')
    lines.push(`**${tr.chapters.length} chapters · ${tr.totalMishnayot} mishnayot**`)
    if (shippedChapters.length) {
      lines.push(`· **${shippedChapters.length} chapter(s) shipped**`)
    }
    lines.push('')

    for (const ch of tr.chapters) {
      const key = `${seder.order}/${tr.slug}/${ch.chapter}`
      const ship = shipped.get(key)
      const mishRefs = ch.mishnayot
        .map((n) => {
          const ref = `Mishnah ${tr.sefariaRef.replace(/_/g, ' ')} ${ch.chapter}:${n}`
          const isShipped = ship?.mishnayot.some((m) => m.number === n)
          if (isShipped) shippedCount++
          return isShipped ? `**${ref}** ✅` : ref
        })
        .join(' · ')

      lines.push(
        `- **Chapter ${ch.chapter}** (${ch.mishnahCount} mishnayot)${ship ? ' — ✅ SHIPPED' : ''}: ${mishRefs}`,
      )

      if (ship) {
        for (const m of ship.mishnayot) {
          lines.push(
            `  - ${m.ref}: ${m.phrases.length} phrases, ${m.quiz.length} quiz items, visual: ${visualLabel(m)}`,
          )
        }
      }
    }
    lines.push('')
  }
}

const shippedLine = `**Shipped in app:** 2 chapters · **${shippedCount} mishnayot** (${((shippedCount / catalog.totals.mishnayot) * 100).toFixed(2)}% of canon)`
const shippedIdx = lines.findIndex((l) => l.includes('_calculated below_'))
if (shippedIdx !== -1) lines[shippedIdx] = shippedLine

const outPath = join(import.meta.dirname, '../docs/MISHNAH_INVENTORY.md')
writeFileSync(outPath, lines.join('\n'))
console.log(`Wrote ${outPath} (${shippedCount} shipped mishnayot marked)`)
