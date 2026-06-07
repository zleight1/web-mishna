<script setup lang="ts">
import { computed } from 'vue'
import type { LangCode, TimelineEvent, VisualAid } from '@content/schema'

const props = defineProps<{ aid: VisualAid; lang: LangCode }>()

const events = computed(() => (props.aid.kind === 'timeline' ? props.aid.events : []))

const rangeStart = computed(() => {
  if (props.aid.kind !== 'timeline') return 'Nightfall'
  const range = props.aid.range
  return range?.start[props.lang] ?? range?.start.en ?? 'Nightfall'
})

const rangeEnd = computed(() => {
  if (props.aid.kind !== 'timeline') return 'Dawn'
  const range = props.aid.range
  return range?.end[props.lang] ?? range?.end.en ?? 'Dawn'
})

const PAD = 8 // percent inset from edges so edge labels don't clip

const isRtl = computed(() => props.lang === 'he')

/** Map event `at` (0=start, 1=end) to track position; mirror for Hebrew RTL. */
function markerPosition(at: number) {
  const x = PAD + at * (100 - 2 * PAD)
  return isRtl.value ? 100 - x : x
}

function labelFor(ev: TimelineEvent) {
  return ev.label[props.lang] ?? ev.label.en ?? ''
}

function splitLabel(full: string): { short: string; detail: string } {
  const match = full.match(/^(.+?)\s*(\([^)]+\))\s*$/)
  if (match) {
    return { short: match[1]!.trim(), detail: match[2]! }
  }
  if (full.length > 24) {
    return { short: `${full.slice(0, 22)}…`, detail: '' }
  }
  return { short: full, detail: '' }
}

function labelsFor(ev: TimelineEvent) {
  const { short, detail } = splitLabel(labelFor(ev))
  if (ev.at >= 0.78 && short.toLowerCase() === 'dawn' && detail) {
    return { short: detail.replace(/^\(|\)$/g, ''), detail: '' }
  }
  return { short, detail }
}

/** Nudge labels only when same-lane neighbors are close (keeps dot centered). */
function labelTransform(index: number) {
  const at = events.value[index]!.at
  const lane = lanes.value[index]!
  let px = 0
  for (let j = 0; j < index; j++) {
    if (lanes.value[j] !== lane) continue
    const otherAt = events.value[j]!.at
    if (Math.abs(at - otherAt) < 0.17) {
      const later = at > otherAt ? 12 : -12
      px += isRtl.value ? -later : later
    }
  }
  return px === 0 ? 'translateX(-50%)' : `translateX(calc(-50% + ${px}px))`
}

function assignLane(index: number, at: number, lanes: ('above' | 'below')[]): 'above' | 'below' {
  let lane: 'above' | 'below' = index % 2 === 0 ? 'above' : 'below'

  // Center markers read best above the bar with neighbors below.
  if (at > 0.45 && at < 0.6) {
    lane = 'above'
  }

  if (index > 0) {
    const prevAt = events.value[index - 1]!.at
    const prevLane = lanes[index - 1]!
    if (Math.abs(at - prevAt) < 0.2 && lane === prevLane) {
      lane = lane === 'above' ? 'below' : 'above'
    }
  }

  return lane
}

const lanes = computed(() => {
  const result: ('above' | 'below')[] = []
  for (let i = 0; i < events.value.length; i++) {
    result.push(assignLane(i, events.value[i]!.at, result))
  }
  return result
})
</script>

