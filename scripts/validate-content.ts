import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { ChapterSchema } from '../src/content/schema.ts'

const dataDir = join(import.meta.dirname, '../src/content/data')

function walk(dir: string): string[] {
  const files: string[] = []
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) files.push(...walk(full))
    else if (entry.endsWith('.json')) files.push(full)
  }
  return files
}

let failed = false
for (const file of walk(dataDir)) {
  const raw = JSON.parse(readFileSync(file, 'utf8'))
  const result = ChapterSchema.safeParse(raw)
  if (!result.success) {
    console.error(`FAIL ${file}:`, result.error.message)
    failed = true
  } else {
    console.log(`OK ${file} (${result.data.mishnayot.length} mishnayot)`)
  }
}
process.exit(failed ? 1 : 0)
