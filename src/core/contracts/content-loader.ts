import type { Chapter } from '@content/schema'

export interface CatalogMishnah {
  id: string
  ref: string
  number: number
}

export interface CatalogChapter {
  order: string
  tractate: string
  chapter: number
  title: Record<string, string>
  mishnayot: CatalogMishnah[]
}

export interface Catalog {
  schemaVersion: number
  chapters: CatalogChapter[]
}

export interface ContentLoader {
  getCatalog(): Promise<Catalog>
  loadChapter(order: string, tractate: string, chapter: number): Promise<Chapter>
}
