import { z } from 'zod'

export const CONTENT_SCHEMA_VERSION = 1
export type LangCode = 'he' | 'en' | 'fr' | 'es'
export const SOURCE_LANG: LangCode = 'he'

export const PhraseSchema = z.object({
  he: z.string().min(1),
  translations: z.record(z.string(), z.string()),
  translit: z.string().optional(),
})

export const QuizItemSchema = z.object({
  id: z.string(),
  prompt: z.record(z.string(), z.string()),
  choices: z.array(z.record(z.string(), z.string())).min(2),
  answerIdx: z.number().int().nonnegative(),
  explanation: z.record(z.string(), z.string()).optional(),
})

export const TimelineEventSchema = z.object({
  id: z.string(),
  at: z.number().min(0).max(1),
  label: z.record(z.string(), z.string()),
  marker: z.enum(['nightfall', 'midnight', 'dawn', 'sunrise', 'midday', 'sunset', 'custom']),
})

const TimelineRangeSchema = z.object({
  start: z.record(z.string(), z.string()),
  end: z.record(z.string(), z.string()),
})

const LocalizedSchema = z.record(z.string(), z.string())

export const SukkahDimensionsSpecSchema = z.object({
  type: z.literal('sukkah-dimensions'),
  title: LocalizedSchema.optional(),
  minHeightTefachim: z.number().int().positive(),
  maxHeightAmot: z.number().int().positive(),
  minWalls: z.number().int().positive(),
  dispute: z
    .object({
      figure: LocalizedSchema,
      opinion: LocalizedSchema,
    })
    .optional(),
})

export const Diagram2dSpecSchema = z.discriminatedUnion('type', [SukkahDimensionsSpecSchema])

export const VisualAidSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('timeline'),
    range: TimelineRangeSchema.optional(),
    events: z.array(TimelineEventSchema).min(2),
  }),
  z.object({ kind: z.literal('diagram2d'), spec: Diagram2dSpecSchema }),
  z.object({ kind: z.literal('scene3d'), model: z.unknown() }),
])

export const MishnahSchema = z.object({
  schemaVersion: z.literal(CONTENT_SCHEMA_VERSION),
  id: z.string(),
  ref: z.string(),
  heRef: z.string(),
  order: z.string(),
  tractate: z.string(),
  chapter: z.number().int().positive(),
  number: z.number().int().positive(),
  phrases: z.array(PhraseSchema).min(1),
  quiz: z.array(QuizItemSchema).default([]),
  visualAid: VisualAidSchema.optional(),
  source: z.object({
    heVersion: z.string(),
    enVersion: z.string(),
    license: z.string(),
    url: z.string(),
  }),
})

export const ChapterSchema = z.object({
  schemaVersion: z.literal(CONTENT_SCHEMA_VERSION),
  order: z.string(),
  tractate: z.string(),
  chapter: z.number().int().positive(),
  title: z.record(z.string(), z.string()),
  mishnayot: z.array(MishnahSchema).min(1),
})

export type Phrase = z.infer<typeof PhraseSchema>
export type QuizItem = z.infer<typeof QuizItemSchema>
export type TimelineEvent = z.infer<typeof TimelineEventSchema>
export type SukkahDimensionsSpec = z.infer<typeof SukkahDimensionsSpecSchema>
export type Diagram2dSpec = z.infer<typeof Diagram2dSpecSchema>
export type VisualAid = z.infer<typeof VisualAidSchema>
export type Mishnah = z.infer<typeof MishnahSchema>
export type Chapter = z.infer<typeof ChapterSchema>
