<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  stage: 'read' | 'practice' | 'recall' | 'complete'
}>()

const { t } = useI18n()

const steps = computed(
  () =>
    [
      { id: 'read', label: t('app.read'), icon: 'book' },
      { id: 'practice', label: t('app.practice'), icon: 'puzzle' },
      { id: 'recall', label: t('app.recall'), icon: 'brain' },
    ] as const,
)

const activeIndex = computed(() => {
  if (props.stage === 'complete') return 3
  return steps.value.findIndex((s) => s.id === props.stage)
})
</script>

<template>
  <ol class="lesson-stepper" aria-label="Lesson progress">
    <li
      v-for="(step, index) in steps"
      :key="step.id"
      class="lesson-step"
      :class="{
        'lesson-step--active': index === activeIndex,
        'lesson-step--done': index < activeIndex,
      }"
    >
      <span class="lesson-step-icon" aria-hidden="true">
        <svg v-if="step.icon === 'book'" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 4h9a2 2 0 0 1 2 2v14l-3-1.5L11 20 6 18.5V4Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
          <path d="M11 6h7v12" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
        </svg>
        <svg v-else-if="step.icon === 'puzzle'" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 4h3a2 2 0 0 1 2 2v1h3v3h1a2 2 0 0 1 2 2v3h-3v3H9v-1H6a2 2 0 0 1-2-2v-3h3V9H8V4Z"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none">
          <path
            d="M9.5 4A4.5 4.5 0 0 0 5 8.5V11a3 3 0 0 0 3 3v5l4-2 4 2v-5a3 3 0 0 0 3-3V8.5A4.5 4.5 0 0 0 14.5 4"
            stroke="currentColor"
            stroke-width="1.6"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="lesson-step-label">{{ step.label }}</span>
      <span v-if="index < steps.length - 1" class="lesson-step-connector" aria-hidden="true" />
    </li>
  </ol>
</template>

<style scoped>
.lesson-stepper {
  display: flex;
  align-items: center;
  gap: 0;
  list-style: none;
  margin: 0;
  padding: 0.55rem 0.75rem;
  border-radius: 999px;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.lesson-step {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0 0.35rem;
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 600;
}

.lesson-step--active {
  color: var(--color-primary);
}

.lesson-step--done {
  color: var(--color-success);
}

.lesson-step-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.65rem;
  height: 1.65rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-border) 55%, white);
}

.lesson-step--active .lesson-step-icon {
  background: color-mix(in srgb, var(--color-primary) 14%, white);
  color: var(--color-primary);
}

.lesson-step--done .lesson-step-icon {
  background: color-mix(in srgb, var(--color-success) 14%, white);
  color: var(--color-success);
}

.lesson-step-icon svg {
  width: 1rem;
  height: 1rem;
}

.lesson-step-label {
  display: none;
}

.lesson-step-connector {
  width: 1.25rem;
  height: 2px;
  margin-inline: 0.15rem;
  border-radius: 999px;
  background: var(--color-border);
}

.lesson-step--done .lesson-step-connector {
  background: color-mix(in srgb, var(--color-success) 45%, var(--color-border));
}

@media (min-width: 480px) {
  .lesson-step-label {
    display: inline;
  }

  .lesson-step-connector {
    width: 1.75rem;
  }
}
</style>
