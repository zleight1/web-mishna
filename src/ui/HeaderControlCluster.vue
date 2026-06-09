<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import LangToggle from './LangToggle.vue'
import SoundToggle from './SoundToggle.vue'

defineProps<{ muted: boolean }>()
const emit = defineEmits<{ toggleSound: [] }>()

const { t } = useI18n()
const open = ref(false)
const root = ref<HTMLElement | null>(null)

function close() {
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onDocumentClick(event: MouseEvent) {
  if (!open.value || !root.value) return
  if (!root.value.contains(event.target as Node)) close()
}

function onDocumentKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
  document.addEventListener('keydown', onDocumentKeydown)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
  document.removeEventListener('keydown', onDocumentKeydown)
})
</script>

<template>
  <div ref="root" class="header-controls">
    <div class="header-controls-inline" aria-hidden="false">
      <SoundToggle :muted="muted" icon-only @toggle="emit('toggleSound')" />
      <LangToggle />
      <RouterLink to="/credits" class="header-credits-link header-credits-link--compact">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
          <path
            d="M12 10v6M12 7h.01"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
          />
        </svg>
        <span>{{ t('app.credits') }}</span>
      </RouterLink>
    </div>

    <div class="header-controls-cluster">
      <button
        type="button"
        class="cluster-orb"
        :class="{ 'cluster-orb--open': open }"
        :aria-expanded="open"
        aria-haspopup="dialog"
        :aria-label="open ? t('app.closeControls') : t('app.openControls')"
        @click.stop="toggle"
      >
        <span class="cluster-orb-glyph" aria-hidden="true">
          <span class="cluster-orb-dot cluster-orb-dot--a" />
          <span class="cluster-orb-dot cluster-orb-dot--b" />
          <span class="cluster-orb-dot cluster-orb-dot--c" />
        </span>
      </button>

      <Transition name="cluster-panel">
        <div
          v-if="open"
          class="cluster-panel"
          role="dialog"
          :aria-label="t('app.headerControls')"
          @click.stop
        >
          <div class="cluster-row">
            <span class="cluster-row-label">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M11 5 6 9H3v6h3l5 4V5Z"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linejoin="round"
                />
                <path
                  d="M15.5 8.5a5 5 0 0 1 0 7"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              {{ t('app.sound') }}
            </span>
            <SoundToggle :muted="muted" icon-only @toggle="emit('toggleSound')" />
          </div>

          <div class="cluster-row cluster-row--lang">
            <span class="cluster-row-label">
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
                <path
                  d="M3 12h18M12 3c2.5 3 4 6 4 9s-1.5 6-4 9M12 3c-2.5 3-4 6-4 9s1.5 6 4 9"
                  stroke="currentColor"
                  stroke-width="1.6"
                  stroke-linecap="round"
                />
              </svg>
              {{ t('app.language') }}
            </span>
            <LangToggle :show-globe="false" />
          </div>

          <div class="cluster-divider" role="separator" />

          <RouterLink to="/credits" class="cluster-credits" @click="close">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" />
              <path
                d="M12 10v6M12 7h.01"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
              />
            </svg>
            <span>{{ t('app.credits') }}</span>
            <svg class="cluster-credits-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="m9 6 6 6-6 6"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </RouterLink>
        </div>
      </Transition>
    </div>

    <Transition name="cluster-scrim">
      <button
        v-if="open"
        type="button"
        class="cluster-scrim"
        :aria-label="t('app.closeControls')"
        tabindex="-1"
        @click="close"
      />
    </Transition>
  </div>
</template>

<style scoped>
.header-controls {
  position: relative;
  flex-shrink: 0;
}

.header-controls-inline {
  display: none;
  align-items: center;
  gap: 0.45rem;
}

.header-controls-cluster {
  position: relative;
}

