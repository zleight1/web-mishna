<script setup lang="ts">
import { useI18n } from 'vue-i18n'

withDefaults(
  defineProps<{
    showTitle?: boolean
    size?: 'sm' | 'md' | 'lg'
    headingTag?: 'h1' | 'p' | 'span'
  }>(),
  { showTitle: true, size: 'md', headingTag: 'span' },
)

const { t } = useI18n()
</script>

<template>
  <span class="app-logo" :class="`app-logo--${size ?? 'md'}`">
    <img src="/logo.svg" :alt="t('app.title')" class="app-logo-mark" width="40" height="40" />
    <span v-if="showTitle" class="app-logo-text">
      <component :is="headingTag" class="app-logo-title">{{ t('app.title') }}</component>
      <span v-if="size === 'lg'" class="app-logo-tagline">{{ t('catalog.kicker') }}</span>
    </span>
  </span>
</template>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  min-width: 0;
}

.app-logo-mark {
  flex-shrink: 0;
  border-radius: 0.55rem;
  box-shadow: 0 2px 10px rgb(30 77 107 / 0.12);
}

.app-logo--sm .app-logo-mark {
  width: 1.75rem;
  height: 1.75rem;
}

.app-logo--md .app-logo-mark {
  width: 2.25rem;
  height: 2.25rem;
}

.app-logo--lg .app-logo-mark {
  width: 3.25rem;
  height: 3.25rem;
  border-radius: 0.85rem;
}

.app-logo-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.app-logo-title {
  font-family: var(--font-display);
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-primary);
}

.app-logo--sm .app-logo-title {
  font-size: 1rem;
}

.app-logo--md .app-logo-title {
  font-size: 1.1rem;
}

.app-logo--lg .app-logo-title {
  font-size: 1.85rem;
}

.app-logo-tagline {
  margin-top: 0.15rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-accent);
}
</style>
