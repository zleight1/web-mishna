<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { WordChip, FeedbackBanner } from '@ui/index'
import { useCelebration } from '@features/feedback/useCelebration'
import { validateCloze, type ClozeState } from './logic'

const props = defineProps<{ state: ClozeState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()
const { t } = useI18n()
const { celebrate } = useCelebration()

const feedback = ref<{ variant: 'success' | 'error'; message: string } | null>(null)
const done = ref(false)
const picked = ref<string | null>(null)

function pick(choice: string) {
  if (done.value) return
  picked.value = choice
  const result = validateCloze(props.state, { choice })
  celebrate(result.correct ? 'correct' : 'wrong')
  feedback.value = {
    variant: result.correct ? 'success' : 'error',
    message: result.correct ? t('app.correct') : t('app.tryAgain'),
  }
  done.value = true
  emit('complete', result)
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-text-muted)]">{{ state.phraseEn }}</p>
    <p dir="rtl" lang="he" class="text-xl leading-relaxed">
      <template v-for="(token, i) in state.tokens" :key="i">
        <span :class="{ 'rounded bg-yellow-100 px-1': i === state.blankIndex }">{{
          i === state.blankIndex ? '___' : token
        }}</span>
        {{ ' ' }}
      </template>
    </p>
    <div class="flex flex-wrap gap-2">
      <WordChip
        v-for="opt in state.options"
        :key="opt"
        rtl
        :disabled="done"
        :correct="done ? (opt === state.answer ? true : picked === opt ? false : null) : null"
        @click="pick(opt)"
      >
        {{ opt }}
      </WordChip>
    </div>
    <FeedbackBanner v-if="feedback" :variant="feedback.variant" :message="feedback.message" />
  </div>
</template>
