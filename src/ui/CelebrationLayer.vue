<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { CelebrationBurst, LevelUpPop, XpPop } from '@features/feedback/useCelebration'
import type { CelebrationKind } from '@features/feedback/celebrationSounds'

const props = defineProps<{
  burst: CelebrationBurst | null
  xpPop: XpPop | null
  levelUp: LevelUpPop | null
}>()

const { t } = useI18n()

interface Particle {
  id: number
  left: string
  delay: string
  duration: string
  color: string
  size: string
  rotate: string
}

interface Floater {
  id: number
  emoji: string
  left: string
  delay: string
  duration: string
  scale: string
}

const particles = ref<Particle[]>([])
const floaters = ref<Floater[]>([])
const flash = ref<'success' | 'error' | 'gold' | null>(null)
const showCombo = ref(false)
const comboCount = ref(0)
const activeXp = ref<XpPop | null>(null)
const activeLevelUp = ref<LevelUpPop | null>(null)

const CONFETTI_COLORS = [
  '#c9a227',
  '#1e4d6b',
  '#2d6a4f',
  '#e07a5f',
  '#f2cc8f',
  '#81b29a',
  '#f4a261',
]

const burstEmoji = computed(() => {
  const kind = props.burst?.kind
  if (kind === 'wrong') return '💪'
  if (kind === 'lessonComplete') return '🏆'
  if (kind === 'perfect') return '⭐'
  return '🎉'
})

function particleCount(kind: CelebrationKind, combo: number) {
  let base = 14
  if (kind === 'lessonComplete') base = 72
  else if (kind === 'perfect') base = 48
  else if (kind === 'correct') base = 28
  return base + Math.min(combo, 7) * 4
}

function floaterCount(kind: CelebrationKind, combo: number) {
  let base = 2
  if (kind === 'lessonComplete') base = 10
  else if (kind === 'perfect') base = 6
  else if (kind === 'correct') base = 4
  return base + Math.min(combo, 5)
}

function spawn(kind: CelebrationKind, combo: number) {
  const count = particleCount(kind, combo)
  particles.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 0.25}s`,
    duration: `${0.9 + Math.random() * 0.9}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
    size: `${6 + Math.random() * 8}px`,
    rotate: `${Math.random() * 360}deg`,
  }))

  const emojis =
    kind === 'wrong'
      ? ['😅', '💪', '🔁']
      : combo >= 5
        ? ['🔥', '⚡', '🌟', '🎉', '💥']
        : ['🎉', '✨', '⭐', '🌟', '🙌']
  floaters.value = Array.from({ length: floaterCount(kind, combo) }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length]!,
    left: `${15 + Math.random() * 70}%`,
    delay: `${Math.random() * 0.15}s`,
    duration: `${0.8 + Math.random() * 0.5}s`,
    scale: `${0.9 + Math.random() * 0.6}`,
  }))

  flash.value = kind === 'wrong' ? 'error' : kind === 'lessonComplete' ? 'gold' : 'success'
  showCombo.value = combo >= 3 && kind !== 'wrong'
  comboCount.value = combo

  /* eslint-disable no-undef -- celebration timers in client-only overlay */
  setTimeout(
    () => {
      flash.value = null
    },
    kind === 'lessonComplete' ? 700 : 420,
  )

  setTimeout(() => {
    showCombo.value = false
  }, 1200)

  setTimeout(() => {
    particles.value = []
    floaters.value = []
  }, 2200)
  /* eslint-enable no-undef */
}

watch(
  () => props.burst?.id,
  (id) => {
    if (id == null || !props.burst) return
    spawn(props.burst.kind, props.burst.combo)
  },
)

watch(
  () => props.xpPop?.id,
  (id) => {
    if (id == null || !props.xpPop) return
    activeXp.value = props.xpPop
    /* eslint-disable no-undef -- xp pop timer */
    setTimeout(() => {
      activeXp.value = null
    }, 1100)
    /* eslint-enable no-undef */
  },
)

watch(
  () => props.levelUp?.id,
  (id) => {
    if (id == null || !props.levelUp) return
    activeLevelUp.value = props.levelUp
    spawn('lessonComplete', 0)
    /* eslint-disable no-undef -- level-up timer */
    setTimeout(() => {
      activeLevelUp.value = null
    }, 2200)
    /* eslint-enable no-undef */
  },
)
</script>

