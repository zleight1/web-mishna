<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  variant: 'success' | 'error' | 'info'
  message: string
}>()

const emoji = computed(() => {
  if (props.variant === 'success') return '🎉'
  if (props.variant === 'error') return '💪'
  return '✨'
})
</script>

<template>
  <div
    role="status"
    class="feedback-banner"
    :class="{
      'feedback-banner--success': variant === 'success',
      'feedback-banner--error': variant === 'error',
      'feedback-banner--info': variant === 'info',
    }"
  >
    <span class="feedback-banner-emoji" aria-hidden="true">{{ emoji }}</span>
    <span class="feedback-banner-text">{{ message }}</span>
  </div>
</template>

<style scoped>
.feedback-banner {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  border-radius: 0.85rem;
  padding: 0.85rem 1rem;
  font-size: 0.95rem;
  font-weight: 700;
  animation: feedback-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: var(--shadow-md);
}

.feedback-banner--success {
  background: linear-gradient(135deg, #d8f3dc, #b7e4c7);
  color: var(--color-success);
  border: 2px solid color-mix(in srgb, var(--color-success) 35%, white);
}

.feedback-banner--error {
  background: linear-gradient(135deg, #ffe5e5, #ffd6d6);
  color: var(--color-error);
  border: 2px solid color-mix(in srgb, var(--color-error) 30%, white);
}

.feedback-banner--info {
  background: linear-gradient(135deg, #e8f0f5, #dbeafe);
  color: var(--color-primary);
  border: 2px solid color-mix(in srgb, var(--color-primary) 25%, white);
}

.feedback-banner-emoji {
  font-size: 1.5rem;
  line-height: 1;
  animation: choice-pop 0.5s ease-out;
}

.feedback-banner-text {
  line-height: 1.3;
}
</style>
