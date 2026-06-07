<script setup lang="ts">
import { computed } from 'vue'
import type { LangCode, SukkahScenarioSpec } from '@content/schema'

const props = defineProps<{ spec: SukkahScenarioSpec; lang: LangCode }>()

const isRtl = computed(() => props.lang === 'he')

function t(record: Record<string, string>, fallback = '') {
  return record[props.lang] ?? record.en ?? fallback
}

const title = computed(() => t(props.spec.title ?? {}, props.spec.scenario))
</script>

<template>
  <figure
    class="diagram-shell"
    :class="{ 'diagram-shell--rtl': isRtl }"
    :dir="isRtl ? 'rtl' : 'ltr'"
  >
    <figcaption class="diagram-title">{{ title }}</figcaption>

    <!-- 1:3 sheets -->
    <div v-if="spec.scenario === 'sheets'" class="scenario-grid">
      <div class="scenario-card scenario-card--bad">
        <span>{{ t({ en: 'Sheet over schach (sun)', he: 'סדין על הסכך' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--bad">
        <span>{{ t({ en: 'Sheet under schach (leaves)', he: 'סדין תחת הסכך' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--bad">
        <span>{{ t({ en: 'Sheet on kinof (4-post bed)', he: 'סדין על קינוף' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--good">
        <span>{{ t({ en: 'Naklitei bed — OK (sloped)', he: 'נקליטי מיטה — מותר' }) }}</span>
      </div>
    </div>

    <!-- 1:4 vine -->
    <div v-else-if="spec.scenario === 'vine-trellis'" class="scenario-stack">
      <div class="vine-row scenario-card--bad">
        <div class="vine-plant" />
        <div class="vine-schach" />
        <p>
          {{
            t({ en: 'Vine attached to ground + schach — invalid', he: 'גפן מחוברת + סכך — פסול' })
          }}
        </p>
      </div>
      <div class="vine-row scenario-card--good">
        <div class="vine-cut" />
        <div class="vine-schach" />
        <p>
          {{ t({ en: 'More fit schach, or cut plants — valid', he: 'סכך רב או קציצה — כשר' }) }}
        </p>
      </div>
      <p class="scenario-rule">
        {{
          t({
            en: 'Schach: from ground, not susceptible to impurity',
            he: 'סכך: מן הארץ, אינו מקבל טומאה',
          })
        }}
      </p>
    </div>

    <!-- 1:5 bundles -->
    <div v-else-if="spec.scenario === 'bundles'" class="scenario-grid scenario-grid--3">
      <div class="scenario-card scenario-card--bad">
        <div class="bundle" />
        <span>{{ t({ en: 'Tied bundles — not for schach', he: 'חבילות קשורות — לא לסכך' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--good">
        <div class="bundle bundle--open" />
        <span>{{ t({ en: 'Untied — fit for schach', he: 'מותרות — כשר לסכך' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--good">
        <div class="bundle-wall" />
        <span>{{ t({ en: 'Even tied — OK for walls', he: 'אפילו קשורות — לדפנות' }) }}</span>
      </div>
    </div>

    <!-- 1:6 boards -->
    <div v-else-if="spec.scenario === 'boards'" class="scenario-stack">
      <div class="board-dispute">
        <span class="tag tag--good">{{
          t({ en: 'R. Yehuda: boards OK', he: 'ר׳ יהודה: נסרים כשרים' })
        }}</span>
        <span class="tag tag--bad">{{ t({ en: 'R. Meir: forbids', he: 'ר׳ מאיר: אוסר' }) }}</span>
      </div>
      <div class="board-plank">
        <div class="plank-wide" />
        <div class="plank-person plank-person--no" />
        <p>
          {{
            t({
              en: '4-tefach plank: fit, but do not sleep beneath',
              he: 'נסר ד׳ טפחים: כשר, לא לישון תחתיו',
            })
          }}
        </p>
      </div>
    </div>

    <!-- 1:7 ceiling -->
    <div v-else-if="spec.scenario === 'ceiling-planks'" class="scenario-stack">
      <div class="ceiling-row">
        <span>{{
          t({ en: 'Beit Shammai: move all + remove one', he: 'בית שמאי: מפקפק ונוטל' })
        }}</span>
      </div>
      <div class="ceiling-row ceiling-row--mid">
        <span>{{
          t({ en: 'Beit Hillel: move OR remove one', he: 'בית הלל: מפקפק או נוטל' })
        }}</span>
      </div>
      <div class="ceiling-row">
        <span>{{ t({ en: 'R. Meir: remove one only', he: 'ר׳ מאיר: נוטל בלבד' }) }}</span>
      </div>
    </div>

    <!-- 1:8 skewers -->
    <div v-else-if="spec.scenario === 'skewers-grain'" class="scenario-grid">
      <div class="scenario-card scenario-card--good">
        <div class="skewer-row">
          <span class="skewer" /><span class="skewer-gap" /><span class="skewer" /><span
            class="skewer-gap"
          /><span class="skewer" />
        </div>
        <span>{{ t({ en: 'Gaps = width → fit', he: 'רווח כרוחב — כשר' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--bad">
        <div class="grain-mound" />
        <span>{{
          t({ en: 'Hollowed grain stack — not a sukka', he: 'חפירה בגדיש — אינה סוכה' })
        }}</span>
      </div>
    </div>

    <!-- 1:10 four amot -->
    <div v-else-if="spec.scenario === 'four-amot'" class="scenario-stack">
      <div class="amot-bar amot-bar--bad">
        <div class="amot-ceiling" />
        <div class="amot-gap" />
        <div class="amot-schach" />
        <p>
          {{
            t({ en: '≥4 amot ceiling before schach — invalid', he: 'ד׳ אמות תקרה לפני סכך — פסול' })
          }}
        </p>
      </div>
      <div class="amot-bar amot-bar--good">
        <div class="amot-ceiling amot-ceiling--short" />
        <div class="amot-schach" />
        <p>{{ t({ en: '<4 amot — curved wall (fit)', he: 'פחות מד׳ אמות — דופן עקומה' }) }}</p>
      </div>
    </div>

    <!-- 1:11 reed mat -->
    <div v-else-if="spec.scenario === 'reed-mat'" class="scenario-grid">
      <div class="scenario-card scenario-card--bad">
        <div class="mat mat--sleep" />
        <span>{{
          t({ en: 'Made for lying — impure, no schach', he: 'לשכיבה — טמא, לא לסכך' })
        }}</span>
      </div>
      <div class="scenario-card scenario-card--good">
        <div class="mat mat--schach" />
        <span>{{ t({ en: 'Made for schach — fit', he: 'לסכך — כשר' }) }}</span>
      </div>
      <div class="scenario-card scenario-card--mid">
        <div class="hut-icon" />
        <span>{{
          t({
            en: 'Circular hut: Sages fit; R. Eliezer invalid',
            he: 'צריף: חכמים מכשירים; ר׳ אליעזר פוסל',
          })
        }}</span>
      </div>
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

.scenario-grid {
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr;
}

.scenario-grid--3 {
  grid-template-columns: 1fr;
}

@media (min-width: 420px) {
  .scenario-grid--3 {
    grid-template-columns: repeat(3, 1fr);
  }
}

.scenario-card {
  padding: 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.62rem;
  font-weight: 600;
  text-align: center;
  line-height: 1.25;
  border: 1px solid var(--color-border, #e2e8f0);
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
  min-height: 3.5rem;
  justify-content: center;
}

.scenario-card--bad {
  background: rgb(254 242 242);
  border-color: #fecaca;
  color: #991b1b;
}

.scenario-card--good {
  background: rgb(240 253 244);
  border-color: #86efac;
  color: #166534;
}

.scenario-card--mid {
  background: rgb(255 251 235);
  border-color: #fde68a;
  color: #92400e;
}

.scenario-stack {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.scenario-rule {
  font-size: 0.62rem;
  font-weight: 600;
  text-align: center;
  margin: 0;
  color: var(--color-text-muted);
}

.vine-row {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 0.35rem;
  padding: 0.5rem;
  border-radius: 0.4rem;
  align-items: end;
}

.vine-row p {
  grid-column: 1 / -1;
  font-size: 0.62rem;
  font-weight: 600;
  margin: 0.25rem 0 0;
}

.vine-plant {
  height: 2.5rem;
  width: 0.4rem;
  margin: 0 auto;
  background: #16a34a;
  border-radius: 2px;
}

.vine-cut {
  height: 1.2rem;
  width: 0.4rem;
  margin: 0 auto 0.3rem;
  background: #86efac;
  border-radius: 2px;
}

.vine-schach {
  height: 0.45rem;
  background: repeating-linear-gradient(90deg, #854d0e 0, #854d0e 4px, #a16207 4px, #a16207 8px);
  border-radius: 1px;
}

.bundle {
  width: 2rem;
  height: 1rem;
  background: #d97706;
  border-radius: 2px;
  border: 2px solid #92400e;
}

.bundle--open {
  border-style: dashed;
  opacity: 0.85;
}

.bundle-wall {
  width: 0.45rem;
  height: 2rem;
  background: var(--color-primary);
}

.board-dispute {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
}

.tag {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 0.25rem 0.45rem;
  border-radius: 999px;
}

.tag--good {
  background: #dcfce7;
  color: #166534;
}

.tag--bad {
  background: #fee2e2;
  color: #991b1b;
}

.board-plank {
  text-align: center;
}

.board-plank p {
  font-size: 0.62rem;
  font-weight: 600;
  margin: 0.35rem 0 0;
}

.plank-wide {
  height: 0.55rem;
  width: 70%;
  margin: 0 auto;
  background: #78716c;
  border-radius: 2px;
}

.plank-person {
  width: 0.75rem;
  height: 0.75rem;
  margin: 0.25rem auto 0;
  border-radius: 50%;
  background: var(--color-primary);
  opacity: 0.5;
}

.plank-person--no::after {
  content: '✕';
  display: block;
  color: #dc2626;
  font-size: 0.7rem;
  line-height: 0.75rem;
  text-align: center;
}

.ceiling-row {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 0.45rem;
  border-radius: 0.35rem;
  background: white;
  border: 1px solid var(--color-border, #e2e8f0);
  text-align: center;
}

.ceiling-row--mid {
  background: #eff6ff;
  border-color: #93c5fd;
}

.skewer-row {
  display: flex;
  align-items: center;
  gap: 2px;
  width: 100%;
  justify-content: center;
}

.skewer {
  width: 0.35rem;
  height: 1.25rem;
  background: #64748b;
}

.skewer-gap {
  width: 0.35rem;
  height: 0.2rem;
}

.grain-mound {
  width: 3rem;
  height: 1.5rem;
  background: #eab308;
  border-radius: 50% 50% 20% 20%;
}

.amot-bar {
  padding: 0.5rem;
  border-radius: 0.4rem;
  font-size: 0.62rem;
  font-weight: 600;
}

.amot-bar--bad {
  background: rgb(254 242 242);
}

.amot-bar--good {
  background: rgb(240 253 244);
}

.amot-bar p {
  margin: 0.35rem 0 0;
}

.amot-ceiling {
  height: 0.35rem;
  background: #94a3b8;
  margin-bottom: 0.25rem;
}

.amot-ceiling--short {
  width: 35%;
}

.amot-gap {
  height: 0.5rem;
  border: 1px dashed #dc2626;
  margin-bottom: 0.25rem;
}

.amot-schach {
  height: 0.4rem;
  background: repeating-linear-gradient(
    90deg,
    #854d0e 0,
    #854d0e 3px,
    transparent 3px,
    transparent 6px
  );
}

.mat {
  width: 2.5rem;
  height: 1.25rem;
  border-radius: 2px;
  background: repeating-linear-gradient(0deg, #ca8a04 0, #ca8a04 2px, #fde68a 2px, #fde68a 4px);
}

.mat--sleep {
  opacity: 0.55;
}

.hut-icon {
  width: 2rem;
  height: 1.25rem;
  border: 2px solid var(--color-primary);
  border-bottom: none;
  border-radius: 50% 50% 0 0;
}
</style>
