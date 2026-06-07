<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Catalog } from '@core/contracts/content-loader'
import { useServices } from '@app/providers'
import { useProgressStore } from '@features/progress/store'
import { LangToggle } from '@ui/index'
import ChapterMap from './ChapterMap.vue'
import type { LangCode } from '@content/schema'

const { t } = useI18n()
const catalog = ref<Catalog | null>(null)
const lang = ref<LangCode>('en')
const progress = useProgressStore()

onMounted(async () => {
  await progress.load()
  catalog.value = await useServices().content.getCatalog()
})
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold">{{ t('app.title') }}</h2>
        <p class="text-[var(--color-text-muted)]">{{ t('app.subtitle') }}</p>
      </div>
      <LangToggle v-model="lang" />
    </div>
    <div v-if="progress.state" class="flex gap-4 text-sm">
      <span>{{ t('app.xp') }}: {{ progress.state.xp }}</span>
      <span>{{ t('app.streak') }}: {{ progress.state.streak }}</span>
    </div>
    <ChapterMap
      v-for="ch in catalog?.chapters ?? []"
      :key="`${ch.order}-${ch.tractate}-${ch.chapter}`"
      :chapter="ch"
    />
  </div>
</template>
