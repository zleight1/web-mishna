<script setup lang="ts">
import { computed } from 'vue'
import type { LangCode, SukkahDimensionsSpec } from '@content/schema'

const props = defineProps<{ spec: SukkahDimensionsSpec; lang: LangCode }>()

const isRtl = computed(() => props.lang === 'he')

function t(record: Record<string, string>, fallback = '') {
  return record[props.lang] ?? record.en ?? fallback
}

const title = computed(() => t(props.spec.title ?? {}, 'Sukkah dimensions'))
const minLabel = computed(() =>
  t(
    {
      en: `${props.spec.minHeightTefachim} handbreadths min`,
      he: `מינימום ${props.spec.minHeightTefachim} טפחים`,
    },
    `${props.spec.minHeightTefachim} tefachim`,
  ),
)
const maxLabel = computed(() =>
  t(
    {
      en: `${props.spec.maxHeightAmot} cubits max`,
      he: `מקסימום ${props.spec.maxHeightAmot} אמות`,
    },
    `${props.spec.maxHeightAmot} amot`,
  ),
)
const wallsLabel = computed(() =>
  t(
    {
      en: `${props.spec.minWalls} walls minimum`,
      he: `מינימום ${props.spec.minWalls} דפנות`,
    },
    `${props.spec.minWalls} walls`,
  ),
)
const shadeRule = computed(() =>
  t({
    en: 'More shade than sun',
    he: 'צל רב מחמה',
  }),
)
const shadeInvalid = computed(() =>
  t({
    en: 'More sun than shade — invalid',
    he: 'חמה רבה מצל — פסול',
  }),
)
const validZone = computed(() =>
  t({
    en: 'Valid height zone',
    he: 'טווח גובה כשר',
  }),
)
const disputeNote = computed(() => {
  const d = props.spec.dispute
  if (!d) return ''
  return `${t(d.figure)}: ${t(d.opinion)}`
})
</script>

<template>
  <figure
    class="diagram-shell"
    :class="{ 'diagram-shell--rtl': isRtl }"
    :dir="isRtl ? 'rtl' : 'ltr'"
    aria-label="Sukkah dimension diagram"
  >
    <figcaption class="diagram-title">{{ title }}</figcaption>

    <div class="diagram-grid">
      <section class="diagram-panel">
        <h3 class="diagram-panel-title">
          {{ t({ en: 'Height (side view)', he: 'גובה (מבט צד)' }) }}
        </h3>
        <div class="height-scene" role="img" :aria-label="`${minLabel}; ${maxLabel}`">
          <div class="height-zone height-zone--invalid-top">
            <span>{{ maxLabel }}</span>
            <span v-if="disputeNote" class="height-dispute">{{ disputeNote }}</span>
          </div>
          <div class="height-zone height-zone--valid">
            <div class="sukkah-frame">
              <div class="sukkah-schach" />
              <span class="height-zone-label">{{ validZone }}</span>
            </div>
          </div>
          <div class="height-zone height-zone--invalid-bottom">
            <span>{{ minLabel }}</span>
          </div>
          <div class="height-ground" />
        </div>
      </section>

      <section class="diagram-panel">
        <h3 class="diagram-panel-title">
          {{ t({ en: 'Walls (plan view)', he: 'דפנות (מבט מלמעלה)' }) }}
        </h3>
        <div class="plan-scene" role="img" :aria-label="wallsLabel">
          <div class="plan-wall plan-wall--back" />
          <div class="plan-wall plan-wall--left" />
          <div class="plan-wall plan-wall--right" />
          <div class="plan-opening" />
          <p class="plan-caption">{{ wallsLabel }}</p>
        </div>
      </section>

      <section class="diagram-panel diagram-panel--wide">
        <h3 class="diagram-panel-title">
          {{ t({ en: 'Schach shade', he: 'צל הסכך' }) }}
        </h3>
        <div class="shade-compare">
          <div class="shade-example shade-example--valid">
            <div class="shade-schach" />
            <div class="shade-rays shade-rays--blocked" />
            <div class="shade-floor">
              <span class="shade-good">{{ shadeRule }}</span>
            </div>
          </div>
          <div class="shade-example shade-example--invalid">
            <div class="shade-schach shade-schach--sparse" />
            <div class="shade-rays shade-rays--through" />
            <div class="shade-floor">
              <span class="shade-bad">{{ shadeInvalid }}</span>
            </div>
          </div>
        </div>
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

.diagram-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

