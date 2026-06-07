<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Catalog } from '@core/contracts/content-loader'
import { groupCatalogBySeder } from '@content/catalogOrder'
import { useServices } from '@app/providers'
import { useProgressStore } from '@features/progress/store'
import { LangToggle } from '@ui/index'
import ChapterMap from './ChapterMap.vue'
import CatalogIcon from './CatalogIcon.vue'

const { t } = useI18n()
const catalog = ref<Catalog | null>(null)
const progress = useProgressStore()

const sederGroups = computed(() =>
  catalog.value ? groupCatalogBySeder(catalog.value.chapters) : [],
)

const totalMishnayot = computed(
  () => catalog.value?.chapters.reduce((sum, ch) => sum + ch.mishnayot.length, 0) ?? 0,
)

const completedMishnayot = computed(() => {
  if (!catalog.value || !progress.state) return 0
  return catalog.value.chapters
    .flatMap((ch) => ch.mishnayot)
    .filter((m) => progress.getMishnahProgress(m.id)?.completed).length
})

onMounted(async () => {
  await progress.load()
  catalog.value = await useServices().content.getCatalog()
})

function sederLabel(order: string) {
  const key = `catalog.seder.${order}`
  const translated = t(key)
  return translated === key ? order : translated
}
</script>

<template>
  <div class="home">
    <header class="home-hero">
      <div class="home-hero-top">
        <div>
          <p class="home-kicker">{{ t('catalog.kicker') }}</p>
          <h1 class="home-title">{{ t('app.title') }}</h1>
          <p class="home-subtitle">{{ t('catalog.subtitle') }}</p>
        </div>
        <LangToggle />
      </div>

      <div v-if="progress.state" class="home-stats">
        <div class="stat-pill">
          <span class="stat-label">{{ t('app.xp') }}</span>
          <span class="stat-value">{{ progress.state.xp }}</span>
        </div>
        <div class="stat-pill">
          <span class="stat-label">{{ t('app.streak') }}</span>
          <span class="stat-value">{{ progress.state.streak }}</span>
        </div>
        <div v-if="totalMishnayot > 0" class="stat-pill stat-pill--wide">
          <span class="stat-label">{{ t('catalog.progress') }}</span>
          <span class="stat-value">{{ completedMishnayot }}/{{ totalMishnayot }}</span>
        </div>
      </div>
    </header>

    <section v-for="group in sederGroups" :key="group.order" class="seder-section">
      <div class="seder-header">
        <CatalogIcon :id="group.order" kind="seder" />
        <div>
          <h2 class="seder-title">{{ sederLabel(group.order) }}</h2>
          <p class="seder-meta">
            {{ t('catalog.chaptersInSeder', { n: group.chapters.length }) }}
          </p>
        </div>
      </div>

      <div class="seder-chapters">
        <ChapterMap
          v-for="ch in group.chapters"
          :key="`${ch.order}-${ch.tractate}-${ch.chapter}`"
          :chapter="ch"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.home-hero {
  padding: 1.1rem 1.15rem;
  border-radius: 1rem;
  border: 1px solid var(--color-border);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 8%, white) 0%,
    var(--color-surface-elevated) 55%
  );
  box-shadow: 0 4px 18px rgb(30 77 107 / 0.06);
}

.home-hero-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.home-kicker {
  margin: 0 0 0.2rem;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-primary);
}

.home-title {
  margin: 0;
  font-size: 1.65rem;
  font-weight: 700;
  line-height: 1.15;
}

.home-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
  max-width: 34rem;
}

.home-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.stat-pill {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  padding: 0.45rem 0.7rem;
  border-radius: 0.65rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  min-width: 4.5rem;
}

.stat-pill--wide {
  min-width: 6.5rem;
}

.stat-label {
  font-size: 0.62rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.stat-value {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
}

.seder-section {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.seder-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.seder-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.seder-meta {
  margin: 0.1rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.seder-chapters {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}
</style>
