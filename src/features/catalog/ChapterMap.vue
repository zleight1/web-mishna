<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import type { CatalogChapter } from '@core/contracts/content-loader'
import { useAppLanguage } from '@app/useAppLanguage'
import { AppCard } from '@ui/index'
import { useProgressStore } from '@features/progress/store'

const props = defineProps<{ chapter: CatalogChapter }>()
const { t } = useI18n()
const { lang } = useAppLanguage()
const progress = useProgressStore()

const nodes = computed(() =>
  props.chapter.mishnayot.map((m) => ({
    ...m,
    done: progress.getMishnahProgress(m.id)?.completed ?? false,
    to: `/learn/${props.chapter.order}/${props.chapter.tractate}/${props.chapter.chapter}/${m.number}`,
    displayRef: lang.value === 'he' ? m.heRef : m.ref,
  })),
)

const chapterTitle = computed(() => props.chapter.title[lang.value] ?? props.chapter.title.en ?? '')
</script>

<template>
  <div class="space-y-3">
    <h2 class="text-lg font-semibold">{{ chapterTitle }}</h2>
    <RouterLink v-for="n in nodes" :key="n.id" :to="n.to" class="block">
      <AppCard class="transition hover:border-[var(--color-primary)]">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">{{ t('app.mishnah', { n: n.number }) }}</p>
            <p class="text-sm text-[var(--color-text-muted)]">{{ n.displayRef }}</p>
          </div>
          <span
            class="rounded-full px-2 py-1 text-xs"
            :class="n.done ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'"
          >
            {{ n.done ? t('app.done') : t('app.start') }}
          </span>
        </div>
      </AppCard>
    </RouterLink>
  </div>
</template>
