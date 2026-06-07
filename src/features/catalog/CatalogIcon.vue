<script setup lang="ts">
defineProps<{
  kind: 'seder' | 'tractate'
  id: string
}>()
</script>

<template>
  <span class="catalog-icon" aria-hidden="true">
    <!-- Zeraim -->
    <svg v-if="kind === 'seder' && id === 'zeraim'" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3c-3 4-7 5-7 10a7 7 0 1 0 14 0c0-5-4-6-7-10Z"
        stroke="currentColor"
        stroke-width="1.6"
      />
      <path d="M12 8v8M9 11h6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <!-- Moed -->
    <svg v-else-if="kind === 'seder' && id === 'moed'" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" stroke-width="1.6" />
      <path
        d="M8 3v4M16 3v4M4 10h16"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <circle cx="12" cy="15" r="2" fill="currentColor" />
    </svg>
    <!-- Default seder -->
    <svg v-else-if="kind === 'seder'" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 6h14v12H5zM8 4v4M16 4v4"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
    <!-- Berakhot -->
    <svg v-else-if="kind === 'tractate' && id === 'berakhot'" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 4h12a2 2 0 0 1 2 2v13a1 1 0 0 1-1.45.89L12 17.3l-6.55 2.59A1 1 0 0 1 4 19V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path d="M8 8h8M8 11h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <!-- Sukkah -->
    <svg v-else-if="kind === 'tractate' && id === 'sukkah'" viewBox="0 0 24 24" fill="none">
      <path d="M4 14h16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path
        d="M6 14V11l6-5 6 5v3"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path
        d="M3 14h18"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-dasharray="2 3"
      />
    </svg>
    <!-- Default tractate -->
    <svg v-else viewBox="0 0 24 24" fill="none">
      <path
        d="M7 5h10v14H7zM9 3h6v4H9z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path d="M9 10h6M9 13h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
  </span>
</template>

<style scoped>
.catalog-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.65rem;
  background: color-mix(in srgb, var(--color-primary) 10%, white);
  color: var(--color-primary);
  flex-shrink: 0;
}

.catalog-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