<template>
  <figure
    v-if="aid.kind === 'timeline'"
    class="timeline-figure"
    role="group"
    :aria-label="`${rangeStart} to ${rangeEnd} timeline`"
  >
    <div
      class="timeline-shell"
      :class="{ 'timeline-shell--rtl': isRtl }"
      :dir="isRtl ? 'rtl' : 'ltr'"
    >
      <ul class="timeline-events">
        <li
          v-for="(ev, index) in events"
          :key="ev.id"
          class="timeline-event"
          :class="`timeline-event--${lanes[index]}`"
          :style="{ left: `${markerPosition(ev.at)}%` }"
        >
          <div class="timeline-label" :style="{ transform: labelTransform(index) }">
            <span class="timeline-label-short">{{ labelsFor(ev).short }}</span>
            <span v-if="labelsFor(ev).detail" class="timeline-label-detail">
              {{ labelsFor(ev).detail }}
            </span>
          </div>
          <span class="timeline-dot" :title="labelFor(ev)" />
        </li>
      </ul>

      <div class="timeline-track" aria-hidden="true">
        <span class="timeline-edge timeline-edge--start">{{ rangeStart }}</span>
        <div class="timeline-gradient" />
        <span class="timeline-edge timeline-edge--end">{{ rangeEnd }}</span>
      </div>
    </div>
  </figure>
</template>

<style scoped>
.timeline-figure {
  margin: 1.25rem 0 0.25rem;
  padding: 0;
}

.timeline-shell {
  position: relative;
  padding: 3.25rem 0;
}

.timeline-track {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline-edge {
  flex-shrink: 0;
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  width: 3.5rem;
  line-height: 1.15;
  hyphens: auto;
}

.timeline-edge--start {
  text-align: right;
}

.timeline-edge--end {
  text-align: left;
}

.timeline-gradient {
  flex: 1;
  height: 0.625rem;
  border-radius: 9999px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgb(0 0 0 / 0.12);
  background: linear-gradient(
    var(--timeline-flow, 90deg),
    #1e3a5f 0%,
    #2d4f73 25%,
    #4a6fa5 50%,
    #8b9cb8 75%,
    #f4c542 100%
  );
}

.timeline-shell--rtl {
  --timeline-flow: 270deg;
}

.timeline-shell--rtl .timeline-edge--start {
  text-align: left;
}

.timeline-shell--rtl .timeline-edge--end {
  text-align: right;
}

.timeline-events {
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  left: calc(3.5rem + 0.5rem);
  right: calc(3.5rem + 0.5rem);
  top: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.timeline-event {
  position: absolute;
  top: 50%;
  width: min(5.5rem, 24vw);
  transform: translateX(-50%);
  pointer-events: auto;
}

.timeline-dot {
  position: absolute;
  top: 0;
  left: 50%;
  display: block;
  width: 0.875rem;
  height: 0.875rem;
  border-radius: 50%;
  background: white;
  border: 2px solid var(--color-primary);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
  transform: translate(-50%, -50%);
}

.timeline-label {
  position: absolute;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  text-align: center;
  line-height: 1.2;
  width: 100%;
}

.timeline-event--above .timeline-label {
  bottom: 0.55rem;
}

.timeline-event--below .timeline-label {
  top: 0.55rem;
}

.timeline-label-short {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--color-text);
  word-break: break-word;
  hyphens: auto;
}

.timeline-label-detail {
  font-size: 0.6rem;
  color: var(--color-text-muted);
  word-break: break-word;
}

@media (min-width: 480px) {
  .timeline-shell {
    padding: 3.5rem 0;
  }

  .timeline-event {
    width: min(5.75rem, 18vw);
  }

  .timeline-edge {
    font-size: 0.65rem;
  }

  .timeline-label-short {
    font-size: 0.72rem;
  }

  .timeline-label-detail {
    font-size: 0.65rem;
  }
}

@media (min-width: 640px) {
  .timeline-event {
    width: min(6.25rem, 14vw);
  }
}

@media (max-width: 420px) {
  .timeline-event {
    width: min(4.75rem, 21vw);
  }

  .timeline-edge {
    width: 2.75rem;
    font-size: 0.58rem;
  }

  .timeline-events {
    left: calc(2.75rem + 0.5rem);
    right: calc(2.75rem + 0.5rem);
  }

  .timeline-label-short {
    font-size: 0.62rem;
  }

  .timeline-label-detail {
    font-size: 0.56rem;
  }
}
</style>
