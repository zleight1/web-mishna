<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { CelebrationBurst } from '@features/feedback/useCelebration'
import type { CelebrationKind } from '@features/feedback/celebrationSounds'

const props = defineProps<{
  burst: CelebrationBurst | null
}>()

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

function particleCount(kind: CelebrationKind) {
  if (kind === 'lessonComplete') return 72
  if (kind === 'perfect') return 48
  if (kind === 'correct') return 28
  return 14
}

function floaterCount(kind: CelebrationKind) {
  if (kind === 'lessonComplete') return 10
  if (kind === 'perfect') return 6
  if (kind === 'correct') return 4
  return 2
}

function spawn(kind: CelebrationKind) {
  const count = particleCount(kind)
  particles.value = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${8 + Math.random() * 84}%`,
    delay: `${Math.random() * 0.25}s`,
    duration: `${0.9 + Math.random() * 0.9}s`,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
    size: `${6 + Math.random() * 8}px`,
    rotate: `${Math.random() * 360}deg`,
  }))

  const emojis = kind === 'wrong' ? ['😅', '💪', '🔁'] : ['🎉', '✨', '⭐', '🌟', '🙌']
  floaters.value = Array.from({ length: floaterCount(kind) }, (_, i) => ({
    id: i,
    emoji: emojis[i % emojis.length]!,
    left: `${15 + Math.random() * 70}%`,
    delay: `${Math.random() * 0.15}s`,
    duration: `${0.8 + Math.random() * 0.5}s`,
    scale: `${0.9 + Math.random() * 0.6}`,
  }))

  flash.value = kind === 'wrong' ? 'error' : kind === 'lessonComplete' ? 'gold' : 'success'
  /* eslint-disable no-undef -- celebration timers in client-only overlay */
  setTimeout(
    () => {
      flash.value = null
    },
    kind === 'lessonComplete' ? 700 : 420,
  )

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
    spawn(props.burst.kind)
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
