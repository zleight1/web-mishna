<script setup lang="ts">
import { computed } from 'vue'
import type { LangCode, SukkahLayersSpec } from '@content/schema'

const props = defineProps<{ spec: SukkahLayersSpec; lang: LangCode }>()

const isRtl = computed(() => props.lang === 'he')

function t(record: Record<string, string>, fallback = '') {
  return record[props.lang] ?? record.en ?? fallback
}

const title = computed(() => t(props.spec.title ?? {}, 'Placement rules'))
</script>

<template>
  <figure
    class="diagram-shell"
    :class="{ 'diagram-shell--rtl': isRtl }"
    :dir="isRtl ? 'rtl' : 'ltr'"
    aria-label="Sukkah placement diagram"
  >
    <figcaption class="diagram-title">{{ title }}</figcaption>
    <div class="layers-grid">
      <section class="layer-card layer-card--invalid">
        <h3>{{ t({ en: 'Under a tree', he: 'תחת האילן' }) }}</h3>
        <div class="layer-scene layer-scene--tree">
          <div class="tree-canopy" />
          <div class="tree-trunk" />
          <div class="sukkah-mini sukkah-mini--blocked" />
        </div>
        <p>{{ t({ en: 'Like inside a house — invalid', he: 'כבתוך הבית — פסול' }) }}</p>
      </section>

      <section class="layer-card">
        <h3>{{ t({ en: 'Sukka on sukka', he: 'סוכה על סוכה' }) }}</h3>
        <div class="layer-scene layer-scene--stack">
          <div class="stack-upper">
            <span>{{ t({ en: 'Upper — fit', he: 'עליונה — כשר' }) }}</span>
          </div>
          <div class="stack-lower">
            <span>{{ t({ en: 'Lower — invalid', he: 'תחתונה — פסול' }) }}</span>
          </div>
        </div>
        <p class="layer-note">
          {{
            t({
              en: 'R. Yehuda: lower fit if upper is empty',
              he: 'רבי יהודה: תחתונה כשרה אם אין דירה בעליונה',
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

.layers-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: 1fr;
}

@media (min-width: 480px) {
  .layers-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.layer-card {
  padding: 0.65rem;
  border-radius: 0.5rem;
  background: white;
  border: 1px solid var(--color-border, #e2e8f0);
}

.layer-card--invalid {
  border-color: #fecaca;
}

.layer-card h3 {
  font-size: 0.72rem;
  font-weight: 600;
  margin: 0 0 0.5rem;
}

.layer-card p {
  font-size: 0.62rem;
  font-weight: 600;
  margin: 0.5rem 0 0;
  color: var(--color-text);
}

.layer-note {
  color: #b45309 !important;
}

.layer-scene {
  position: relative;
  height: 6.5rem;
  border-radius: 0.35rem;
  background: linear-gradient(180deg, #dbeafe 0%, #ecfccb 70%);
}

.layer-scene--tree .tree-canopy {
  position: absolute;
  top: 0.35rem;
  left: 50%;
  transform: translateX(-50%);
  width: 4rem;
  height: 2rem;
  border-radius: 50% 50% 40% 40%;
  background: #16a34a;
}

.layer-scene--tree .tree-trunk {
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  width: 0.5rem;
  height: 1.5rem;
  background: #92400e;
}

.sukkah-mini {
  position: absolute;
  bottom: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2.5rem;
  height: 1.75rem;
  border: 2px solid var(--color-primary);
  border-top: 3px solid #854d0e;
}

.sukkah-mini--blocked::after {
  content: '✕';
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
  font-weight: 700;
  font-size: 1rem;
  background: rgb(254 226 226 / 0.55);
}

.layer-scene--stack {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.4rem;
}

.stack-upper,
.stack-lower {
  flex: 1;
  border-radius: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 600;
  text-align: center;
  padding: 0.2rem;
}

.stack-upper {
  background: rgb(220 252 231);
  color: #166534;
  border: 1px solid #86efac;
}

.stack-lower {
  background: rgb(254 226 226);
  color: #991b1b;
  border: 1px solid #fca5a5;
}
</style>
