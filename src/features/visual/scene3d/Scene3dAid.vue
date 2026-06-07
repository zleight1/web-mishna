<script setup lang="ts">
import { computed, ref } from 'vue'
import type { LangCode, Scene3dSpec, SukkahDimensionsSpec, VisualAid } from '@content/schema'
import SukkahDimensionsPanel from '@features/visual/diagram2d/SukkahDimensionsPanel.vue'
import SukkahBuilder3d from './SukkahBuilder3d.vue'

const props = defineProps<{ aid: VisualAid; lang: LangCode }>()

const mode = ref<'3d' | '2d'>('3d')

const spec = computed((): Scene3dSpec | null =>
  props.aid.kind === 'scene3d' ? props.aid.spec : null,
)

const dimensionsSpec = computed((): SukkahDimensionsSpec | null => {
  const s = spec.value
  if (!s || s.preset !== 'sukkah-boss') return null
  return {
    type: 'sukkah-dimensions',
    title: s.title,
    minHeightTefachim: s.minHeightTefachim,
    maxHeightAmot: s.maxHeightAmot,
    minWalls: s.minWalls,
    dispute: s.dispute,
  }
})

function t(record: Record<string, string>) {
  return record[props.lang] ?? record.en ?? ''
}
</script>

<template>
  <div v-if="spec" class="scene3d-aid">
    <div class="scene3d-tabs" role="tablist">
      <button
        type="button"
        role="tab"
        class="scene3d-tab"
        :class="{ 'scene3d-tab--active': mode === '3d' }"
        :aria-selected="mode === '3d'"
        @click="mode = '3d'"
      >
        {{ t({ en: '3D Build', he: 'בנייה 3D' }) }}
      </button>
      <button
        type="button"
        role="tab"
        class="scene3d-tab"
        :class="{ 'scene3d-tab--active': mode === '2d' }"
        :aria-selected="mode === '2d'"
        @click="mode = '2d'"
      >
        {{ t({ en: '2D Diagram', he: 'דיאגרמה' }) }}
      </button>
    </div>

    <SukkahBuilder3d
      v-if="mode === '3d' && spec.preset === 'sukkah-boss'"
      :spec="spec"
      :lang="lang"
    />
    <SukkahDimensionsPanel
      v-else-if="mode === '2d' && dimensionsSpec"
      :spec="dimensionsSpec"
      :lang="lang"
    />
  </div>
</template>

<style scoped>
.scene3d-aid {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.scene3d-tabs {
  display: flex;
  gap: 0.4rem;
  padding: 0.25rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  border: 1px solid color-mix(in srgb, var(--color-primary) 15%, var(--color-border));
}

.scene3d-tab {
  flex: 1;
  padding: 0.45rem 0.75rem;
  border: none;
  border-radius: 999px;
  background: transparent;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--color-primary);
  cursor: pointer;
}

.scene3d-tab--active {
  background: white;
  box-shadow: var(--shadow-sm);
}
</style>
