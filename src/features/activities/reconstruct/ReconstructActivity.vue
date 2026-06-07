<script setup lang="ts">
import { ref } from 'vue'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { AppButton, WordChip, FeedbackBanner } from '@ui/index'
import { validateReconstruct, type ReconstructState } from './logic'

const props = defineProps<{ state: ReconstructState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()

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
    message: result.correct ? 'Perfect order!' : `Score: ${Math.round(result.score * 100)}%`,
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
    <p class="text-sm text-[var(--color-text-muted)]">Tap words in the correct order:</p>
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
      <AppButton variant="secondary" :disabled="done" @click="reset">Reset</AppButton>
      <AppButton :disabled="done || selected.length === 0" @click="submit">Check</AppButton>
    </div>
    <FeedbackBanner v-if="feedback" :variant="feedback.variant" :message="feedback.message" />
  </div>
</template>
