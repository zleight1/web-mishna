<script setup lang="ts">
import type { LangCode } from '@content/schema'
import { useAppLanguage } from '@app/useAppLanguage'

const { lang } = useAppLanguage()
const options: LangCode[] = ['en', 'he']
</script>

<template>
  <div class="inline-flex rounded-lg border border-[var(--color-border)] p-1">
    <button
      v-for="opt in options"
      :key="opt"
      type="button"
      class="min-h-9 rounded-md px-3 text-sm capitalize"
      :class="{
        'bg-[var(--color-primary)] text-white': lang === opt,
        'text-[var(--color-text-muted)]': lang !== opt,
      }"
      @click="lang = opt"
    >
      {{ opt }}
    </button>
  </div>
</template>
