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
    class="min-h-11 w-full rounded-lg border px-4 py-3 text-start text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
    :class="{
      'border-[var(--color-primary)] bg-blue-50': selected && correct === null,
      'border-[var(--color-success)] bg-green-50': correct === true,
      'border-[var(--color-error)] bg-red-50': correct === false,
      'border-[var(--color-border)] bg-white hover:border-[var(--color-primary)]':
        !selected && correct === null,
    }"
  >
    <slot />
  </button>
</template>
