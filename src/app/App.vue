<script setup lang="ts">
import { provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { createCelebration, celebrationKey } from '@features/feedback/useCelebration'
import { AppLogo, CelebrationLayer, LangToggle, SoundToggle } from '@ui/index'

const { t } = useI18n()
const celebration = createCelebration()
provide(celebrationKey, celebration)
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--shake': celebration.shaking.value }">
    <header class="app-header">
      <div class="app-header-inner">
        <RouterLink to="/" class="app-brand">
          <AppLogo size="sm" heading-tag="h1" />
        </RouterLink>
        <div class="app-header-center">
          <SoundToggle :muted="celebration.muted.value" @toggle="celebration.toggleMuted()" />
          <LangToggle />
        </div>
        <nav class="app-nav" aria-label="Site">
          <RouterLink to="/credits" class="app-nav-link">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
              <path
                d="M12 10v6M12 7h.01"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            {{ t('app.credits') }}
          </RouterLink>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <CelebrationLayer :burst="celebration.burst.value" />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
  background: color-mix(in srgb, var(--color-surface-elevated) 88%, transparent);
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-sm);
}

.app-header-inner {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.75rem;
  max-width: 48rem;
  margin: 0 auto;
  padding: 0.65rem 1rem;
}

.app-header-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
}

.app-shell--shake {
  animation: app-shake 0.42s ease-in-out;
}

.app-nav {
  display: flex;
  justify-content: flex-end;
}

.app-brand {
  text-decoration: none;
  color: inherit;
  border-radius: 0.5rem;
  transition: opacity 0.15s;
}

.app-brand:hover {
  opacity: 0.85;
}

.app-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.65rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
  background: var(--color-surface-elevated);
  transition:
    background 0.15s,
    border-color 0.15s;
}

.app-nav-link:hover {
  background: var(--color-primary-soft);
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
}

.app-nav-link svg {
  width: 1rem;
  height: 1rem;
}

.app-main {
  flex: 1;
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
}
</style>
