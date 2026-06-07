<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent'
  disabled?: boolean
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    class="app-button"
    :class="`app-button--${variant ?? 'primary'}`"
  >
    <slot />
  </button>
</template>

<style scoped>
.app-button {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  border-radius: 0.7rem;
  padding: 0.55rem 1.1rem;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition:
    transform 0.12s,
    box-shadow 0.15s,
    background 0.15s,
    opacity 0.15s;
}

.app-button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.app-button:active:not(:disabled) {
  transform: translateY(0);
}

.app-button:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.app-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.app-button--primary {
  background: linear-gradient(180deg, var(--color-primary), var(--color-primary-hover));
  color: white;
  box-shadow: 0 3px 10px rgb(30 77 107 / 0.22);
}

.app-button--primary:hover:not(:disabled) {
  box-shadow: 0 5px 14px rgb(30 77 107 / 0.28);
}

.app-button--accent {
  background: linear-gradient(
    180deg,
    var(--color-accent),
    color-mix(in srgb, var(--color-accent) 80%, #8a6914)
  );
  color: #1a1a1a;
  box-shadow: 0 3px 10px rgb(201 162 39 / 0.25);
}

.app-button--secondary {
  background: var(--color-surface-elevated);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, var(--color-border));
}

.app-button--secondary:hover:not(:disabled) {
  background: var(--color-primary-soft);
}

.app-button--ghost {
  background: transparent;
  color: var(--color-primary);
}

.app-button--ghost:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-primary) 6%, transparent);
}
</style>
