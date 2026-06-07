<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { AppButton, WordChip, FeedbackBanner } from '@ui/index'
import { validateReconstruct, type ReconstructState } from './logic'

const props = defineProps<{ state: ReconstructState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()
const { t } = useI18n()

const selected = ref<string[]>([])
const done = ref(false)
const feedback = ref<{ variant: 'success' | 'error'; message: string } | null>(null)

function addWord(word: string) {
  if (done.value) return
  selected.value.push(word)
}

function submit() {
  const result = validateReconstruct(props.state, { order: selected.value })
  feedback.value = {
    variant: result.correct ? 'success' : 'error',
    message: result.correct
      ? t('app.perfectOrder')
      : t('app.score', { pct: Math.round(result.score * 100) }),
  }
  done.value = true
  emit('complete', result)
}

function reset() {
  selected.value = []
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-text-muted)]">{{ t('app.tapWordsOrder') }}</p>
    <div
      dir="rtl"
      class="flex min-h-12 flex-wrap gap-2 rounded-lg border border-dashed border-[var(--color-border)] p-3"
    >
      <WordChip v-for="(w, i) in selected" :key="`${w}-${i}`" rtl>{{ w }}</WordChip>
    </div>
    <div class="flex flex-wrap gap-2">
      <WordChip
        v-for="(w, i) in state.shuffled"
        :key="`${w}-bank-${i}`"
        rtl
        :disabled="done"
        @click="addWord(w)"
        >{{ w }}</WordChip
      >
    </div>
    <div class="flex gap-2">
      <AppButton variant="secondary" :disabled="done" @click="reset">{{
        t('app.reset')
      }}</AppButton>
      <AppButton :disabled="done || selected.length === 0" @click="submit">{{
        t('app.check')
      }}</AppButton>
    </div>
    <FeedbackBanner v-if="feedback" :variant="feedback.variant" :message="feedback.message" />
  </div>
</template>
