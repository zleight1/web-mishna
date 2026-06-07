<script setup lang="ts">
defineProps<{
  kind: 'seder' | 'tractate'
  id: string
}>()
</script>

<template>
  <span class="catalog-icon" :class="`catalog-icon--${kind}`" aria-hidden="true">
    <!-- Zeraim — wheat sheaf (no cross shapes) -->
    <svg v-if="kind === 'seder' && id === 'zeraim'" viewBox="0 0 24 24" fill="none">
      <path d="M8 20V11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path d="M12 20V9" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path d="M16 20V11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path
        d="M8 11c0-2.5 0-4.5-1-6M12 9c0-3.5 0-5.5-1.5-7M16 11c0-2.5 0-4.5 1-6"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
      <ellipse cx="8" cy="8" rx="1.2" ry="2.2" fill="currentColor" opacity="0.35" />
      <ellipse cx="12" cy="6" rx="1.4" ry="2.6" fill="currentColor" opacity="0.45" />
      <ellipse cx="16" cy="8" rx="1.2" ry="2.2" fill="currentColor" opacity="0.35" />
    </svg>
    <!-- Moed — calendar -->
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
    <!-- Nashim — rings -->
    <svg v-else-if="kind === 'seder' && id === 'nashim'" viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="14" r="4" stroke="currentColor" stroke-width="1.6" />
      <circle cx="15" cy="14" r="4" stroke="currentColor" stroke-width="1.6" />
      <path d="M12 6v2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path d="M10 4h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <!-- Nezikin — scales -->
    <svg v-else-if="kind === 'seder' && id === 'nezikin'" viewBox="0 0 24 24" fill="none">
      <path d="M12 4v16" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path d="M6 8h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path
        d="M6 8 4 14h4L6 8ZM18 8l-2 6h4l-2-6Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
    <!-- Kodshim — altar -->
    <svg v-else-if="kind === 'seder' && id === 'kodshim'" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 18h12M8 18V10l4-4 4 4v8"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path d="M10 14h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      <path d="M5 18h14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <!-- Tahorot — water -->
    <svg v-else-if="kind === 'seder' && id === 'tahorot'" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 4c-4 6-7 8-7 12a7 7 0 1 0 14 0c0-4-3-6-7-12Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path
        d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
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
    <!-- Berakhot — bookmark -->
    <svg v-else-if="kind === 'tractate' && id === 'berakhot'" viewBox="0 0 24 24" fill="none">
      <path
        d="M6 4h12a2 2 0 0 1 2 2v13a1 1 0 0 1-1.45.89L12 17.3l-6.55 2.59A1 1 0 0 1 4 19V6a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path d="M8 8h8M8 11h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
    </svg>
    <!-- Sukkah — booth -->
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
  border-radius: 0.75rem;
  flex-shrink: 0;
  box-shadow: var(--shadow-sm);
}

.catalog-icon--seder {
  width: 2.75rem;
  height: 2.75rem;
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--color-accent) 18%, white),
    color-mix(in srgb, var(--color-primary) 10%, white)
  );
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-accent) 30%, var(--color-border));
}

.catalog-icon--tractate {
  width: 2.35rem;
  height: 2.35rem;
  background: color-mix(in srgb, var(--color-primary) 10%, white);
  color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--color-primary) 15%, var(--color-border));
}

.catalog-icon svg {
  width: 1.35rem;
  height: 1.35rem;
}

.catalog-icon--tractate svg {
  width: 1.2rem;
  height: 1.2rem;
}
</style>