<template>
  <div class="celebration-layer" aria-hidden="true">
    <div
      v-if="flash"
      class="celebration-flash"
      :class="{
        'celebration-flash--success': flash === 'success',
        'celebration-flash--error': flash === 'error',
        'celebration-flash--gold': flash === 'gold',
      }"
    />

    <div
      v-for="p in particles"
      :key="`p-${burst?.id}-${p.id}`"
      class="celebration-particle"
      :style="{
        left: p.left,
        animationDelay: p.delay,
        animationDuration: p.duration,
        backgroundColor: p.color,
        width: p.size,
        height: p.size,
        '--spin': p.rotate,
      }"
    />

    <div
      v-for="f in floaters"
      :key="`f-${burst?.id}-${f.id}`"
      class="celebration-floater"
      :style="{
        left: f.left,
        animationDelay: f.delay,
        animationDuration: f.duration,
        '--scale': f.scale,
      }"
    >
      {{ f.emoji }}
    </div>

    <div v-if="burst && burst.kind !== 'wrong'" :key="burst.id" class="celebration-hero">
      {{ burstEmoji }}
    </div>

    <div v-if="showCombo" :key="`combo-${burst?.id}`" class="celebration-combo">
      🔥 {{ t('app.combo', { n: comboCount }) }}
    </div>

    <div v-if="activeXp" :key="`xp-${activeXp.id}`" class="celebration-xp">
      +{{ activeXp.amount }} {{ t('app.xp') }}
    </div>

    <div v-if="activeLevelUp" :key="`lvl-${activeLevelUp.id}`" class="celebration-level-up">
      <span class="celebration-level-up-emoji">🎓</span>
      <span class="celebration-level-up-text">{{
        t('app.levelUp', { n: activeLevelUp.level })
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.celebration-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 60;
  overflow: hidden;
}

.celebration-flash {
  position: absolute;
  inset: 0;
  animation: celebration-flash 0.42s ease-out forwards;
}

.celebration-flash--success {
  background: radial-gradient(circle at center, rgb(45 106 79 / 0.22), transparent 68%);
}

.celebration-flash--error {
  background: radial-gradient(circle at center, rgb(155 34 38 / 0.18), transparent 68%);
}

.celebration-flash--gold {
  background: radial-gradient(circle at center, rgb(201 162 39 / 0.28), transparent 72%);
}

.celebration-particle {
  position: absolute;
  top: -12px;
  border-radius: 2px;
  animation: celebration-fall linear forwards;
  transform: rotate(var(--spin));
}

.celebration-floater {
  position: absolute;
  top: 38%;
  font-size: 1.75rem;
  animation: celebration-pop-float ease-out forwards;
  transform: scale(var(--scale));
}

.celebration-hero {
  position: absolute;
  top: 32%;
  left: 50%;
  font-size: 4rem;
  transform: translateX(-50%);
  animation: celebration-hero-pop 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  filter: drop-shadow(0 8px 16px rgb(30 77 107 / 0.15));
}

.celebration-combo {
  position: absolute;
  top: 22%;
  left: 50%;
  transform: translateX(-50%);
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  background: linear-gradient(135deg, #ff6b35, #f7b801);
  color: white;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  box-shadow: 0 8px 24px rgb(255 107 53 / 0.35);
  animation: celebration-combo-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.celebration-xp {
  position: absolute;
  top: 48%;
  right: 12%;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-accent);
  text-shadow: 0 2px 8px rgb(201 162 39 / 0.45);
  animation: celebration-xp-rise 1s ease-out forwards;
}

.celebration-level-up {
  position: absolute;
  top: 26%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  animation: celebration-hero-pop 1.1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

.celebration-level-up-emoji {
  font-size: 3.5rem;
}

.celebration-level-up-text {
  padding: 0.4rem 0.85rem;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  font-size: 1rem;
  font-weight: 800;
  font-family: var(--font-display);
}

@keyframes celebration-fall {
  0% {
    transform: translateY(0) rotate(var(--spin));
    opacity: 1;
  }
  100% {
    transform: translateY(110vh) rotate(calc(var(--spin) + 540deg));
    opacity: 0;
  }
}

@keyframes celebration-pop-float {
  0% {
    transform: translateY(0) scale(0.2);
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    transform: translateY(-6rem) scale(var(--scale));
    opacity: 0;
  }
}

@keyframes celebration-hero-pop {
  0% {
    transform: translateX(-50%) scale(0.2);
    opacity: 0;
  }
  55% {
    transform: translateX(-50%) scale(1.15);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 0;
  }
}

@keyframes celebration-combo-pop {
  0% {
    transform: translateX(-50%) scale(0.4);
    opacity: 0;
  }
  60% {
    transform: translateX(-50%) scale(1.08);
    opacity: 1;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

@keyframes celebration-xp-rise {
  0% {
    transform: translateY(12px) scale(0.7);
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    transform: translateY(-48px) scale(1.05);
    opacity: 0;
  }
}

@keyframes celebration-flash {
  0% {
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
