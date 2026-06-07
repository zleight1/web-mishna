<script setup lang="ts">
import { computed } from 'vue'
import type { Diagram2dSpec, LangCode, VisualAid } from '@content/schema'
import SukkahDimensionsPanel from './SukkahDimensionsPanel.vue'
import SukkahLayersPanel from './SukkahLayersPanel.vue'
import SukkahWallsPanel from './SukkahWallsPanel.vue'
import SukkahScenarioPanel from './SukkahScenarioPanel.vue'

const props = defineProps<{ aid: VisualAid; lang: LangCode }>()

const spec = computed((): Diagram2dSpec | null =>
  props.aid.kind === 'diagram2d' ? props.aid.spec : null,
)
</script>

<template>
  <SukkahDimensionsPanel v-if="spec?.type === 'sukkah-dimensions'" :spec="spec" :lang="lang" />
  <SukkahLayersPanel v-else-if="spec?.type === 'sukkah-layers'" :spec="spec" :lang="lang" />
  <SukkahWallsPanel v-else-if="spec?.type === 'sukkah-walls'" :spec="spec" :lang="lang" />
  <SukkahScenarioPanel v-else-if="spec?.type === 'sukkah-scenario'" :spec="spec" :lang="lang" />
</template>
