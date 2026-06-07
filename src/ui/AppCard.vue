<script setup lang="ts">
defineProps<{ padding?: 'sm' | 'md' | 'lg'; accent?: boolean }>()
</script>

<template>
  <div
    class="app-card"
    :class="{
      'app-card--accent': accent,
      'app-card--sm': padding === 'sm',
      'app-card--md': !padding || padding === 'md',
      'app-card--lg': padding === 'lg',
    }"
  >
    <slot />
  </div>
</template>

<style scoped>
.app-card {
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-sm);
}

.app-card--accent {
  border-color: color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
  box-shadow: var(--shadow-md);
}

.app-card--sm {
  padding: 0.85rem;
}

.app-card--md {
  padding: 1.1rem;
}

.app-card--lg {
  padding: 1.5rem;
}
</style>
