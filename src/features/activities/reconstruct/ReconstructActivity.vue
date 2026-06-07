<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { AppButton, WordChip, FeedbackBanner } from '@ui/index'
import { useCelebration } from '@features/feedback/useCelebration'
import { validateReconstruct, type ReconstructState } from './logic'

const props = defineProps<{ state: ReconstructState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()
const { t } = useI18n()
const { celebrate } = useCelebration()

const selected = ref<string[]>([])
const bank = ref([...props.state.shuffled])
const done = ref(false)
const feedback = ref<{ variant: 'success' | 'error'; message: string } | null>(null)

function addWord(word: string) {
  if (done.value) return
  const idx = bank.value.indexOf(word)
  if (idx === -1) return
  bank.value.splice(idx, 1)
  selected.value.push(word)
}

function removeWord(index: number) {
  if (done.value) return
  const word = selected.value[index]
  if (!word) return
  selected.value.splice(index, 1)
  bank.value.push(word)
}

function submit() {
  const result = validateReconstruct(props.state, { order: selected.value })
  celebrate(result.correct ? 'perfect' : 'wrong')
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
  bank.value = [...props.state.shuffled]
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-text-muted)]">{{ t('app.tapWordsOrder') }}</p>
    <p v-if="selected.length && !done" class="reconstruct-hint">{{ t('app.tapToRemove') }}</p>

    <div
      dir="rtl"
      class="reconstruct-sentence flex min-h-12 flex-wrap gap-2 rounded-lg border border-dashed border-[var(--color-border)] p-3"
    >
      <WordChip
        v-for="(w, i) in selected"
        :key="`${w}-${i}`"
        rtl
        :disabled="done"
        selected
        @click="removeWord(i)"
      >
        {{ w }}
      </WordChip>
    </div>

    <div v-if="bank.length" class="space-y-2">
      <p class="text-xs font-medium text-[var(--color-text-muted)]">{{ t('app.wordBank') }}</p>
      <div class="flex flex-wrap gap-2">
        <WordChip
          v-for="(w, i) in bank"
          :key="`${w}-bank-${i}`"
          rtl
          :disabled="done"
          @click="addWord(w)"
        >
          {{ w }}
        </WordChip>
      </div>
    </div>
    <p v-else-if="!done" class="reconstruct-empty">{{ t('app.wordBank') }} ✓</p>

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

<style scoped>
.reconstruct-hint {
  margin: -0.35rem 0 0;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.reconstruct-empty {
  margin: 0;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-success);
}
</style>
