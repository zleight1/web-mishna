import { inject, ref, shallowRef, type InjectionKey, type Ref, type ShallowRef } from 'vue'
import { playCelebrationSound, type CelebrationKind } from './celebrationSounds'

const STORAGE_KEY = 'web-mishna-sound-muted'

export interface CelebrationBurst {
  id: number
  kind: CelebrationKind
}

export interface CelebrationContext {
  muted: Ref<boolean>
  toggleMuted: () => void
  celebrate: (kind: CelebrationKind) => void
  burst: ShallowRef<CelebrationBurst | null>
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

export function createCelebration(): CelebrationContext {
  const muted = ref(readMuted())
  const burst = shallowRef<CelebrationBurst | null>(null)
  const shaking = ref(false)
  let shakeTimer: ReturnType<typeof setTimeout> | undefined

  function toggleMuted() {
    muted.value = !muted.value
    writeMuted(muted.value)
  }

  function celebrate(kind: CelebrationKind) {
    burst.value = { id: Date.now(), kind }
    if (!muted.value) playCelebrationSound(kind)

    if (kind === 'wrong') {
      shaking.value = true
      clearTimeout(shakeTimer)
      shakeTimer = setTimeout(() => {
        shaking.value = false
      }, 450)
    }
  }

  return { muted, toggleMuted, celebrate, burst, shaking }
}

export function useCelebration(): CelebrationContext {
  const ctx = inject(celebrationKey, null)
  if (ctx) return ctx

  const noopBurst = shallowRef<CelebrationBurst | null>(null)
  const noopShaking = ref(false)
  return {
    muted: ref(false),
    toggleMuted: () => {},
    celebrate: () => {},
    burst: noopBurst,
    shaking: noopShaking,
  }
}
