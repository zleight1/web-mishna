import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { ChapterSchema } from '../src/content/schema.ts'

const authoringPath = join(import.meta.dirname, '../src/content/authoring/Mishnah_Berakhot_1.json')
const outPath = join(import.meta.dirname, '../src/content/data/zeraim/berakhot/1.json')

const authoring = JSON.parse(readFileSync(authoringPath, 'utf8'))
const parsed = ChapterSchema.parse(authoring)
mkdirSync(join(import.meta.dirname, '../src/content/data/zeraim/berakhot'), { recursive: true })
writeFileSync(outPath, JSON.stringify(parsed, null, 2))
console.log(`Built ${outPath}`)
