<script setup lang="ts">
defineProps<{
  selected?: boolean
  correct?: boolean | null
  disabled?: boolean
}>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    class="choice-button"
    :class="{
      'choice-button--selected': selected && correct === null,
      'choice-button--correct': correct === true,
      'choice-button--wrong': correct === false,
      'choice-button--idle': !selected && correct === null,
    }"
  >
    <slot />
  </button>
</template>

<style scoped>
.choice-button {
  min-height: 2.75rem;
  width: 100%;
  border-radius: 0.8rem;
  border: 2px solid var(--color-border);
  padding: 0.75rem 1rem;
  text-align: start;
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    border-color 0.15s,
    background 0.15s,
    transform 0.15s;
}

.choice-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.choice-button--idle {
  background: white;
}

.choice-button--idle:hover {
  border-color: var(--color-primary);
  transform: translateY(-1px);
}

.choice-button--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.choice-button--correct {
  border-color: var(--color-success);
  background: linear-gradient(135deg, #d8f3dc, #b7e4c7);
  animation: choice-pop 0.45s ease-out;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-success) 20%, transparent);
}

.choice-button--wrong {
  border-color: var(--color-error);
  background: linear-gradient(135deg, #ffe5e5, #ffd6d6);
  animation: choice-shake 0.4s ease-in-out;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-error) 18%, transparent);
}
</style>
