import { ChapterSchema } from '@content/schema'
import fixtureJson from './berakhot-1.fixture.json'

export const fixtureChapter = ChapterSchema.parse(fixtureJson)
export const fixtureMishnah = fixtureChapter.mishnayot[0]!
