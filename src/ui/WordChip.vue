<script setup lang="ts">
defineProps<{
  selected?: boolean
  disabled?: boolean
  rtl?: boolean
  correct?: boolean | null
}>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :dir="rtl ? 'rtl' : undefined"
    class="word-chip"
    :class="{
      'word-chip--selected': selected && correct === null,
      'word-chip--correct': correct === true,
      'word-chip--wrong': correct === false,
      'word-chip--idle': !selected && correct === null,
    }"
  >
    <slot />
  </button>
</template>

<style scoped>
.word-chip {
  min-height: 2.75rem;
  min-width: 2.75rem;
  border-radius: 999px;
  border: 2px solid var(--color-border);
  padding: 0.45rem 0.85rem;
  font-size: 0.9rem;
  font-weight: 600;
  transition:
    border-color 0.15s,
    background 0.15s,
    transform 0.15s;
}

.word-chip:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.word-chip--idle {
  background: white;
}

.word-chip--idle:hover {
  border-color: var(--color-primary);
  transform: scale(1.05);
}

.word-chip--selected {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.word-chip--correct {
  border-color: var(--color-success);
  background: linear-gradient(135deg, #2d6a4f, #40916c);
  color: white;
  animation: choice-pop 0.45s ease-out;
  box-shadow: 0 4px 14px rgb(45 106 79 / 0.35);
}

.word-chip--wrong {
  border-color: var(--color-error);
  background: linear-gradient(135deg, #9b2226, #bb3e03);
  color: white;
  animation: choice-shake 0.4s ease-in-out;
}
</style>
