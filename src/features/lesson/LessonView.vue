<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import { useServices } from '@app/providers'
import { useProgressStore } from '@features/progress/store'
import BilingualReader from '@features/reader/BilingualReader.vue'
import { visualAidRegistry } from '@features/visual/registry'
import { AppButton, AppCard, LangToggle } from '@ui/index'
import { useLessonMachine } from './useLessonMachine'

const props = defineProps<{
  order: string
  tractate: string
  chapter: string
  mishnah: string
}>()

const { t } = useI18n()
const lang = ref<LangCode>('en')
const chapterData = ref<Awaited<
  ReturnType<ReturnType<typeof useServices>['content']['loadChapter']>
> | null>(null)
const progress = useProgressStore()

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

onMounted(async () => {
  await progress.load()
  chapterData.value = await useServices().content.loadChapter(
    props.order,
    props.tractate,
    Number(props.chapter),
  )
})

async function finishLesson() {
  const avg =
    machine.results.value.reduce((s, r) => s + r.score, 0) /
    Math.max(1, machine.results.value.length)
  if (currentMishnah.value) {
    await progress.recordResult(currentMishnah.value.id, {
      correct: avg >= 0.8,
      score: avg,
      attempts: 1,
    })
  }
}
</script>

<template>
  <div v-if="currentMishnah" class="space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold">{{ currentMishnah.ref }}</h2>
      <LangToggle v-model="lang" />
    </div>

    <div class="flex gap-2 text-sm">
      <span :class="{ 'font-bold text-[var(--color-primary)]': machine.stage.value === 'read' }">{{
        t('app.read')
      }}</span>
      <span>→</span>
      <span
        :class="{ 'font-bold text-[var(--color-primary)]': machine.stage.value === 'practice' }"
        >{{ t('app.practice') }}</span
      >
      <span>→</span>
      <span
        :class="{ 'font-bold text-[var(--color-primary)]': machine.stage.value === 'recall' }"
        >{{ t('app.recall') }}</span
      >
    </div>

    <AppCard v-if="machine.stage.value === 'read'">
      <BilingualReader :mishnah="currentMishnah" :lang="lang" />
      <component
        :is="visualRenderer?.component"
        v-if="visualRenderer && currentMishnah.visualAid"
        class="mt-4"
        :aid="currentMishnah.visualAid"
        :lang="lang"
      />
      <AppButton class="mt-4" @click="machine.advanceFromRead()"
        >{{ t('app.practice') }} →</AppButton
      >
    </AppCard>

    <AppCard v-else-if="machine.stage.value === 'practice' && machine.currentPractice.value">
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

    <AppCard v-else-if="machine.stage.value === 'complete'">
      <p class="text-lg font-semibold text-[var(--color-success)]">{{ t('app.complete') }}</p>
      <p class="mt-2 text-sm">
        XP: {{ progress.state?.xp }} · Streak: {{ progress.state?.streak }}
      </p>
      <AppButton class="mt-4" @click="finishLesson">Save progress</AppButton>
      <RouterLink to="/" class="ml-3 text-sm text-[var(--color-primary)]">← Home</RouterLink>
    </AppCard>
  </div>
  <p v-else class="text-[var(--color-text-muted)]">Loading lesson…</p>
</template>
