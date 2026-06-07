<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { LangCode, Mishnah } from '@content/schema'
import { AppCard } from '@ui/index'
import { usePhraseReveal } from './usePhraseReveal'

defineProps<{ mishnah: Mishnah; lang: LangCode }>()
const { t } = useI18n()
const { showTranslit, toggle, isRevealed } = usePhraseReveal()
</script>

<template>
  <div class="space-y-4">
    <label class="flex items-center gap-2 text-sm">
      <input v-model="showTranslit" type="checkbox" class="h-4 w-4" />
      {{ t('app.showTranslit') }}
    </label>
    <AppCard
      v-for="(phrase, i) in mishnah.phrases"
      :key="i"
      class="cursor-pointer"
      @click="toggle(i)"
    >
      <p dir="rtl" lang="he" class="text-xl leading-relaxed">{{ phrase.he }}</p>
      <p
        v-if="showTranslit && phrase.translit"
        class="mt-1 text-sm italic text-[var(--color-text-muted)]"
        dir="ltr"
      >
        {{ phrase.translit }}
      </p>
      <p
        v-if="isRevealed(i)"
        class="mt-2 border-t border-[var(--color-border)] pt-2 text-sm text-[var(--color-primary)]"
        :dir="lang === 'he' ? 'rtl' : 'ltr'"
      >
        {{ phrase.translations[lang] ?? phrase.translations.en }}
      </p>
      <p v-else class="mt-2 text-xs text-[var(--color-text-muted)]">{{ t('app.tapToReveal') }}</p>
    </AppCard>
  </div>
</template>
