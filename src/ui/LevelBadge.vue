<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { levelFromXp } from '@features/progress/level'

const props = defineProps<{
  xp: number
  compact?: boolean
}>()

const { t } = useI18n()
const info = computed(() => levelFromXp(props.xp))
</script>

<template>
  <div class="level-badge" :class="{ 'level-badge--compact': compact }">
    <div class="level-badge-ring" :style="{ '--progress': `${info.progress * 100}%` }">
      <span class="level-badge-num">{{ info.level }}</span>
    </div>
    <div v-if="!compact" class="level-badge-meta">
      <span class="level-badge-label">{{ t('app.level') }}</span>
      <span class="level-badge-xp"
        >{{ info.xpIntoLevel }} / {{ info.xpToNext }} {{ t('app.xp') }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.level-badge {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.level-badge--compact {
  gap: 0;
}

.level-badge-ring {
  --progress: 0%;
  display: grid;
  place-items: center;
  width: 2.65rem;
  height: 2.65rem;
  border-radius: 999px;
  background: conic-gradient(
    var(--color-accent) var(--progress),
    color-mix(in srgb, var(--color-border) 55%, white) 0
  );
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent) 18%, transparent);
}

.level-badge--compact .level-badge-ring {
  width: 2.1rem;
  height: 2.1rem;
}

.level-badge-num {
  display: grid;
  place-items: center;
  width: calc(100% - 6px);
  height: calc(100% - 6px);
  border-radius: 999px;
  background: var(--color-surface-elevated);
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-primary);
  font-family: var(--font-display);
}

.level-badge--compact .level-badge-num {
  font-size: 0.82rem;
}

.level-badge-meta {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.level-badge-label {
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.level-badge-xp {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
