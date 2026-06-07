import { describe, it, expect, beforeEach } from 'vitest'
import {
  LocalStorageProgressRepository,
  StaticContentLoader,
  IdentityScheduler,
  NoopTelemetry,
} from './defaults'

describe('default services', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists progress to localStorage', async () => {
    const repo = new LocalStorageProgressRepository()
    await repo.save({
      schemaVersion: 1,
      xp: 10,
      streak: 1,
      lastActiveDate: '2026-06-07',
      perMishnah: {},
    })
    const loaded = await repo.load()
    expect(loaded.xp).toBe(10)
  })

  it('loads catalog from content data', async () => {
    const loader = new StaticContentLoader()
    const catalog = await loader.getCatalog()
    expect(catalog.chapters.length).toBeGreaterThan(0)
    expect(catalog.chapters[0]!.mishnayot.length).toBe(5)
  })

  it('loads a chapter by path', async () => {
    const loader = new StaticContentLoader()
    const ch = await loader.loadChapter('zeraim', 'berakhot', 1)
    expect(ch.mishnayot.length).toBe(5)
  })

  it('identity scheduler returns same ids', () => {
    const s = new IdentityScheduler()
    expect(
      s.next(['a', 'b'], {
        schemaVersion: 1,
        xp: 0,
        streak: 0,
        lastActiveDate: '',
        perMishnah: {},
      }),
    ).toEqual(['a', 'b'])
  })

  it('noop telemetry does not throw', () => {
    const t = new NoopTelemetry()
    expect(() => t.track('test')).not.toThrow()
  })
})