.cluster-orb {
  display: grid;
  place-items: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid color-mix(in srgb, var(--color-primary) 20%, var(--color-border));
  border-radius: 999px;
  background: linear-gradient(
    165deg,
    color-mix(in srgb, var(--color-surface-elevated) 92%, var(--color-accent-soft)),
    var(--color-surface-elevated)
  );
  box-shadow:
    0 2px 10px rgb(30 77 107 / 0.1),
    inset 0 1px 0 rgb(255 255 255 / 0.65);
  cursor: pointer;
  transition:
    transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1),
    box-shadow 0.2s,
    border-color 0.2s;
}

.cluster-orb:hover {
  transform: scale(1.04);
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
}

.cluster-orb--open {
  transform: scale(1.02);
  border-color: color-mix(in srgb, var(--color-accent) 45%, var(--color-border));
  box-shadow:
    0 4px 16px rgb(201 162 39 / 0.22),
    inset 0 1px 0 rgb(255 255 255 / 0.7);
}

.cluster-orb-glyph {
  position: relative;
  width: 1.1rem;
  height: 1.1rem;
}

.cluster-orb-dot {
  position: absolute;
  width: 0.38rem;
  height: 0.38rem;
  border-radius: 999px;
  background: var(--color-primary);
  transition:
    transform 0.28s cubic-bezier(0.34, 1.45, 0.64, 1),
    opacity 0.2s;
}

.cluster-orb-dot--a {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.cluster-orb-dot--b {
  left: 0;
  bottom: 0;
}

.cluster-orb-dot--c {
  right: 0;
  bottom: 0;
}

.cluster-orb--open .cluster-orb-dot--a {
  transform: translate(-50%, 0.36rem) scale(0.85);
  opacity: 0.75;
}

.cluster-orb--open .cluster-orb-dot--b {
  transform: translate(0.36rem, -0.12rem) scale(0.9);
}

.cluster-orb--open .cluster-orb-dot--c {
  transform: translate(-0.36rem, -0.12rem) scale(0.9);
}

.cluster-panel {
  position: absolute;
  top: calc(100% + 0.55rem);
  inset-inline-end: 0;
  z-index: 30;
  width: min(17.5rem, calc(100vw - 2rem));
  padding: 0.65rem;
  border-radius: 1.15rem;
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, white);
  background: color-mix(in srgb, var(--color-surface-elevated) 90%, transparent);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow-lg);
}

.cluster-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.65rem;
  padding: 0.35rem 0.25rem;
}

.cluster-row--lang {
  align-items: center;
}

.cluster-row-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.cluster-row-label svg {
  width: 1rem;
  height: 1rem;
  color: var(--color-primary);
}

.cluster-divider {
  height: 1px;
  margin: 0.35rem 0.15rem;
  background: color-mix(in srgb, var(--color-border) 80%, transparent);
}

.cluster-credits {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.45rem;
  border-radius: 0.75rem;
  text-decoration: none;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-primary);
  transition: background 0.15s;
}

.cluster-credits:hover {
  background: var(--color-primary-soft);
}

.cluster-credits svg {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
}

.cluster-credits-chevron {
  margin-inline-start: auto;
  opacity: 0.55;
}

.cluster-scrim {
  position: fixed;
  inset: 0;
  z-index: 19;
  border: none;
  background: rgb(26 26 26 / 0.12);
  cursor: default;
}

.header-credits-link {
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

.header-credits-link:hover {
  background: var(--color-primary-soft);
  border-color: color-mix(in srgb, var(--color-primary) 35%, var(--color-border));
}

.header-credits-link svg {
  width: 1rem;
  height: 1rem;
}

.header-credits-link--compact span {
  max-width: 7.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cluster-panel-enter-active,
.cluster-panel-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.26s cubic-bezier(0.34, 1.4, 0.64, 1);
}

.cluster-panel-enter-from,
.cluster-panel-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.94);
}

.cluster-scrim-enter-active,
.cluster-scrim-leave-active {
  transition: opacity 0.2s ease;
}

.cluster-scrim-enter-from,
.cluster-scrim-leave-to {
  opacity: 0;
}

@media (min-width: 720px) {
  .header-controls-inline {
    display: flex;
  }

  .header-controls-cluster {
    display: none;
  }
}

@media (max-width: 719px) {
  .header-credits-link--compact span {
    display: none;
  }
}
</style>
