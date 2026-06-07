<script setup lang="ts">
import { computed } from 'vue'
import type { LangCode, SukkahWallsSpec } from '@content/schema'

const props = defineProps<{ spec: SukkahWallsSpec; lang: LangCode }>()

const isRtl = computed(() => props.lang === 'he')

function t(record: Record<string, string>, fallback = '') {
  return record[props.lang] ?? record.en ?? fallback
}

const title = computed(() => t(props.spec.title ?? {}, 'Building walls'))
</script>

<template>
  <figure
    class="diagram-shell"
    :class="{ 'diagram-shell--rtl': isRtl }"
    :dir="isRtl ? 'rtl' : 'ltr'"
    aria-label="Sukkah wall-building diagram"
  >
    <figcaption class="diagram-title">{{ title }}</figcaption>
    <div class="walls-grid">
      <section class="wall-card wall-card--invalid">
        <h3>{{ t({ en: 'Top → down', he: 'מלמעלה למטה' }) }}</h3>
        <div class="wall-scene">
          <div class="wall-hanging" />
          <div class="wall-gap">{{ spec.maxGroundGapTefachim }}+</div>
          <div class="wall-ground" />
        </div>
        <p>
          {{
            t({
              en: `Gap ≥ ${spec.maxGroundGapTefachim} tefachim — invalid`,
              he: `רווח ≥ ${spec.maxGroundGapTefachim} טפחים — פסול`,
            })
          }}
        </p>
      </section>

      <section class="wall-card wall-card--valid">
        <h3>{{ t({ en: 'Bottom → up', he: 'מלמטה למעלה' }) }}</h3>
        <div class="wall-scene">
          <div class="wall-schach" />
          <div class="wall-standing" />
          <div class="wall-ground" />
        </div>
        <p>
          {{
            t({
              en: `${spec.minWallTefachim} tefachim suffices (need not reach schach)`,
              he: `${spec.minWallTefachim} טפחים מספיקים (אין צורך להגיע לסכך)`,
            })
          }}
        </p>
      </section>

      <section class="wall-card wall-card--invalid wall-card--wide">
        <h3>{{ t({ en: 'Schach distance', he: 'מרחק הסכך' }) }}</h3>
        <div class="gap-scene">
          <div class="gap-wall" />
          <div class="gap-space" />
          <div class="gap-schach" />
        </div>
        <p>
          {{
            t({
              en: `Schach ${spec.maxGroundGapTefachim} tefachim from walls — invalid`,
              he: `סכך במרחק ${spec.maxGroundGapTefachim} טפחים מהדפנות — פסול`,
            })
          }}
        </p>
      </section>
    </div>
  </figure>
</template>

<style scoped>
.diagram-shell {
  margin: 0;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: var(--color-surface-elevated, #f8fafc);
  border: 1px solid var(--color-border, #e2e8f0);
}

.diagram-title {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 0.75rem;
}

.walls-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

@media (min-width: 520px) {
  .walls-grid {
    grid-template-columns: 1fr 1fr;
  }

  .wall-card--wide {
    grid-column: 1 / -1;
  }
}

.wall-card {
  padding: 0.65rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid var(--color-border, #e2e8f0);
}

.wall-card--valid {
  border-color: #86efac;
}

.wall-card--invalid {
  border-color: #fecaca;
}

.wall-card h3 {
  font-size: 0.72rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.wall-card p {
  font-size: 0.62rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
}

.wall-scene {
  position: relative;
  height: 5.5rem;
  background: #f8fafc;
  border-radius: 0.35rem;
}

.wall-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #78716c;
}

.wall-hanging {
  position: absolute;
  top: 0.4rem;
  left: 1.5rem;
  width: 0.45rem;
  height: 2.5rem;
  background: var(--color-primary);
  border-radius: 1px;
}

.wall-gap {
  position: absolute;
  bottom: 0.5rem;
  left: 1.2rem;
  font-size: 0.58rem;
  font-weight: 700;
  color: #dc2626;
}

.wall-schach {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.4rem;
  background: repeating-linear-gradient(90deg, #854d0e 0, #854d0e 4px, #a16207 4px, #a16207 8px);
}

.wall-standing {
  position: absolute;
  bottom: 3px;
  left: 1.5rem;
  width: 0.45rem;
  height: 55%;
  background: var(--color-primary);
}

.gap-scene {
  display: flex;
  align-items: flex-end;
  height: 4rem;
  gap: 0.35rem;
  padding: 0 0.5rem 0.25rem;
}

.gap-wall {
  width: 0.45rem;
  height: 70%;
  background: var(--color-primary);
}

.gap-space {
  flex: 1;
  height: 0.35rem;
  align-self: center;
  border: 1px dashed #dc2626;
  background: rgb(254 226 226 / 0.5);
}

.gap-schach {
  flex: 2;
  height: 0.45rem;
  background: repeating-linear-gradient(
    90deg,
    #854d0e 0,
    #854d0e 3px,
    transparent 3px,
    transparent 6px
  );
}
</style>
