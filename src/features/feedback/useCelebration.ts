import { inject, ref, shallowRef, type InjectionKey, type Ref, type ShallowRef } from 'vue'
import { playCelebrationSound, type CelebrationKind } from './celebrationSounds'

const STORAGE_KEY = 'web-mishna-sound-muted'

export interface CelebrationBurst {
  id: number
  kind: CelebrationKind
  combo: number
}

export interface XpPop {
  id: number
  amount: number
}

export interface LevelUpPop {
  id: number
  level: number
}

export interface CelebrationContext {
  muted: Ref<boolean>
  combo: Ref<number>
  toggleMuted: () => void
  celebrate: (kind: CelebrationKind) => void
  showXp: (amount: number) => void
  notifyLevelUp: (level: number) => void
  resetCombo: () => void
  burst: ShallowRef<CelebrationBurst | null>
  xpPop: ShallowRef<XpPop | null>
  levelUp: ShallowRef<LevelUpPop | null>
  shaking: Ref<boolean>
}

export const celebrationKey: InjectionKey<CelebrationContext> = Symbol('celebration')

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

function writeMuted(muted: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
  } catch {
    // ignore
  }
}

function triggerHaptic(kind: CelebrationKind) {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return
  if (kind === 'wrong') navigator.vibrate([35, 45, 35])
  else if (kind === 'lessonComplete') navigator.vibrate([20, 30, 20, 30, 50])
  else if (kind === 'perfect') navigator.vibrate([18, 28, 18])
  else navigator.vibrate(16)
}

export function createCelebration(): CelebrationContext {
  const muted = ref(readMuted())
  const combo = ref(0)
  const burst = shallowRef<CelebrationBurst | null>(null)
  const xpPop = shallowRef<XpPop | null>(null)
  const levelUp = shallowRef<LevelUpPop | null>(null)
  const shaking = ref(false)
  let shakeTimer: ReturnType<typeof setTimeout> | undefined

  function toggleMuted() {
    muted.value = !muted.value
    writeMuted(muted.value)
  }

  function resetCombo() {
    combo.value = 0
  }

  function celebrate(kind: CelebrationKind) {
    if (kind === 'wrong') {
      combo.value = 0
    } else if (kind === 'correct' || kind === 'perfect') {
      combo.value += 1
    }

    const activeCombo = combo.value
    burst.value = { id: Date.now(), kind, combo: activeCombo }
    if (!muted.value) playCelebrationSound(kind, activeCombo)
    triggerHaptic(kind)

    if (kind === 'wrong') {
      shaking.value = true
      clearTimeout(shakeTimer)

      shakeTimer = setTimeout(() => {
        shaking.value = false
      }, 450)
    }
  }

  function showXp(amount: number) {
    if (amount <= 0) return
    xpPop.value = { id: Date.now(), amount }
  }

  function notifyLevelUp(level: number) {
    levelUp.value = { id: Date.now(), level }
    if (!muted.value) playCelebrationSound('lessonComplete', 0)
    triggerHaptic('lessonComplete')
  }

  return {
    muted,
    combo,
    toggleMuted,
    celebrate,
    showXp,
    notifyLevelUp,
    resetCombo,
    burst,
    xpPop,
    levelUp,
    shaking,
  }
}

export function useCelebration(): CelebrationContext {
  const ctx = inject(celebrationKey, null)
  if (ctx) return ctx

  const noopBurst = shallowRef<CelebrationBurst | null>(null)
  const noopXpPop = shallowRef<XpPop | null>(null)
  const noopLevelUp = shallowRef<LevelUpPop | null>(null)
  const noopShaking = ref(false)
  return {
    muted: ref(false),
    combo: ref(0),
    toggleMuted: () => {},
    celebrate: () => {},
    showXp: () => {},
    notifyLevelUp: () => {},
    resetCombo: () => {},
    burst: noopBurst,
    xpPop: noopXpPop,
    levelUp: noopLevelUp,
    shaking: noopShaking,
  }
}
