<script setup lang="ts">
defineProps<{ padding?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div
    class="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] shadow-sm"
    :class="{
      'p-3': padding === 'sm',
      'p-4': !padding || padding === 'md',
      'p-6': padding === 'lg',
    }"
  >
    <slot />
  </div>
</template>
