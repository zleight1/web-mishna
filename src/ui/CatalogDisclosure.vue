<script setup lang="ts">
const props = defineProps<{
  expanded: boolean
  level?: 'seder' | 'tractate' | 'chapter'
}>()

const emit = defineEmits<{
  'update:expanded': [value: boolean]
}>()

function toggle() {
  emit('update:expanded', !props.expanded)
}
</script>

<template>
  <section class="catalog-disclosure" :class="level ? `catalog-disclosure--${level}` : undefined">
    <button
      type="button"
      class="catalog-disclosure-trigger"
      :aria-expanded="expanded"
      @click="toggle"
    >
      <span class="catalog-disclosure-chevron" :class="{ 'is-open': expanded }" aria-hidden="true">
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
            clip-rule="evenodd"
          />
        </svg>
      </span>
      <span class="catalog-disclosure-heading">
        <slot name="header" />
      </span>
      <span v-if="$slots.meta" class="catalog-disclosure-meta">
        <slot name="meta" />
      </span>
    </button>
    <div v-show="expanded" class="catalog-disclosure-panel">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.catalog-disclosure {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.catalog-disclosure-trigger {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  width: 100%;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 0.8rem;
  background: var(--color-surface-elevated);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  text-align: start;
  transition:
    border-color 0.15s,
    background 0.15s;
}

.catalog-disclosure-trigger:hover {
  border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary-soft) 40%, white);
}

.catalog-disclosure--seder .catalog-disclosure-trigger {
  padding: 0.75rem 0.85rem;
  border-color: color-mix(in srgb, var(--color-accent) 22%, var(--color-border));
}

.catalog-disclosure--tractate .catalog-disclosure-trigger {
  margin-inline-start: 0.35rem;
}

.catalog-disclosure--chapter .catalog-disclosure-trigger {
  margin-inline-start: 0.7rem;
  padding: 0.55rem 0.7rem;
  border-radius: 0.7rem;
}

.catalog-disclosure-chevron {
  display: inline-flex;
  flex-shrink: 0;
  color: var(--color-primary);
  transition: transform 0.2s ease;
}

.catalog-disclosure-chevron svg {
  width: 1.1rem;
  height: 1.1rem;
}

.catalog-disclosure-chevron.is-open {
  transform: rotate(90deg);
}

.catalog-disclosure-heading {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex: 1;
  min-width: 0;
}

.catalog-disclosure-meta {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.catalog-disclosure-panel {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.catalog-disclosure--seder .catalog-disclosure-panel {
  padding-inline-start: 0.15rem;
}

.catalog-disclosure--tractate .catalog-disclosure-panel {
  padding-inline-start: 0.5rem;
}
</style>
