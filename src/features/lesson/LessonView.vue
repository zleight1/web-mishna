<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useServices } from '@app/providers'
import { useAppLanguage } from '@app/useAppLanguage'
import { useProgressStore } from '@features/progress/store'
import { xpFromResult } from '@features/progress/xp'
import BilingualReader from '@features/reader/BilingualReader.vue'
import MishnahTextPanel from '@features/reader/MishnahTextPanel.vue'
import { visualAidRegistry } from '@features/visual/registry'
import { sederDisplayName } from '@content/catalogLabels'
import { buildLessonBreadcrumbs } from '@content/catalogNav'
import { AppButton, AppCard, CatalogBreadcrumb, LessonStepper } from '@ui/index'
import { useLessonMachine } from './useLessonMachine'

const props = defineProps<{
  order: string
  tractate: string
  chapter: string
  mishnah: string
}>()

const { t } = useI18n()
const { lang } = useAppLanguage()
const chapterData = ref<Awaited<
  ReturnType<ReturnType<typeof useServices>['content']['loadChapter']>
> | null>(null)
const progress = useProgressStore()
const lessonXpEarned = ref(0)
const progressSaved = ref(false)

const mishnahNum = computed(() => Number(props.mishnah))
const currentMishnah = computed(
  () => chapterData.value?.mishnayot.find((m) => m.number === mishnahNum.value) ?? null,
)

const machine = useLessonMachine(
  () => currentMishnah.value,
  () => lang.value,
)

const visualRenderer = computed(() => {
  const aid = currentMishnah.value?.visualAid
  if (!aid) return null
  return visualAidRegistry.get(aid.kind)
})

const chapterTitle = computed(
  () => chapterData.value?.title[lang.value] ?? chapterData.value?.title.en ?? '',
)

const sederName = computed(() => sederDisplayName(props.order, t, 'short'))

const breadcrumbs = computed(() => {
  if (!currentMishnah.value || !chapterData.value) return []
  return buildLessonBreadcrumbs({
    homeLabel: t('app.title'),
    order: props.order,
    tractate: props.tractate,
    chapter: props.chapter,
    mishnah: props.mishnah,
    sederName: sederName.value,
    chapterTitle: chapterTitle.value,
    mishnahLabel: lang.value === 'he' ? currentMishnah.value.heRef : currentMishnah.value.ref,
  })
})

onMounted(async () => {
  await progress.load()
  chapterData.value = await useServices().content.loadChapter(
    props.order,
    props.tractate,
    Number(props.chapter),
  )
})

async function saveLessonProgress() {
  if (progressSaved.value || !currentMishnah.value) return
  const avg =
    machine.results.value.reduce((s, r) => s + r.score, 0) /
    Math.max(1, machine.results.value.length)
  const result = { correct: avg >= 0.8, score: avg, attempts: 1 }
  lessonXpEarned.value = xpFromResult(result)
  await progress.recordResult(currentMishnah.value.id, result)
  progressSaved.value = true
}

watch(
  () => machine.stage.value,
  (stage) => {
    if (stage === 'complete') void saveLessonProgress()
  },
)
</script>

<template>
  <div v-if="currentMishnah" class="lesson-shell">
    <CatalogBreadcrumb :items="breadcrumbs" :nav-label="t('catalog.breadcrumb')" />

    <h2 class="lesson-title">
      {{ lang === 'he' ? currentMishnah.heRef : currentMishnah.ref }}
    </h2>

    <LessonStepper :stage="machine.stage.value" />

    <AppCard v-if="machine.stage.value === 'read'" accent>
      <BilingualReader :mishnah="currentMishnah" :lang="lang" />
      <component
        :is="visualRenderer?.component"
        v-if="visualRenderer && currentMishnah.visualAid"
        class="mt-4"
        :aid="currentMishnah.visualAid"
        :lang="lang"
      />
      <AppButton class="mt-4" @click="machine.advanceFromRead()">
        {{ lang === 'he' ? `← ${t('app.practice')}` : `${t('app.practice')} →` }}
      </AppButton>
    </AppCard>

    <AppCard v-else-if="machine.stage.value === 'practice' && machine.currentPractice.value">
      <MishnahTextPanel class="mb-4" :mishnah="currentMishnah" :lang="lang" compact />
      <h3 class="mb-3 font-medium">
        {{ machine.currentPractice.value.label[lang] ?? machine.currentPractice.value.label.en }}
      </h3>
      <component
        :is="machine.currentPractice.value.component"
        :state="
          machine.currentPractice.value.generate({
            mishnah: currentMishnah,
            lang,
            rng: machine.rng,
          })
        "
        :lang="lang"
        @complete="machine.onActivityComplete"
      />
    </AppCard>

    <AppCard v-else-if="machine.stage.value === 'recall' && machine.quizActivity.value">
      <MishnahTextPanel class="mb-4" :mishnah="currentMishnah" :lang="lang" compact />
      <h3 class="mb-3 font-medium">{{ t('app.recall') }}</h3>
      <component
        :is="machine.quizActivity.value.component"
        :state="
          machine.quizActivity.value.generate({ mishnah: currentMishnah, lang, rng: machine.rng })
        "
        :lang="lang"
        @complete="machine.onActivityComplete"
      />
    </AppCard>

    <AppCard v-else-if="machine.stage.value === 'complete'" accent>
      <div class="lesson-complete-badge" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.6" />
          <path
            d="m8 12 2.5 2.5L16 9"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <p class="lesson-complete-title">{{ t('app.complete') }}</p>
      <p v-if="progressSaved" class="mt-2 text-sm text-[var(--color-text-muted)]">
        {{ t('app.progressSaved') }}
      </p>
      <p class="mt-2 text-sm">
        <span v-if="lessonXpEarned > 0">
          {{ t('app.lessonXpEarned', { n: lessonXpEarned }) }} ·
        </span>
        {{ t('app.xp') }}: {{ progress.state?.xp }} · {{ t('app.streak') }}:
        {{ progress.state?.streak }}
      </p>
      <div class="mt-4 flex flex-wrap gap-3">
        <RouterLink
          :to="`/learn/${order}/${tractate}/${chapter}`"
          class="text-sm font-semibold text-[var(--color-primary)] hover:underline"
        >
          {{ t('catalog.backToChapter') }}
        </RouterLink>
      </div>
    </AppCard>
  </div>
  <p v-else class="text-[var(--color-text-muted)]">{{ t('app.loadingLesson') }}</p>
</template>

<style scoped>
.lesson-shell {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.lesson-title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-primary);
}

.lesson-complete-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  margin-bottom: 0.5rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-success) 12%, white);
  color: var(--color-success);
}

.lesson-complete-badge svg {
  width: 1.5rem;
  height: 1.5rem;
}

.lesson-complete-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-success);
  margin: 0;
  font-family: var(--font-display);
}
</style>
