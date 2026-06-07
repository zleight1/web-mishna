<script setup lang="ts">
import type { LangCode } from '@content/schema'
import { useAppLanguage } from '@app/useAppLanguage'

const { lang } = useAppLanguage()
const options: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'he', label: 'עב' },
]
</script>

<template>
  <div class="lang-toggle" role="group" aria-label="Language">
    <svg class="lang-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
      <path
        d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9M12 3c-2.5 3-4 6-4 9s1.5 6 4 9"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
    <button
      v-for="opt in options"
      :key="opt.code"
      type="button"
      class="lang-toggle-btn"
      :class="{ 'lang-toggle-btn--active': lang === opt.code }"
      :aria-pressed="lang === opt.code"
      @click="lang = opt.code"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-sm);
}

.lang-toggle-icon {
  width: 1rem;
  height: 1rem;
  margin-inline: 0.15rem 0.05rem;
  color: var(--color-text-muted);
}

.lang-toggle-btn {
  min-height: 2rem;
  min-width: 2.35rem;
  border: none;
  border-radius: 999px;
  padding: 0 0.55rem;
  font-size: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  background: transparent;
  color: var(--color-text-muted);
  transition:
    background 0.15s,
    color 0.15s;
}

.lang-toggle-btn--active {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 6px rgb(30 77 107 / 0.2);
}
</style>
