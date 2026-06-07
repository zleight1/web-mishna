<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import type { CatalogChapter } from '@core/contracts/content-loader'
import { useAppLanguage } from '@app/useAppLanguage'
import { AppCard } from '@ui/index'
import { useProgressStore } from '@features/progress/store'
import CatalogIcon from './CatalogIcon.vue'

const props = defineProps<{ chapter: CatalogChapter }>()
const { t } = useI18n()
const { lang } = useAppLanguage()
const progress = useProgressStore()

const nodes = computed(() =>
  props.chapter.mishnayot.map((m) => ({
    ...m,
    done: progress.getMishnahProgress(m.id)?.completed ?? false,
    to: `/learn/${props.chapter.order}/${props.chapter.tractate}/${props.chapter.chapter}/${m.number}`,
    displayRef: lang.value === 'he' ? m.heRef : m.ref,
  })),
)

const chapterTitle = computed(() => props.chapter.title[lang.value] ?? props.chapter.title.en ?? '')
const doneCount = computed(() => nodes.value.filter((n) => n.done).length)
const totalCount = computed(() => nodes.value.length)
</script>

<template>
  <AppCard padding="sm" class="chapter-card">
    <div class="chapter-header">
      <CatalogIcon :id="chapter.tractate" kind="tractate" />
      <div class="chapter-header-text">
        <h3 class="chapter-title">{{ chapterTitle }}</h3>
        <p class="chapter-meta">
          {{
            t('catalog.mishnayotProgress', {
              done: doneCount,
              total: totalCount,
            })
          }}
        </p>
      </div>
    </div>

    <ul class="mishnah-grid">
      <li v-for="n in nodes" :key="n.id">
        <RouterLink :to="n.to" class="mishnah-link" :class="{ 'mishnah-link--done': n.done }">
          <span class="mishnah-num">{{ n.number }}</span>
          <span class="mishnah-body">
            <span class="mishnah-label">{{ t('app.mishnah', { n: n.number }) }}</span>
            <span class="mishnah-ref">{{ n.displayRef }}</span>
          </span>
          <span
            class="mishnah-status"
            :class="n.done ? 'mishnah-status--done' : 'mishnah-status--todo'"
          >
            <svg v-if="n.done" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clip-rule="evenodd"
              />
            </svg>
            <svg v-else viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4.75a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 .22.53l2.5 2.25a.75.75 0 1 0 1-1.12l-2.28-2.05V6.75Z"
              />
            </svg>
            <span>{{ n.done ? t('app.done') : t('app.start') }}</span>
          </span>
        </RouterLink>
      </li>
    </ul>
  </AppCard>
</template>

<style scoped>
.chapter-card {
  overflow: hidden;
}

.chapter-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.chapter-header-text {
  min-width: 0;
}

.chapter-title {
  font-size: 1rem;
  font-weight: 600;
  line-height: 1.25;
  margin: 0;
}

.chapter-meta {
  margin: 0.15rem 0 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.mishnah-grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.5rem;
}

@media (min-width: 520px) {
  .mishnah-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.mishnah-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.65rem;
  border-radius: 0.65rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.15s;
}

.mishnah-link:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgb(30 77 107 / 0.08);
}

.mishnah-link--done {
  background: color-mix(in srgb, var(--color-success) 6%, white);
  border-color: color-mix(in srgb, var(--color-success) 25%, var(--color-border));
}

.mishnah-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: color-mix(in srgb, var(--color-primary) 12%, white);
  color: var(--color-primary);
  flex-shrink: 0;
}

.mishnah-body {
  display: flex;
  flex-direction: column;
  min-width: 0;
  flex: 1;
}

.mishnah-label {
  font-size: 0.8rem;
  font-weight: 600;
}

.mishnah-ref {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mishnah-status {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.62rem;
  font-weight: 600;
  flex-shrink: 0;
}

.mishnah-status svg {
  width: 1rem;
  height: 1rem;
}

.mishnah-status--done {
  color: var(--color-success);
}

.mishnah-status--todo {
  color: var(--color-text-muted);
}
</style>
