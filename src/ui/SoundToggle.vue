<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const props = defineProps<{ muted: boolean; iconOnly?: boolean }>()
const emit = defineEmits<{ toggle: [] }>()
const { t } = useI18n()
</script>

<template>
  <button
    type="button"
    class="sound-toggle"
    :class="{ 'sound-toggle--muted': props.muted, 'sound-toggle--icon-only': props.iconOnly }"
    :aria-pressed="!muted"
    :title="muted ? t('app.soundOff') : t('app.soundOn')"
    @click="emit('toggle')"
  >
    <svg v-if="!muted" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path
        d="M15.5 8.5a5 5 0 0 1 0 7M18 6a8.5 8.5 0 0 1 0 12"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
    <svg v-else viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M11 5 6 9H3v6h3l5 4V5Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
      <path
        d="m16 9 5 6M21 9l-5 6"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
    <span v-if="!iconOnly" class="sound-toggle-label">{{
      muted ? t('app.soundMuted') : t('app.soundOn')
    }}</span>
  </button>
</template>

<style scoped>
.sound-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.38rem 0.6rem;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
  background: var(--color-accent-soft);
  color: var(--color-primary);
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s,
    background 0.15s;
}

.sound-toggle:hover {
  transform: scale(1.03);
}

.sound-toggle:active {
  transform: scale(0.97);
}

.sound-toggle--muted {
  background: var(--color-surface-elevated);
  border-color: var(--color-border);
  color: var(--color-text-muted);
}

.sound-toggle svg {
  width: 1rem;
  height: 1rem;
}

.sound-toggle-label {
  line-height: 1;
}

.sound-toggle--icon-only {
  width: 2.35rem;
  height: 2.35rem;
  padding: 0;
}

@media (max-width: 420px) {
  .sound-toggle-label {
    display: none;
  }
}
</style>
