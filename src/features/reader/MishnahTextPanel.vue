<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { LangCode, Mishnah } from '@content/schema'
import { mishnahFullHebrew, mishnahFullTranslation } from '@content/utils/mishnahText'

defineProps<{
  mishnah: Mishnah
  lang: LangCode
  compact?: boolean
}>()

const { t } = useI18n()
</script>

<template>
  <section
    class="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted,#f8fafc)] p-3"
    :class="compact ? 'text-sm' : ''"
  >
    <p class="mb-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
      {{ t('app.fullMishnah') }}
    </p>
    <p dir="rtl" lang="he" class="leading-relaxed">{{ mishnahFullHebrew(mishnah) }}</p>
    <p
      v-if="mishnahFullTranslation(mishnah, lang)"
      class="mt-2 border-t border-[var(--color-border)] pt-2 text-[var(--color-text-muted)]"
      :dir="lang === 'he' ? 'rtl' : 'ltr'"
    >
      {{ mishnahFullTranslation(mishnah, lang) }}
    </p>
  </section>
</template>
