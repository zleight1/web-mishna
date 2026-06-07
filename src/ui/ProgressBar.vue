<script setup lang="ts">
defineProps<{ value: number; max?: number; label?: string }>()
</script>

<template>
  <div class="w-full">
    <div v-if="label" class="mb-1 text-xs text-[var(--color-text-muted)]">{{ label }}</div>
    <div class="h-2 overflow-hidden rounded-full bg-gray-200">
      <div
        class="h-full rounded-full bg-[var(--color-accent)] transition-all"
        :style="{ width: `${Math.min(100, (value / (max ?? 100)) * 100)}%` }"
      />
    </div>
  </div>
</template>
