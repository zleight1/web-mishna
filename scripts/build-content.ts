import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import { ChapterSchema } from '../src/content/schema.ts'

const authoringDir = join(import.meta.dirname, '../src/content/authoring')
const dataRoot = join(import.meta.dirname, '../src/content/data')

const ORDER_BY_TRACTATE: Record<string, string> = {
  berakhot: 'zeraim',
  sukkah: 'moed',
}

for (const file of readdirSync(authoringDir).filter((f) => f.endsWith('.json'))) {
  const authoring = JSON.parse(readFileSync(join(authoringDir, file), 'utf8'))
  const parsed = ChapterSchema.parse(authoring)
  const order = parsed.order ?? ORDER_BY_TRACTATE[parsed.tractate] ?? parsed.tractate
  const outDir = join(dataRoot, order, parsed.tractate)
  const outPath = join(outDir, `${parsed.chapter}.json`)
  mkdirSync(outDir, { recursive: true })
  writeFileSync(outPath, JSON.stringify(parsed, null, 2))
  console.log(`Built ${outPath}`)
}
