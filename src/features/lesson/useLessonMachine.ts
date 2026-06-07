import { computed, ref } from 'vue'
import type { Mishnah, LangCode } from '@content/schema'
import type { ActivityResult } from '@core/contracts/activity'
import { activityRegistry } from '@features/activities/registry'

export type LessonStage = 'read' | 'practice' | 'recall' | 'complete'

export function useLessonMachine(mishnah: () => Mishnah | null, _lang: () => LangCode) {
  const stage = ref<LessonStage>('read')
  const practiceIndex = ref(0)
  const results = ref<ActivityResult[]>([])

  const practiceActivities = computed(() => {
    const m = mishnah()
    if (!m) return []
    return activityRegistry.all().filter((a) => a.kind !== 'quiz' && a.isApplicable(m))
  })

  const quizActivity = computed(() => activityRegistry.get('quiz'))

  const currentPractice = computed(() => practiceActivities.value[practiceIndex.value])

  function advanceFromRead() {
    stage.value = practiceActivities.value.length > 0 ? 'practice' : 'recall'
    practiceIndex.value = 0
  }

  function onActivityComplete(result: ActivityResult) {
    results.value.push(result)
    if (stage.value === 'practice') {
      if (practiceIndex.value < practiceActivities.value.length - 1) {
        practiceIndex.value++
      } else {
        stage.value = 'recall'
      }
    } else if (stage.value === 'recall') {
      stage.value = 'complete'
    }
  }

  function rng() {
    return Math.random()
  }

  return {
    stage,
    practiceIndex,
    results,
    practiceActivities,
    quizActivity,
    currentPractice,
    advanceFromRead,
    onActivityComplete,
    rng,
  }
}
