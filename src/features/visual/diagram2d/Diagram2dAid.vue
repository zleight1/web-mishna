<script setup lang="ts">
import { computed } from 'vue'
import type { Diagram2dSpec, LangCode, VisualAid } from '@content/schema'
import SukkahDimensionsPanel from './SukkahDimensionsPanel.vue'

const props = defineProps<{ aid: VisualAid; lang: LangCode }>()

const spec = computed((): Diagram2dSpec | null =>
  props.aid.kind === 'diagram2d' ? props.aid.spec : null,
)
</script>

<template>
  <SukkahDimensionsPanel v-if="spec?.type === 'sukkah-dimensions'" :spec="spec" :lang="lang" />
</template>
