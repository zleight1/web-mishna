import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { ActivityResult } from '@core/contracts/activity'
import type { ProgressState } from '@core/contracts/progress'
import { useServices } from '@app/providers'
import { xpFromResult } from './xp'
import { todayIso, updateStreak } from './streak'

const COMPLETION_THRESHOLD = 0.8

export const useProgressStore = defineStore('progress', () => {
  const state = ref<ProgressState | null>(null)
  const loaded = ref(false)

  async function load() {
    const { progress } = useServices()
    state.value = await progress.load()
    loaded.value = true
  }

  async function save() {
    if (!state.value) return
    const { progress } = useServices()
    await progress.save(state.value)
  }

  async function recordResult(mishnahId: string, result: ActivityResult) {
    if (!state.value) await load()
    const s = state.value!
    const today = todayIso()
    s.xp += xpFromResult(result)
    s.streak = updateStreak(s.lastActiveDate, s.streak, today)
    s.lastActiveDate = today

    const prev = s.perMishnah[mishnahId] ?? {
      completed: false,
      bestScore: 0,
      lastSeen: today,
      box: 1,
    }
    const bestScore = Math.max(prev.bestScore, result.score)
    const completed = bestScore >= COMPLETION_THRESHOLD
    const box = result.correct ? Math.min(prev.box + 1, 5) : Math.max(prev.box - 1, 1)
    s.perMishnah[mishnahId] = { completed, bestScore, lastSeen: today, box }
    await save()
  }

  function getMishnahProgress(id: string) {
    return state.value?.perMishnah[id]
  }

  return { state, loaded, load, save, recordResult, getMishnahProgress }
})
