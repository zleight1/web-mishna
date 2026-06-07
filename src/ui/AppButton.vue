<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  type?: 'button' | 'submit'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    class="inline-flex min-h-11 items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:opacity-50"
    :class="{
      'bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]':
        (variant ?? 'primary') === 'primary',
      'border border-[var(--color-border)] bg-white hover:bg-gray-50': variant === 'secondary',
      'bg-transparent hover:bg-black/5': variant === 'ghost',
    }"
  >
    <slot />
  </button>
</template>
