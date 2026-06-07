<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import type { LangCode, SukkahBuilder3dSpec } from '@content/schema'
import { useCelebration } from '@features/feedback/useCelebration'
import { minHeightAmot, validateSukkahBuild, type SukkahBuildState } from './sukkahRules'
import { mountSukkahScene } from './sukkahScene'

const props = defineProps<{ spec: SukkahBuilder3dSpec; lang: LangCode }>()

const { celebrate } = useCelebration()

const canvasRef = ref(null)
const wallCount = ref(3)
const heightAmot = ref(12)
const ready = ref(false)
const wasValid = ref(false)

let sceneApi: Awaited<ReturnType<typeof mountSukkahScene>> | null = null

const rules = computed(() => ({
  minHeightTefachim: props.spec.minHeightTefachim,
  maxHeightAmot: props.spec.maxHeightAmot,
  minWalls: props.spec.minWalls,
}))

const buildState = computed(
  (): SukkahBuildState => ({
    wallCount: wallCount.value,
    heightAmot: heightAmot.value,
  }),
)

const validation = computed(() => validateSukkahBuild(buildState.value, rules.value))

const minHeightLabel = computed(() => minHeightAmot(rules.value))

function t(record: Record<string, string>, fallback = '') {
  return record[props.lang] ?? record.en ?? fallback
}

const title = computed(() =>
  t(props.spec.title ?? {}, t({ en: 'Build a sukkah!', he: 'בונים סוכה!' })),
)

function syncScene() {
  sceneApi?.setState(buildState.value, validation.value.valid)
}

function setWalls(n: number) {
  wallCount.value = n
}

function setValidPreset() {
  wallCount.value = rules.value.minWalls
  heightAmot.value = Math.min(12, rules.value.maxHeightAmot)
}

onMounted(async () => {
  const canvas = canvasRef.value
  if (!canvas || typeof WebGLRenderingContext === 'undefined') return

  sceneApi = await mountSukkahScene(
    canvas,
    { wallCount: wallCount.value, heightAmot: heightAmot.value },
    { rules: rules.value },
  )
  ready.value = true
  syncScene()
})

onUnmounted(() => {
  sceneApi?.dispose()
  sceneApi = null
})

watch([wallCount, heightAmot], () => {
  syncScene()
  if (validation.value.valid && !wasValid.value) {
    celebrate('perfect')
  }
  wasValid.value = validation.value.valid
})
</script>

<template>
  <figure class="sukkah-builder" :dir="lang === 'he' ? 'rtl' : 'ltr'">
    <figcaption class="sukkah-builder-title">
      <span class="sukkah-builder-badge" aria-hidden="true">🏗️</span>
      {{ title }}
    </figcaption>

    <div class="sukkah-builder-stage">
      <canvas ref="canvasRef" class="sukkah-builder-canvas" aria-label="3D sukkah builder" />
      <p v-if="!ready" class="sukkah-builder-fallback">
        {{ t({ en: 'Loading 3D builder…', he: 'טוען בונה תלת־ממדי…' }) }}
      </p>
      <div
        class="sukkah-builder-status"
        :class="
          validation.valid ? 'sukkah-builder-status--valid' : 'sukkah-builder-status--invalid'
        "
      >
        {{
          validation.valid
            ? t({ en: 'Kosher sukkah!', he: 'סוכה כשרה!' })
            : t({ en: 'Keep building…', he: 'המשיכו לבנות…' })
        }}
      </div>
    </div>

    <p class="sukkah-builder-hint">
      {{ t({ en: 'Drag to spin the sukkah', he: 'גררו כדי לסובב את הסוכה' }) }}
    </p>

    <div class="sukkah-builder-controls">
      <div class="control-group">
        <span class="control-label">{{ t({ en: 'Walls', he: 'דפנות' }) }}</span>
        <div class="control-buttons">
          <button
            v-for="n in 4"
            :key="n"
            type="button"
            class="control-btn"
            :class="{ 'control-btn--active': wallCount === n }"
            @click="setWalls(n)"
          >
            {{ n }}
          </button>
        </div>
        <p class="control-note" :class="{ 'control-note--bad': !validation.wallsOk }">
          {{
            t(
              {
                en: `Need at least ${spec.minWalls} walls`,
                he: `צריך לפחות ${spec.minWalls} דפנות`,
              },
              '',
            )
          }}
        </p>
      </div>

      <div class="control-group">
        <label class="control-label" for="sukkah-height">
          {{ t({ en: 'Height (amot)', he: 'גובה (אמות)' }) }}: {{ heightAmot }}
        </label>
        <input
          id="sukkah-height"
          v-model.number="heightAmot"
          type="range"
          min="1"
          :max="spec.maxHeightAmot + 5"
          step="0.5"
          class="control-slider"
        />
        <p class="control-note" :class="{ 'control-note--bad': !validation.heightOk }">
          {{
            t({
              en: `Between ${spec.minHeightTefachim} tefachim (${minHeightLabel.toFixed(1)} amot) and ${spec.maxHeightAmot} amot`,
              he: `בין ${spec.minHeightTefachim} טפחים (${minHeightLabel.toFixed(1)} אמות) ל־${spec.maxHeightAmot} אמות`,
            })
          }}
        </p>
      </div>

      <button type="button" class="preset-btn" @click="setValidPreset">
        {{ t({ en: 'Make it kosher!', he: 'תעשו אותה כשרה!' }) }}
      </button>
    </div>
  </figure>
