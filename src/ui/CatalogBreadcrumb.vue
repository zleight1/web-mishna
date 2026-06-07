<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { CatalogCrumb } from '@content/catalogNav'

defineProps<{
  items: CatalogCrumb[]
  navLabel: string
}>()
</script>

<template>
  <nav class="catalog-breadcrumb" :aria-label="navLabel">
    <ol class="catalog-breadcrumb-list">
      <li v-for="(item, index) in items" :key="item.id" class="catalog-breadcrumb-item">
        <RouterLink v-if="item.to" :to="item.to" class="catalog-breadcrumb-link">
          <svg v-if="item.id === 'home'" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
            />
          </svg>
          {{ item.label }}
        </RouterLink>
        <span v-else class="catalog-breadcrumb-current" aria-current="page">{{ item.label }}</span>
        <span v-if="index < items.length - 1" class="catalog-breadcrumb-sep" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
              clip-rule="evenodd"
            />
          </svg>
        </span>
      </li>
    </ol>
  </nav>
</template>

<style scoped>
.catalog-breadcrumb {
  margin: 0;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface-elevated) 90%, transparent);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.catalog-breadcrumb-list {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.1rem 0.2rem;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.76rem;
}

.catalog-breadcrumb-item {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  min-width: 0;
}

.catalog-breadcrumb-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  padding: 0.15rem 0.3rem;
  border-radius: 0.4rem;
  transition: background 0.15s;
}

.catalog-breadcrumb-link svg {
  width: 0.85rem;
  height: 0.85rem;
  flex-shrink: 0;
}

.catalog-breadcrumb-link:hover {
  background: var(--color-primary-soft);
}

.catalog-breadcrumb-current {
  color: var(--color-text-muted);
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 12rem;
  padding: 0.15rem 0.3rem;
}

.catalog-breadcrumb-sep {
  display: inline-flex;
  color: var(--color-text-muted);
  opacity: 0.55;
  user-select: none;
}

.catalog-breadcrumb-sep svg {
  width: 0.85rem;
  height: 0.85rem;
}
</style>
