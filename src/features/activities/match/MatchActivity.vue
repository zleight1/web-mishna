<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { AppButton, FeedbackBanner } from '@ui/index'
import { validateMatch, type MatchState } from './logic'

const props = defineProps<{ state: MatchState; lang: LangCode }>()
const emit = defineEmits<{ complete: [ActivityResult] }>()
const { t } = useI18n()

const activeHe = ref<string | null>(null)
const links = ref<Record<string, string>>({})
const done = ref(false)
const feedback = ref<{ variant: 'success' | 'error'; message: string } | null>(null)

function pickHe(id: string) {
  if (done.value) return
  activeHe.value = id
}

function pickEn(en: string) {
  if (done.value || !activeHe.value) return
  links.value[activeHe.value] = en
  activeHe.value = null
}

function submit() {
  const result = validateMatch(props.state, { links: links.value })
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
  <div class="grid gap-4 md:grid-cols-2">
    <div class="space-y-2">
      <p class="text-xs font-medium text-[var(--color-text-muted)]">{{ t('app.hebrew') }}</p>
      <button
        v-for="pair in state.pairs"
        :key="pair.id"
        type="button"
        class="block min-h-11 w-full rounded-lg border px-3 py-2 text-end text-sm"
        :class="{
          'border-[var(--color-primary)] bg-blue-50': activeHe === pair.id,
          'border-[var(--color-border)]': activeHe !== pair.id,
        }"
        dir="rtl"
        lang="he"
        @click="pickHe(pair.id)"
      >
        {{ pair.he }}
        <span v-if="links[pair.id]" class="block text-xs text-[var(--color-success)]">✓</span>
      </button>
    </div>
    <div class="space-y-2">
      <p class="text-xs font-medium text-[var(--color-text-muted)]">{{ t('app.english') }}</p>
      <button
        v-for="en in state.shuffledEn"
        :key="en"
        type="button"
        class="block min-h-11 w-full rounded-lg border border-[var(--color-border)] px-3 py-2 text-start text-sm hover:border-[var(--color-primary)]"
        @click="pickEn(en)"
      >
        {{ en }}
      </button>
    </div>
    <div class="md:col-span-2">
      <AppButton :disabled="done" @click="submit">{{ t('app.checkMatches') }}</AppButton>
      <FeedbackBanner
        v-if="feedback"
        class="mt-3"
        :variant="feedback.variant"
        :message="feedback.message"
      />
    </div>
  </div>
</template>
