<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { LangCode } from '@content/schema'
import { useAppLanguage } from '@app/useAppLanguage'

const props = withDefaults(defineProps<{ showGlobe?: boolean }>(), { showGlobe: true })
const { t } = useI18n()
const { lang } = useAppLanguage()

const options: { code: LangCode; label: string; scriptClass?: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'he', label: 'עב', scriptClass: 'lang-toggle-hebrew' },
]

const activeIndex = computed(() => options.findIndex((o) => o.code === lang.value))
</script>

<template>
  <div class="lang-toggle" role="group" :aria-label="t('app.language')">
    <span v-if="props.showGlobe" class="lang-toggle-globe" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
        <path
          d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9M12 3c-2.5 3-4 6-4 9s1.5 6 4 9"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
        />
      </svg>
    </span>

    <div class="lang-toggle-track">
      <span
        class="lang-toggle-thumb"
        :style="{ transform: `translateX(${activeIndex * 100}%)` }"
        aria-hidden="true"
      />
      <button
        v-for="opt in options"
        :key="opt.code"
        type="button"
        class="lang-toggle-option"
        :class="[opt.scriptClass, { 'lang-toggle-option--active': lang === opt.code }]"
        :aria-pressed="lang === opt.code"
        :aria-label="opt.code === 'en' ? t('app.english') : t('app.hebrew')"
        @click="lang = opt.code"
      >
        {{ opt.label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.lang-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.28rem 0.45rem 0.28rem 0.35rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-primary) 16%, var(--color-border));
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-sm);
}

.lang-toggle-globe {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  color: var(--color-accent);
  flex-shrink: 0;
}

.lang-toggle-globe svg {
  width: 1.1rem;
  height: 1.1rem;
}

.lang-toggle-track {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  min-width: 5.5rem;
  padding: 0.15rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 6%, var(--color-border));
  direction: ltr;
}

.lang-toggle-thumb {
  position: absolute;
  top: 0.15rem;
  left: 0.15rem;
  width: calc(50% - 0.15rem);
  height: calc(100% - 0.3rem);
  border-radius: 999px;
  background: linear-gradient(180deg, var(--color-primary), var(--color-primary-hover));
  box-shadow: 0 2px 8px rgb(30 77 107 / 0.28);
  transition: transform 0.22s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
}

.lang-toggle-option {
  position: relative;
  z-index: 1;
  min-height: 1.85rem;
  border: none;
  border-radius: 999px;
  padding: 0 0.45rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  background: transparent;
  color: var(--color-text);
  transition: color 0.15s;
}

.lang-toggle-option--active {
  color: white;
}

.lang-toggle-hebrew {
  font-family: var(--font-hebrew);
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0;
}
</style>
