<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import type { CatalogChapter } from '@core/contracts/content-loader'
import { useAppLanguage } from '@app/useAppLanguage'
import { AppCard } from '@ui/index'
import { useProgressStore } from '@features/progress/store'
import CatalogIcon from './CatalogIcon.vue'

const props = defineProps<{ chapter: CatalogChapter; embedded?: boolean }>()
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
const chapterPct = computed(() =>
  totalCount.value > 0 ? Math.round((doneCount.value / totalCount.value) * 100) : 0,
)
</script>

<template>
  <ul v-if="embedded" class="mishnah-grid mishnah-grid--embedded">
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
              d="M7.5 5.5a4 4 0 0 1 7.17-2.3.75.75 0 0 1-1.3.75 2.5 2.5 0 1 0-3.57 3.14.75.75 0 0 1-1.02 1.1A4 4 0 0 1 7.5 5.5ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1.25 4.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 .22.53l2.5 2.25a.75.75 0 1 0 1-1.12l-2.28-2.05V6.75Z"
            />
          </svg>
          <span>{{ n.done ? t('app.done') : t('app.start') }}</span>
        </span>
      </RouterLink>
    </li>
  </ul>

  <AppCard v-else padding="sm" accent class="chapter-card">
    <div class="chapter-accent" aria-hidden="true" />
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
        <div
          class="chapter-progress"
          role="progressbar"
          :aria-valuenow="chapterPct"
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <span class="chapter-progress-fill" :style="{ width: `${chapterPct}%` }" />
        </div>
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
                d="M7.5 5.5a4 4 0 0 1 7.17-2.3.75.75 0 0 1-1.3.75 2.5 2.5 0 1 0-3.57 3.14.75.75 0 0 1-1.02 1.1A4 4 0 0 1 7.5 5.5ZM10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm1.25 4.25a.75.75 0 0 0-1.5 0v3.5a.75.75 0 0 0 .22.53l2.5 2.25a.75.75 0 1 0 1-1.12l-2.28-2.05V6.75Z"
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
  position: relative;
  overflow: hidden;
}

.chapter-accent {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, var(--color-accent), var(--color-primary));
}

.chapter-header {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  margin-bottom: 0.9rem;
  padding-bottom: 0.8rem;
  padding-left: 0.35rem;
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 80%, transparent);
}

.chapter-header-text {
  min-width: 0;
  flex: 1;
}

.chapter-title {
  font-size: 1.05rem;
  font-weight: 700;
  line-height: 1.25;
  margin: 0;
  color: var(--color-primary);
}

.chapter-meta {
  margin: 0.2rem 0 0;
  font-size: 0.74rem;
  color: var(--color-text-muted);
}

.chapter-progress {
  height: 0.3rem;
  margin-top: 0.45rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-border));
  overflow: hidden;
}

.chapter-progress-fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(
    90deg,
    var(--color-success),
    color-mix(in srgb, var(--color-success) 70%, var(--color-accent))
  );
}

.mishnah-grid--embedded {
  padding-inline-start: 0.85rem;
}

.mishnah-grid {
  list-style: none;
  margin: 0;
  padding-inline-start: 0.35rem;
  display: grid;
  gap: 0.55rem;
}

@media (min-width: 520px) {
  .mishnah-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.mishnah-link {
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem 0.7rem;
  border-radius: 0.75rem;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.15s,
    box-shadow 0.15s,
    transform 0.12s,
    background 0.15s;
}

.mishnah-link:hover {
  border-color: color-mix(in srgb, var(--color-primary) 40%, var(--color-border));
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
  background: var(--color-surface-elevated);
}

.mishnah-link--done {
  background: color-mix(in srgb, var(--color-success) 7%, white);
  border-color: color-mix(in srgb, var(--color-success) 28%, var(--color-border));
}

.mishnah-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.85rem;
  height: 1.85rem;
  border-radius: 0.55rem;
  font-size: 0.78rem;
  font-weight: 800;
  font-family: var(--font-display);
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--color-primary) 14%, white),
    color-mix(in srgb, var(--color-accent) 12%, white)
  );
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
  font-weight: 700;
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
  justify-content: center;
  gap: 0.2rem;
  font-size: 0.62rem;
  font-weight: 700;
  justify-self: end;
  white-space: nowrap;
  padding: 0.2rem 0.35rem;
  border-radius: 999px;
}

.mishnah-status svg {
  width: 1rem;
  height: 1rem;
}

.mishnah-status--done {
  color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 10%, white);
}

.mishnah-status--todo {
  color: var(--color-text-muted);
  background: color-mix(in srgb, var(--color-border) 40%, white);
}
</style>
