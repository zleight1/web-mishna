<script setup lang="ts">
import { ref } from 'vue'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { ChoiceButton, AppButton, FeedbackBanner } from '@ui/index'
import { validateQuiz, type QuizState } from './logic'

const props = defineProps<{ state: QuizState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()

const current = ref(0)
const answers = ref<number[]>([])
const picked = ref<number | null>(null)
const showExplanation = ref(false)
const done = ref(false)
const feedback = ref<{ variant: 'success' | 'error'; message: string } | null>(null)

const q = () => props.state.questions[current.value]!

function pick(idx: number) {
  if (done.value) return
  picked.value = idx
  showExplanation.value = true
}

function next() {
  if (picked.value === null) return
  answers.value.push(picked.value)
  picked.value = null
  showExplanation.value = false
  if (current.value < props.state.questions.length - 1) {
    current.value++
  } else {
    const result = validateQuiz(props.state, { answers: answers.value })
    feedback.value = {
      variant: result.correct ? 'success' : 'error',
      message: `Quiz score: ${Math.round(result.score * 100)}%`,
    }
    done.value = true
    emit('complete', result)
  }
}
</script>

<template>
  <div class="space-y-4">
    <p class="text-sm text-[var(--color-text-muted)]">
      Question {{ current + 1 }} / {{ state.questions.length }}
    </p>
    <h3 class="text-lg font-medium">{{ q().prompt }}</h3>
    <div class="space-y-2">
      <ChoiceButton
        v-for="(choice, idx) in q().choices"
        :key="idx"
        :selected="picked === idx"
        :correct="
          showExplanation ? (idx === q().answerIdx ? true : picked === idx ? false : null) : null
        "
        :disabled="done || showExplanation"
        @click="pick(idx)"
      >
        {{ choice }}
      </ChoiceButton>
    </div>
    <p v-if="showExplanation && q().explanation" class="text-sm text-[var(--color-text-muted)]">
      {{ q().explanation }}
    </p>
    <AppButton v-if="showExplanation && !done" @click="next">
      {{ current < state.questions.length - 1 ? 'Next' : 'Finish' }}
    </AppButton>
    <FeedbackBanner v-if="feedback" :variant="feedback.variant" :message="feedback.message" />
  </div>
</template>