</template>

<style scoped>
.sukkah-builder {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.sukkah-builder-title {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  margin: 0;
  font-size: 1rem;
  font-weight: 800;
  color: var(--color-primary);
  font-family: var(--font-display);
}

.sukkah-builder-badge {
  font-size: 1.25rem;
}

.sukkah-builder-stage {
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--color-accent) 35%, var(--color-border));
  box-shadow: var(--shadow-md);
  background: linear-gradient(180deg, #b8e0f5 0%, #e8f4ea 100%);
}

.sukkah-builder-canvas {
  display: block;
  width: 100%;
  min-height: 280px;
  touch-action: none;
}

.sukkah-builder-fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  margin: 0;
  font-weight: 600;
  color: var(--color-text-muted);
}

.sukkah-builder-status {
  position: absolute;
  top: 0.65rem;
  inset-inline-end: 0.65rem;
  padding: 0.35rem 0.7rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 800;
  box-shadow: var(--shadow-sm);
}

.sukkah-builder-status--valid {
  background: linear-gradient(135deg, #d8f3dc, #95d5b2);
  color: var(--color-success);
}

.sukkah-builder-status--invalid {
  background: linear-gradient(135deg, #fff3cd, #ffe69c);
  color: #9a6700;
}

.sukkah-builder-hint {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-align: center;
}

.sukkah-builder-controls {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 0.85rem;
  background: var(--color-surface-elevated);
  border: 1px solid var(--color-border);
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.control-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--color-primary);
}

.control-buttons {
  display: flex;
  gap: 0.4rem;
}

.control-btn {
  min-width: 2.5rem;
  min-height: 2.5rem;
  border-radius: 0.65rem;
  border: 2px solid var(--color-border);
  background: white;
  font-weight: 800;
  color: var(--color-primary);
  cursor: pointer;
  transition:
    transform 0.12s,
    border-color 0.12s,
    background 0.12s;
}

.control-btn:hover {
  transform: scale(1.05);
}

.control-btn--active {
  border-color: var(--color-accent);
  background: var(--color-accent-soft);
}

.control-slider {
  width: 100%;
  accent-color: var(--color-primary);
}

.control-note {
  margin: 0;
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.control-note--bad {
  color: var(--color-error);
  font-weight: 700;
}

.preset-btn {
  padding: 0.65rem 1rem;
  border: none;
  border-radius: 0.75rem;
  background: linear-gradient(135deg, var(--color-primary), #2d6a7a);
  color: white;
  font-size: 0.88rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.12s;
}

.preset-btn:hover {
  transform: scale(1.02);
}

.preset-btn:active {
  transform: scale(0.98);
}
</style>