@media (min-width: 560px) {
  .diagram-grid {
    grid-template-columns: 1fr 1fr;
  }

  .diagram-panel--wide {
    grid-column: 1 / -1;
  }
}

.diagram-panel {
  padding: 0.65rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid var(--color-border, #e2e8f0);
}

.diagram-panel-title {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 0.5rem;
}

.height-scene {
  position: relative;
  height: 10rem;
  display: flex;
  flex-direction: column;
  border-radius: 0.35rem;
  overflow: hidden;
}

.height-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  font-weight: 600;
  text-align: center;
  padding: 0.2rem;
  line-height: 1.2;
}

.height-zone--invalid-top {
  flex: 0 0 22%;
  background: rgb(254 226 226);
  color: #991b1b;
}

.height-zone--valid {
  flex: 1;
  background: rgb(220 252 231);
  color: #166534;
  position: relative;
}

.height-zone--invalid-bottom {
  flex: 0 0 14%;
  background: rgb(254 226 226);
  color: #991b1b;
}

.height-dispute {
  font-size: 0.58rem;
  font-weight: 500;
  margin-top: 0.15rem;
  color: #b45309;
}

.sukkah-frame {
  position: relative;
  width: 55%;
  height: 75%;
  margin: auto;
  border-left: 2px solid #166534;
  border-right: 2px solid #166534;
}

.sukkah-schach {
  position: absolute;
  top: 0;
  left: -4px;
  right: -4px;
  height: 0.45rem;
  background: repeating-linear-gradient(90deg, #854d0e 0, #854d0e 3px, #a16207 3px, #a16207 6px);
  border-radius: 1px;
}

.height-zone-label {
  position: absolute;
  bottom: 0.25rem;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.58rem;
  white-space: nowrap;
}

.height-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #78716c;
}

.plan-scene {
  position: relative;
  height: 8rem;
  margin: 0 auto;
  max-width: 9rem;
}

.plan-wall {
  position: absolute;
  background: var(--color-primary);
  opacity: 0.85;
}

.plan-wall--back {
  top: 0.5rem;
  left: 1rem;
  right: 1rem;
  height: 0.45rem;
  border-radius: 2px;
}

.plan-wall--left {
  top: 0.5rem;
  left: 1rem;
  width: 0.45rem;
  bottom: 1.5rem;
  border-radius: 2px;
}

.plan-wall--right {
  top: 0.5rem;
  right: 1rem;
  width: 0.45rem;
  bottom: 1.5rem;
  border-radius: 2px;
}

.plan-opening {
  position: absolute;
  bottom: 1.5rem;
  left: 1rem;
  right: 1rem;
  height: 0.35rem;
  border: 1px dashed #94a3b8;
  border-top: none;
  border-radius: 0 0 4px 4px;
}

.plan-caption {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

.shade-compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.shade-example {
  position: relative;
  height: 5.5rem;
  border-radius: 0.35rem;
  overflow: hidden;
}

.shade-example--valid {
  background: linear-gradient(180deg, #fef9c3 0%, #dcfce7 55%);
}

.shade-example--invalid {
  background: linear-gradient(180deg, #fef9c3 0%, #fee2e2 55%);
}

.shade-schach {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 0.55rem;
  background: repeating-linear-gradient(
    90deg,
    #854d0e 0,
    #854d0e 4px,
    transparent 4px,
    transparent 7px
  );
}

.shade-schach--sparse {
  background: repeating-linear-gradient(
    90deg,
    #854d0e 0,
    #854d0e 2px,
    transparent 2px,
    transparent 10px
  );
}

.shade-rays {
  position: absolute;
  top: 0.55rem;
  left: 0;
  right: 0;
  bottom: 0;
}

.shade-rays--blocked {
  background: repeating-linear-gradient(
    135deg,
    rgb(34 197 94 / 0.12) 0,
    rgb(34 197 94 / 0.12) 8px,
    transparent 8px,
    transparent 16px
  );
}

.shade-rays--through {
  background: repeating-linear-gradient(
    160deg,
    rgb(250 204 21 / 0.35) 0,
    rgb(250 204 21 / 0.35) 6px,
    transparent 6px,
    transparent 14px
  );
}

.shade-floor {
  position: absolute;
  bottom: 0.25rem;
  left: 0.2rem;
  right: 0.2rem;
  text-align: center;
}

.shade-good,
.shade-bad {
  font-size: 0.58rem;
  font-weight: 600;
  line-height: 1.2;
}

.shade-good {
  color: #166534;
}

.shade-bad {
  color: #991b1b;
}
</style>
