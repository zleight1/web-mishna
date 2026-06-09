<script setup lang="ts">
import { onMounted, provide } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { createCelebration, celebrationKey } from '@features/feedback/useCelebration'
import { useProgressStore } from '@features/progress/store'
import { AppLogo, CelebrationLayer, HeaderControlCluster, LevelBadge } from '@ui/index'

const progress = useProgressStore()
onMounted(() => {
  void progress.load()
})

const celebration = createCelebration()
provide(celebrationKey, celebration)
</script>

<template>
  <div class="app-shell" :class="{ 'app-shell--shake': celebration.shaking.value }">
    <header class="app-header">
      <div class="app-header-inner">
        <RouterLink to="/" class="app-brand">
          <AppLogo size="sm" heading-tag="h1" />
          <LevelBadge v-if="progress.state" :xp="progress.state.xp" compact />
        </RouterLink>
        <HeaderControlCluster
          :muted="celebration.muted.value"
          @toggle-sound="celebration.toggleMuted()"
        />
      </div>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <CelebrationLayer
      :burst="celebration.burst.value"
      :xp-pop="celebration.xpPop.value"
      :level-up="celebration.levelUp.value"
    />
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
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  max-width: 48rem;
  margin: 0 auto;
  padding: 0.65rem 1rem;
}

.app-shell--shake {
  animation: app-shake 0.42s ease-in-out;
}

.app-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  min-width: 0;
  flex: 1;
  text-decoration: none;
  color: inherit;
  border-radius: 0.5rem;
  transition: opacity 0.15s;
}

.app-brand:hover {
  opacity: 0.85;
}

.app-main {
  flex: 1;
  max-width: 48rem;
  width: 100%;
  margin: 0 auto;
  padding: 1.25rem 1rem 2rem;
}
</style>
