import { writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const ref = process.argv[2] ?? 'Mishnah_Berakhot.1'
const heVersion = process.argv.find((a) => a.startsWith('--he='))?.slice(5) ?? 'hebrew'
const enVersion = process.argv.find((a) => a.startsWith('--en='))?.slice(5) ?? 'english'

const url = `https://www.sefaria.org/api/v3/texts/${encodeURIComponent(ref)}?version=${heVersion}&version=${enVersion}`
const outDir = join(import.meta.dirname, '../src/content/raw')
mkdirSync(outDir, { recursive: true })

const res = await fetch(url)
if (!res.ok) throw new Error(`Sefaria fetch failed: ${res.status}`)
const data = await res.json()
const outfile = join(outDir, `${ref.replace(/\./g, '_')}.raw.json`)
writeFileSync(outfile, JSON.stringify(data, null, 2))
console.log(`Wrote ${outfile}`)
