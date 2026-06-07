import type { Catalog, ContentLoader } from '@core/contracts/content-loader'
import type { ProgressRepository, ProgressState } from '@core/contracts/progress'
import type { Scheduler, Telemetry } from '@core/contracts/services'
import { sortCatalogChapters } from '@content/catalogOrder'
import { ChapterSchema } from '@content/schema'

const PROGRESS_KEY = 'web-mishna-progress'
const PROGRESS_SCHEMA_VERSION = 1

const defaultProgress = (): ProgressState => ({
  schemaVersion: PROGRESS_SCHEMA_VERSION,
  xp: 0,
  streak: 0,
  lastActiveDate: '',
  perMishnah: {},
})

export class LocalStorageProgressRepository implements ProgressRepository {
  async load(): Promise<ProgressState> {
    if (typeof localStorage === 'undefined') return defaultProgress()
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (!raw) return defaultProgress()
    try {
      return JSON.parse(raw) as ProgressState
    } catch {
      return defaultProgress()
    }
  }

  async save(state: ProgressState): Promise<void> {
    if (typeof localStorage === 'undefined') return
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(state))
  }
}

export class StaticContentLoader implements ContentLoader {
  private catalogCache: Catalog | null = null

  private async loadAllChapters() {
    const modules = import.meta.glob<{ default: unknown }>('/src/content/data/**/*.json')
    const chapters = []
    for (const path of Object.keys(modules).sort()) {
      const loader = modules[path]
      if (!loader) continue
      const mod = await loader()
      const parsed = ChapterSchema.parse(mod.default)
      chapters.push(parsed)
    }
    return chapters
  }

  async getCatalog(): Promise<Catalog> {
    if (this.catalogCache) return this.catalogCache
    const chapters = await this.loadAllChapters()
    const catalogChapters = chapters.map((ch) => ({
      order: ch.order,
      tractate: ch.tractate,
      chapter: ch.chapter,
      title: ch.title,
      mishnayot: ch.mishnayot.map((m) => ({
        id: m.id,
        ref: m.ref,
        heRef: m.heRef,
        number: m.number,
      })),
    }))
    this.catalogCache = {
      schemaVersion: 1,
      chapters: sortCatalogChapters(catalogChapters),
    }
    return this.catalogCache
  }

  async loadChapter(order: string, tractate: string, chapter: number) {
    const modules = import.meta.glob<{ default: unknown }>('/src/content/data/**/*.json')
    const suffix = `${order}/${tractate}/${chapter}.json`
    const key = Object.keys(modules).find((k) => k.endsWith(suffix) || k.includes(suffix))
    if (!key) throw new Error(`Chapter not found: ${order}/${tractate}/${chapter}`)
    const loader = modules[key]
    if (!loader) throw new Error(`Chapter loader missing: ${key}`)
    const mod = await loader()
    return ChapterSchema.parse(mod.default)
  }
}

export class IdentityScheduler implements Scheduler {
  next(ids: string[], _progress: ProgressState): string[] {
    return ids
  }
}

export class NoopTelemetry implements Telemetry {
  track(_event: string, _props?: Record<string, unknown>): void {
    // noop
  }
}

export function createDefaultServices() {
  return {
    content: new StaticContentLoader(),
    progress: new LocalStorageProgressRepository(),
    scheduler: new IdentityScheduler(),
    telemetry: new NoopTelemetry(),
  }
}
