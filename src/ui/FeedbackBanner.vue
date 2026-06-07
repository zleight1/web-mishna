<script setup lang="ts">
defineProps<{
  variant: 'success' | 'error' | 'info'
  message: string
}>()
</script>

<template>
  <div
    role="status"
    class="rounded-lg px-4 py-3 text-sm"
    :class="{
      'bg-green-50 text-[var(--color-success)]': variant === 'success',
      'bg-red-50 text-[var(--color-error)]': variant === 'error',
      'bg-blue-50 text-[var(--color-primary)]': variant === 'info',
    }"
  >
    {{ message }}
  </div>
</template>
