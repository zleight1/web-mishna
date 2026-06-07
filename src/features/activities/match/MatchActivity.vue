<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { AppButton, FeedbackBanner } from '@ui/index'
import { useCelebration } from '@features/feedback/useCelebration'
import { validateMatch, type MatchState } from './logic'

const props = defineProps<{ state: MatchState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()
const { t } = useI18n()
const { celebrate } = useCelebration()

const activeHe = ref<string | null>(null)
const links = ref<Record<string, string>>({})
const done = ref(false)
const feedback = ref<{ variant: 'success' | 'error'; message: string } | null>(null)

const usedEn = computed(() => new Set(Object.values(links.value)))

const openPairs = computed(() => props.state.pairs.filter((pair) => !links.value[pair.id]))

const availableEn = computed(() => props.state.shuffledEn.filter((en) => !usedEn.value.has(en)))

const matchedPairs = computed(() =>
  props.state.pairs.filter((pair) => links.value[pair.id] != null),
)

function pickHe(id: string) {
  if (done.value) return
  activeHe.value = id
}

function pickEn(en: string) {
  if (done.value || !activeHe.value) return
  const pair = props.state.pairs.find((p) => p.id === activeHe.value)
  const heId = activeHe.value
  links.value[heId] = en
  activeHe.value = null
  if (pair) celebrate(pair.en === en ? 'correct' : 'wrong')
}

function submit() {
  const result = validateMatch(props.state, { links: links.value })
  if (result.correct) celebrate('perfect')
  feedback.value = {
    variant: result.correct ? 'success' : 'error',
    message: result.correct
      ? t('app.allMatched')
      : t('app.score', { pct: Math.round(result.score * 100) }),
  }
  done.value = true
  emit('complete', result)
}
</script>

<template>
  <div class="match-activity">
    <p v-if="matchedPairs.length" class="match-progress">
      {{ t('app.matched', { n: matchedPairs.length, total: state.pairs.length }) }}
    </p>

    <div v-if="matchedPairs.length" class="matched-tray">
      <p class="matched-tray-label">{{ t('app.matchedTray') }}</p>
      <ul class="matched-tray-list">
        <li v-for="pair in matchedPairs" :key="pair.id" class="matched-tray-item">
          <span dir="rtl" lang="he">{{ pair.he }}</span>
          <span class="matched-tray-arrow" aria-hidden="true">↔</span>
          <span>{{ links[pair.id] }}</span>
        </li>
      </ul>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="space-y-2">
        <p class="text-xs font-medium text-[var(--color-text-muted)]">{{ t('app.hebrew') }}</p>
        <button
          v-for="pair in openPairs"
          :key="pair.id"
          type="button"
          class="match-pick"
          :class="{ 'match-pick--active': activeHe === pair.id }"
          dir="rtl"
          lang="he"
          @click="pickHe(pair.id)"
        >
          {{ pair.he }}
        </button>
        <p v-if="openPairs.length === 0" class="match-empty">{{ t('app.allMatched') }} ✓</p>
      </div>
      <div class="space-y-2">
        <p class="text-xs font-medium text-[var(--color-text-muted)]">{{ t('app.english') }}</p>
        <button
          v-for="en in availableEn"
          :key="en"
          type="button"
          class="match-pick"
          @click="pickEn(en)"
        >
          {{ en }}
        </button>
        <p v-if="availableEn.length === 0 && !done" class="match-empty">
          {{ t('app.matchedTray') }} ✓
        </p>
      </div>
    </div>

    <AppButton :disabled="done || matchedPairs.length < state.pairs.length" @click="submit">
      {{ t('app.checkMatches') }}
    </AppButton>
    <FeedbackBanner
      v-if="feedback"
      class="mt-3"
      :variant="feedback.variant"
      :message="feedback.message"
    />
  </div>
</template>

<style scoped>
.match-activity {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.match-progress {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-primary);
}

.matched-tray {
  padding: 0.65rem 0.75rem;
  border-radius: 0.75rem;
  background: color-mix(in srgb, var(--color-success) 8%, white);
  border: 1px solid color-mix(in srgb, var(--color-success) 25%, var(--color-border));
}

.matched-tray-label {
  margin: 0 0 0.4rem;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-success);
}

.matched-tray-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.matched-tray-item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem 0.5rem;
  font-size: 0.82rem;
  font-weight: 600;
}

.matched-tray-arrow {
  color: var(--color-text-muted);
}

.match-pick {
  display: block;
  min-height: 2.75rem;
  width: 100%;
  border-radius: 0.75rem;
  border: 2px solid var(--color-border);
  padding: 0.55rem 0.75rem;
  background: white;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: start;
  cursor: pointer;
  transition:
    border-color 0.15s,
    transform 0.15s,
    background 0.15s;
}

.match-pick:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.match-pick--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.match-empty {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-success);
}
</style>
