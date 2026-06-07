<script setup lang="ts">
defineProps<{
  selected?: boolean
  disabled?: boolean
  rtl?: boolean
}>()
</script>

<template>
  <button
    type="button"
    :disabled="disabled"
    :dir="rtl ? 'rtl' : undefined"
    class="min-h-11 min-w-11 rounded-full border px-3 py-2 text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    :class="{
      'border-[var(--color-primary)] bg-[var(--color-primary)] text-white': selected,
      'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]': !selected,
    }"
  >
    <slot />
  </button>
</template>
