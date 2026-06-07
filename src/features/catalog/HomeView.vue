<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { Catalog } from '@core/contracts/content-loader'
import { groupCatalogBySeder, groupChaptersByTractate } from '@content/catalogOrder'
import { sederDisplayName, tractateDisplayName } from '@content/catalogLabels'
import { chapterPath } from '@content/catalogNav'
import { useServices } from '@app/providers'
import { useProgressStore } from '@features/progress/store'
import { AppLogo, CatalogDisclosure, LevelBadge } from '@ui/index'
import { useAppLanguage } from '@app/useAppLanguage'
import ChapterMap from './ChapterMap.vue'
import CatalogIcon from './CatalogIcon.vue'
import { useCatalogExpansion } from './useCatalogExpansion'

const { t } = useI18n()
const route = useRoute()
const { lang } = useAppLanguage()
const catalog = ref<Catalog | null>(null)
const progress = useProgressStore()
const { isOpen, handleExpanded } = useCatalogExpansion()

function scrollToSederHash() {
  const hash = route.hash
  if (!hash.startsWith('#seder-')) return
  /* eslint-disable no-undef -- browser scroll helper in client-only view */
  requestAnimationFrame(() => {
    document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
  /* eslint-enable no-undef */
}

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

const progressPct = computed(() =>
  totalMishnayot.value > 0
    ? Math.round((completedMishnayot.value / totalMishnayot.value) * 100)
    : 0,
)

onMounted(async () => {
  await progress.load()
  catalog.value = await useServices().content.getCatalog()
  scrollToSederHash()
})

watch(() => route.hash, scrollToSederHash)

function sederLabel(order: string) {
  return sederDisplayName(order, t, 'full')
}

function tractateGroups(order: string, chapters: Catalog['chapters']) {
  return groupChaptersByTractate(chapters.filter((ch) => ch.order === order))
}

function tractateProgress(chapters: Catalog['chapters'][number][]) {
  const mishnayot = chapters.flatMap((ch) => ch.mishnayot)
  const done = mishnayot.filter((m) => progress.getMishnahProgress(m.id)?.completed).length
  return { done, total: mishnayot.length }
}

function chapterTitle(ch: Catalog['chapters'][number]) {
  return ch.title[lang.value] ?? ch.title.en ?? ''
}

function chapterProgress(ch: Catalog['chapters'][number]) {
  const total = ch.mishnayot.length
  const done = ch.mishnayot.filter((m) => progress.getMishnahProgress(m.id)?.completed).length
  return { done, total }
}
</script>

<template>
  <div class="home">
    <header class="home-hero">
      <div class="home-hero-glow" aria-hidden="true" />
      <div class="home-hero-content">
        <div class="home-hero-copy">
          <AppLogo size="lg" :show-title="false" />
          <p class="home-welcome">{{ t('catalog.kicker') }}</p>
          <p class="home-subtitle">{{ t('catalog.subtitle') }}</p>
        </div>

        <div v-if="progress.state" class="home-stats">
          <div class="stat-card stat-card--level">
            <LevelBadge :xp="progress.state.xp" />
          </div>
          <div class="stat-card">
            <span class="stat-icon stat-icon--xp" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3l2.4 5.8L21 10l-4.5 4.2L17.5 21 12 17.8 6.5 21l1-6.8L3 10l6.6-1.2L12 3Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="stat-body">
              <span class="stat-label">{{ t('app.xp') }}</span>
              <span class="stat-value">{{ progress.state.xp }}</span>
            </span>
          </div>
          <div class="stat-card">
            <span class="stat-icon stat-icon--streak" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3c2 4 6 5 6 9a6 6 0 1 1-12 0c0-4 4-5 6-9Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
            <span class="stat-body">
              <span class="stat-label">{{ t('app.streak') }}</span>
              <span class="stat-value">{{ progress.state.streak }}</span>
            </span>
          </div>
          <div v-if="totalMishnayot > 0" class="stat-card stat-card--wide">
            <span class="stat-icon stat-icon--progress" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M12 7v5l3 2"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
            </span>
            <span class="stat-body">
              <span class="stat-label">{{ t('catalog.progress') }}</span>
              <span class="stat-value">{{ completedMishnayot }}/{{ totalMishnayot }}</span>
              <span
                class="stat-bar"
                role="progressbar"
                :aria-valuenow="progressPct"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="stat-bar-fill" :style="{ width: `${progressPct}%` }" />
              </span>
            </span>
          </div>
        </div>
      </div>
      <img src="/logo.png" alt="" class="home-hero-art" width="160" height="160" />
    </header>

    <div class="catalog-tree">
      <section
        v-for="group in sederGroups"
        :id="`seder-${group.order}`"
        :key="group.order"
        class="seder-section"
      >
        <CatalogDisclosure
          level="seder"
          :expanded="isOpen('seder', group.order)"
          @update:expanded="(open) => handleExpanded(open, 'seder', group.order)"
        >
          <template #header>
            <CatalogIcon :id="group.order" kind="seder" />
            <div class="seder-heading-text">
              <h2 class="seder-title">{{ sederLabel(group.order) }}</h2>
            </div>
          </template>
          <template #meta>
            {{
              t('catalog.tractatesInSeder', {
                n: tractateGroups(group.order, group.chapters).length,
              })
            }}
          </template>

          <CatalogDisclosure
            v-for="tractate in tractateGroups(group.order, group.chapters)"
            :key="`${group.order}-${tractate.tractate}`"
            level="tractate"
            :expanded="isOpen('tractate', group.order, tractate.tractate)"
            @update:expanded="
              (open) => handleExpanded(open, 'tractate', group.order, tractate.tractate)
            "
          >
            <template #header>
              <CatalogIcon :id="tractate.tractate" kind="tractate" />
              <span class="tractate-title">{{ tractateDisplayName(tractate.tractate, t) }}</span>
            </template>
            <template #meta>
              {{
                t('catalog.chaptersInTractate', {
                  n: tractate.chapters.length,
                })
              }}
              ·
              {{
                t('catalog.mishnayotProgress', {
                  done: tractateProgress(tractate.chapters).done,
                  total: tractateProgress(tractate.chapters).total,
                })
              }}
            </template>

            <CatalogDisclosure
              v-for="ch in tractate.chapters"
              :key="`${ch.order}-${ch.tractate}-${ch.chapter}`"
              level="chapter"
              :expanded="isOpen('chapter', ch.order, ch.tractate, String(ch.chapter))"
              @update:expanded="
                (open) => handleExpanded(open, 'chapter', ch.order, ch.tractate, String(ch.chapter))
              "
            >
              <template #header>
                <span class="chapter-heading">
                  <span class="chapter-heading-title">{{ chapterTitle(ch) }}</span>
                  <RouterLink
                    :to="chapterPath(ch.order, ch.tractate, ch.chapter)"
                    class="chapter-open-link"
                    @click.stop
                  >
                    {{ t('catalog.openChapter') }}
                  </RouterLink>
                </span>
              </template>
              <template #meta>
                {{
                  t('catalog.mishnayotProgress', {
                    done: chapterProgress(ch).done,
                    total: chapterProgress(ch).total,
                  })
                }}
              </template>

              <ChapterMap :chapter="ch" embedded />
            </CatalogDisclosure>
          </CatalogDisclosure>
        </CatalogDisclosure>
      </section>
    </div>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.home-hero {
  position: relative;
  overflow: hidden;
  padding: 1.35rem 1.25rem;
  border-radius: var(--radius-card);
  border: 1px solid color-mix(in srgb, var(--color-primary) 12%, var(--color-border));
  background: linear-gradient(
    135deg,
    var(--color-surface-elevated) 0%,
    color-mix(in srgb, var(--color-primary-soft) 55%, white) 100%
  );
  box-shadow: var(--shadow-md);
}

.home-hero-glow {
  position: absolute;
  inset: -30% 40% auto -20%;
  height: 80%;
  background: radial-gradient(circle, rgb(201 162 39 / 0.14), transparent 70%);
  pointer-events: none;
}

.home-hero-content {
  position: relative;
  z-index: 1;
  max-width: calc(100% - 5rem);
}

.home-hero-art {
  position: absolute;
  right: -0.5rem;
  bottom: -0.75rem;
  width: 7.5rem;
  height: 7.5rem;
  object-fit: contain;
  opacity: 0.92;
  filter: drop-shadow(0 8px 16px rgb(30 77 107 / 0.12));
  pointer-events: none;
}

.home-welcome {
  margin: 0.65rem 0 0;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: var(--color-accent);
}

.home-subtitle {
  margin: 0.35rem 0 0;
  font-size: 0.92rem;
  line-height: 1.45;
  color: var(--color-text-muted);
  max-width: 28rem;
}

.home-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1.15rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0.8rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  min-width: 5.5rem;
}

.stat-card--wide {
  flex: 1 1 12rem;
  min-width: 10rem;
}

.stat-card--level {
  min-width: 8.5rem;
}

.stat-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.55rem;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.stat-icon--xp {
  background: var(--color-accent-soft);
  color: var(--color-accent);
}

.stat-icon--streak {
  background: color-mix(in srgb, #e85d04 12%, white);
  color: #c2410c;
}

.stat-icon--progress {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
  flex: 1;
}

.stat-label {
  font-size: 0.62rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-primary);
  font-family: var(--font-display);
}

.stat-bar {
  display: block;
  height: 0.28rem;
  margin-top: 0.2rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-border));
  overflow: hidden;
}

.stat-bar-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width 0.3s ease;
}

.catalog-tree {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.seder-section {
  scroll-margin-top: 4.5rem;
}

.seder-heading-text {
  min-width: 0;
}

.seder-title {
  margin: 0;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-primary);
  line-height: 1.25;
}

.tractate-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-primary);
}

.chapter-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 0.35rem 0.65rem;
  min-width: 0;
}

.chapter-heading-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-text);
}

.chapter-open-link {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
}

.chapter-open-link:hover {
  text-decoration: underline;
}

@media (min-width: 560px) {
  .home-hero-art {
    width: 9rem;
    height: 9rem;
    right: 0.5rem;
    bottom: 0;
  }

  .home-hero-content {
    max-width: calc(100% - 8rem);
  }
}
</style>
