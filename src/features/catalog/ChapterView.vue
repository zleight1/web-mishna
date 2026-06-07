<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useServices } from '@app/providers'
import { useAppLanguage } from '@app/useAppLanguage'
import { useProgressStore } from '@features/progress/store'
import { sederDisplayName } from '@content/catalogLabels'
import { buildLessonBreadcrumbs } from '@content/catalogNav'
import { CatalogBreadcrumb, LangToggle } from '@ui/index'
import ChapterMap from './ChapterMap.vue'

const props = defineProps<{
  order: string
  tractate: string
  chapter: string
}>()

const { t } = useI18n()
const { lang } = useAppLanguage()
const progress = useProgressStore()
const chapterEntry = ref<
  | Awaited<ReturnType<ReturnType<typeof useServices>['content']['getCatalog']>>['chapters'][number]
  | null
>(null)

onMounted(async () => {
  await progress.load()
  const catalog = await useServices().content.getCatalog()
  chapterEntry.value =
    catalog.chapters.find(
      (ch) =>
        ch.order === props.order &&
        ch.tractate === props.tractate &&
        ch.chapter === Number(props.chapter),
    ) ?? null
})

const chapterTitle = computed(
  () => chapterEntry.value?.title[lang.value] ?? chapterEntry.value?.title.en ?? '',
)

const sederName = computed(() => sederDisplayName(props.order, t, 'short'))

const breadcrumbs = computed(() =>
  chapterEntry.value
    ? buildLessonBreadcrumbs({
        homeLabel: t('app.title'),
        order: props.order,
        tractate: props.tractate,
        chapter: props.chapter,
        sederName: sederName.value,
        chapterTitle: chapterTitle.value,
      })
    : [],
)
</script>

<template>
  <div v-if="chapterEntry" class="chapter-view">
    <div class="chapter-view-header">
      <CatalogBreadcrumb :items="breadcrumbs" :nav-label="t('catalog.breadcrumb')" />
      <LangToggle />
    </div>
    <ChapterMap :chapter="chapterEntry" />
  </div>
  <p v-else class="text-[var(--color-text-muted)]">{{ t('app.loadingLesson') }}</p>
</template>

<style scoped>
.chapter-view {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chapter-view-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}
</style>
