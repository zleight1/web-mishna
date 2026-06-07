<script setup lang="ts">
import { computed } from 'vue'
import type { LangCode, VisualAid } from '@content/schema'

const props = defineProps<{ aid: VisualAid; lang: LangCode }>()

const events = computed(() => (props.aid.kind === 'timeline' ? props.aid.events : []))
</script>

<template>
  <svg
    v-if="aid.kind === 'timeline'"
    viewBox="0 0 400 80"
    class="w-full"
    role="img"
    aria-label="Timeline visual aid"
  >
    <title>Timeline</title>
    <defs>
      <linearGradient id="dayNight" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#1e3a5f" />
        <stop offset="50%" stop-color="#4a6fa5" />
        <stop offset="100%" stop-color="#f4c542" />
      </linearGradient>
    </defs>
    <rect x="20" y="35" width="360" height="10" rx="5" fill="url(#dayNight)" />
    <g v-for="ev in events" :key="ev.id">
      <circle :cx="20 + ev.at * 360" cy="40" r="6" fill="white" stroke="#1e4d6b" stroke-width="2" />
      <text
        :x="20 + ev.at * 360"
        y="65"
        text-anchor="middle"
        class="fill-[var(--color-text)] text-[8px]"
      >
        {{ ev.label[lang] ?? ev.label.en }}
      </text>
    </g>
  </svg>
</template>
