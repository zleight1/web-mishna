# Web Mishnah — project status & agent playbook

**Last updated:** 2026-06-07  
**Production:** https://web-mishna.pages.dev/  
**Latest commit:** `06a449c` — Sukkah 3D boss + combo streak fix  
**Repo:** `zleight1/web-mishna` (hobby project; no SP-XXXXX branches required)

This document is the **single source of truth** for where the app stands and what remains. Use it when spinning up agents to continue content, features, or polish.

**Companion files:**

| File                                           | Purpose                                                                                                       |
| ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [MISHNAH_INVENTORY.md](./MISHNAH_INVENTORY.md) | **Every mishnah** in the canon (4,192), grouped by seder → tractate → chapter, with shipped lessons marked ✅ |
| [mishnah-catalog.json](./mishnah-catalog.json) | Machine-readable catalog (chapter mishnah counts from Sefaria)                                                |
| [CONTINUING.md](./CONTINUING.md)               | How to add chapters, activities, visual aids, run CI                                                          |
| [AGENTS.md](../AGENTS.md)                      | Code ownership & conventions                                                                                  |
| [CONTRACTS.md](../CONTRACTS.md)                | Frozen interfaces                                                                                             |

Regenerate catalog data:

```bash
pnpm catalog:generate    # fetch Sefaria → mishnah-catalog.json (~4 min)
pnpm catalog:inventory   # mishnah-catalog.json → MISHNAH_INVENTORY.md
```

---

## Executive summary

**Web Mishnah** is a bilingual (Hebrew + English) Vue 3 SPA for kids/families learning Mishnah. Each mishnah is a **lesson**: read text → practice activities → recall quiz → XP/progress.

| Metric                 | Value                                                                            |
| ---------------------- | -------------------------------------------------------------------------------- |
| Mishnah canon          | **4,192** mishnayot in **525** chapters across **63** tractates in **6** sedarim |
| **Shipped & playable** | **16** mishnayot (**2** chapters)                                                |
| Completion             | **0.38%** of canon                                                               |
| Hosting                | Cloudflare Pages (auto-deploy on `main`)                                         |

The **platform is production-ready**. The bottleneck is **content authoring** (phrases, quizzes, visual aids) — not app infrastructure.

---

## What is built (platform)

### Lesson engine

```
read → practice (cloze, reconstruct, match) → recall (quiz) → complete
```

- Route: `/learn/:order/:tractate/:chapter/:mishnah`
- Auto-saves XP, streak, per-mishnah completion to `localStorage` on lesson complete
- Bilingual reader with tap-to-reveal translation + optional transliteration

### Activities (all wired)

| Activity        | Stage    | When offered                    |
| --------------- | -------- | ------------------------------- |
| **Cloze**       | Practice | Any phrase with ≥2 Hebrew words |
| **Reconstruct** | Practice | Same                            |
| **Match**       | Practice | ≥2 phrases in mishnah           |
| **Quiz**        | Recall   | ≥1 quiz item in mishnah JSON    |

### Gamification (shipped)

- Celebration sounds + confetti + screen shake (mute toggle in header)
- **Levels** from XP (40 XP per level), badge in header/home/lesson
- **Combo streaks** — 3+ correct in a row shows “Nx Combo!”; **resets on any mistake** within an activity (no mid-activity rebuild)
- **+XP pop** after each activity (includes combo bonus)
- **Haptics** on supported devices
- **Day streak** (consecutive calendar days with lesson activity)

### Catalog UI

- Home: collapsible **seder → tractate → chapter** tree (hash deep-links e.g. `#seder-zeraim`)
- Chapter landing page with mishnah grid + progress badges
- Breadcrumbs, tractate/seder SVG icons (only **berakhot** + **sukkah** tractate icons; all 6 seder icons)

### Visual aids (kinds)

| Kind        | Status | Use                                                        |
| ----------- | ------ | ---------------------------------------------------------- |
| `timeline`  | ✅     | Time windows (Berakhot 1:1–1:2)                            |
| `diagram2d` | ✅     | Sukkah panels: dimensions, layers, walls, scenarios        |
| `scene3d`   | ✅     | Sukkah 1:1 **boss** — Three.js builder (lazy-loaded chunk) |

### Progress & services

| Piece                          | Status                        |
| ------------------------------ | ----------------------------- |
| XP, streak, per-mishnah scores | ✅ `localStorage`             |
| SRS scheduling                 | ❌ stub (`IdentityScheduler`) |
| Telemetry                      | ❌ stub (`NoopTelemetry`)     |
| Accounts / cloud sync          | ❌ not started                |
| PWA / offline                  | ❌ not started                |

### CI / quality

- `pnpm typecheck && pnpm lint && pnpm test && pnpm validate:content && pnpm build && pnpm size-limit && pnpm test:e2e`
- Entry bundle size-limit: **250 KB brotlied** (Three.js in separate async chunk)
- Playwright smoke: home → lesson, nested nav, a11y

---

## Shipped content (detailed)

Only these lessons are fully authored and live:

### Zeraim — Berakhot chapter 1 (5 mishnayot)

| Mishnah      | Phrases | Quiz | Visual aid | Notes                      |
| ------------ | ------- | ---- | ---------- | -------------------------- |
| Berakhot 1:1 | 10      | 2    | `timeline` | Evening Shema time windows |
| Berakhot 1:2 | 6       | 1    | `timeline` | Morning Shema              |
| Berakhot 1:3 | 5       | 1    | —          |                            |
| Berakhot 1:4 | 6       | 1    | —          |                            |
| Berakhot 1:5 | 6       | 1    | —          |                            |

**Files:** `src/content/authoring/Mishnah_Berakhot_1.json` → `src/content/data/zeraim/berakhot/1.json`

### Moed — Sukkah chapter 1 (11 mishnayot)

| Mishnah     | Phrases | Quiz | Visual aid                                   | Notes                     |
| ----------- | ------- | ---- | -------------------------------------------- | ------------------------- |
| Sukkah 1:1  | 6       | 3    | `scene3d` **sukkah-boss**                    | 3D WebGL builder + 2D tab |
| Sukkah 1:2  | 3       | 2    | `diagram2d` sukkah-layers                    | Placement rules           |
| Sukkah 1:3  | 2       | 2    | `diagram2d` sukkah-scenario (sheets)         |                           |
| Sukkah 1:4  | 2       | 2    | `diagram2d` sukkah-scenario (vine-trellis)   | Schach materials          |
| Sukkah 1:5  | 3       | 2    | `diagram2d` sukkah-scenario (bundles)        |                           |
| Sukkah 1:6  | 3       | 2    | `diagram2d` sukkah-scenario (boards)         |                           |
| Sukkah 1:7  | 2       | 2    | `diagram2d` sukkah-scenario (ceiling-planks) |                           |
| Sukkah 1:8  | 2       | 2    | `diagram2d` sukkah-scenario (skewers-grain)  |                           |
| Sukkah 1:9  | 4       | 2    | `diagram2d` sukkah-walls                     | Wall height / gaps        |
| Sukkah 1:10 | 3       | 2    | `diagram2d` sukkah-scenario (four-amot)      |                           |
| Sukkah 1:11 | 4       | 2    | `diagram2d` sukkah-scenario (reed-mat)       |                           |

**Files:** `src/content/authoring/Mishnah_Sukkah_1.json` → `src/content/data/moed/sukkah/1.json`  
**Reference script:** `pnpm author:sukkah-ch1` (regenerates authoring JSON pattern)

---

## Complete canon inventory (all sedarim)

Below: every tractate with chapter count and mishnah count. **Per-chapter mishnah lists** (all 4,192 refs) are in [MISHNAH_INVENTORY.md](./MISHNAH_INVENTORY.md).

### I. Zeraim — 11 tractates · 75 chapters · 655 mishnayot

| Tractate     | Chapters | Mishnayot | Shipped     |
| ------------ | -------- | --------- | ----------- |
| berakhot     | 9        | 57        | **Ch 1** ✅ |
| peah         | 8        | 69        | —           |
| demai        | 7        | 53        | —           |
| kilayim      | 9        | 77        | —           |
| sheviit      | 10       | 89        | —           |
| terumot      | 11       | 101       | —           |
| maaserot     | 5        | 40        | —           |
| maaser-sheni | 5        | 57        | —           |
| challah      | 4        | 38        | —           |
| orlah        | 3        | 35        | —           |
| bikkurim     | 4        | 39        | —           |

### II. Moed — 12 tractates · 88 chapters · 681 mishnayot

| Tractate      | Chapters | Mishnayot | Shipped     |
| ------------- | -------- | --------- | ----------- |
| shabbat       | 24       | 139       | —           |
| eruvin        | 10       | 96        | —           |
| pesachim      | 10       | 89        | —           |
| shekalim      | 8        | 52        | —           |
| yoma          | 8        | 61        | —           |
| sukkah        | 5        | 53        | **Ch 1** ✅ |
| beitzah       | 5        | 42        | —           |
| rosh-hashanah | 4        | 35        | —           |
| taanit        | 4        | 34        | —           |
| megillah      | 4        | 33        | —           |
| moed-katan    | 3        | 24        | —           |
| chagigah      | 3        | 23        | —           |

### III. Nashim — 7 tractates · 71 chapters · 578 mishnayot

| Tractate  | Chapters | Mishnayot | Shipped |
| --------- | -------- | --------- | ------- |
| yevamot   | 16       | 128       | —       |
| ketubot   | 13       | 111       | —       |
| nedarim   | 11       | 90        | —       |
| nazir     | 9        | 60        | —       |
| sotah     | 9        | 67        | —       |
| gittin    | 9        | 75        | —       |
| kiddushin | 4        | 47        | —       |

### IV. Nezikin — 10 tractates · 74 chapters · 685 mishnayot

| Tractate     | Chapters | Mishnayot | Shipped |
| ------------ | -------- | --------- | ------- |
| bava-kamma   | 10       | 79        | —       |
| bava-metzia  | 10       | 97        | —       |
| bava-batra   | 10       | 86        | —       |
| sanhedrin    | 11       | 71        | —       |
| makkot       | 3        | 34        | —       |
| shevuot      | 8        | 62        | —       |
| eduyot       | 8        | 74        | —       |
| avodah-zarah | 5        | 50        | —       |
| avot         | 6        | 108       | —       |
| horayot      | 3        | 20        | —       |

### V. Kodshim — 11 tractates · 91 chapters · 590 mishnayot

| Tractate | Chapters | Mishnayot | Shipped |
| -------- | -------- | --------- | ------- |
| zevachim | 14       | 101       | —       |
| menachot | 13       | 93        | —       |
| chullin  | 12       | 74        | —       |
| bekhorot | 9        | 73        | —       |
| arakhin  | 9        | 50        | —       |
| temurah  | 7        | 35        | —       |
| keritot  | 6        | 43        | —       |
| meilah   | 6        | 38        | —       |
| tamid    | 7        | 34        | —       |
| middot   | 5        | 34        | —       |
| kinnim   | 3        | 15        | —       |

### VI. Tahorot — 12 tractates · 126 chapters · 1,003 mishnayot

| Tractate   | Chapters | Mishnayot | Shipped |
| ---------- | -------- | --------- | ------- |
| keilim     | 30       | 254       | —       |
| oholot     | 18       | 134       | —       |
| negaim     | 14       | 115       | —       |
| parah      | 12       | 96        | —       |
| tahorot    | 10       | 92        | —       |
| mikvaot    | 10       | 71        | —       |
| niddah     | 10       | 79        | —       |
| makhshirin | 6        | 54        | —       |
| zavim      | 5        | 32        | —       |
| tevul-yom  | 4        | 26        | —       |
| yadayim    | 4        | 22        | —       |
| uktzim     | 3        | 28        | —       |

**Grand total: 4,192 mishnayot · 4,176 remaining to author**

---

## Agent work packages

Use independent agents per package. Each content package should end with `pnpm validate:content && pnpm test && pnpm build` and a commit.

### Package A — Content authoring (highest value)

**Goal:** Add one chapter at a time using the content pipeline.

**Definition of done per chapter:**

1. `src/content/authoring/Mishnah_<Tractate>_<N>.json` — phrases, translations, 1–3 quiz items per mishnah, optional `visualAid`
2. `pnpm build:content && pnpm validate:content`
3. Hand-check Hebrew vocalization + English alignment
4. Manual test: `/learn/<order>/<tractate>/<chapter>/1` through last mishnah
5. If new tractate: add i18n `catalog.tractate.<slug>`, optional `CatalogIcon.vue` SVG

**Pipeline commands:**

```bash
pnpm fetch:sefaria Mishnah_Berakhot.2
cp src/content/authoring/Mishnah_Berakhot_1.json src/content/authoring/Mishnah_Berakhot_2.json
# edit authoring JSON
pnpm build:content && pnpm validate:content
```

**Suggested order (kid-friendly + visual-aid payoff):**

| Priority | Target                   | Chapters | Mishnayot | Rationale                                             |
| -------- | ------------------------ | -------- | --------- | ----------------------------------------------------- |
| P0       | `zeraim/berakhot` ch 2–9 | 8        | 52        | Continue started tractate; timelines for time/halakha |
| P0       | `moed/sukkah` ch 2–5     | 4        | 42        | Reuse diagram2d patterns from ch 1 script             |
| P1       | `moed/shabbat` ch 1–3    | 3        | 24        | High interest; candles, domains                       |
| P1       | `moed/eruvin` ch 1       | 1        | 10        | Strong `diagram2d` candidate (courtyards, alleys)     |
| P1       | `moed/pesachim` ch 1–2   | 2        | 15        | Passover audience                                     |
| P2       | `nezikin/avot`           | 6        | 108       | Ethics; shorter mishnayot, fewer diagrams needed      |
| P2       | `nashim/kiddushin` ch 1  | 1        | 10        | Smaller entry to Nashim                               |
| P3       | Remaining Zeraim + Moed  | …        | …         | Catalog order in `catalogOrder.ts`                    |
| P4       | Nashim, Nezikin          | …        | …         |                                                       |
| P5       | Kodshim, Tahorot         | …        | …         | Hardest content; save for later                       |

### Package B — Visual aids expansion

**Goal:** New `diagram2d` types or `scene3d` presets for spatial mishnayot.

| Tractate / topic | Suggested aid                              |
| ---------------- | ------------------------------------------ |
| Eruvin           | Courtyard / alley diagrams                 |
| Shabbat          | Domains (reshut hayachid / reshut harabim) |
| Pesachim         | Seder plate / korban pesach layout         |
| Bava Kamma       | Ox categories / damage zones               |
| Mikvaot / Niddah | Mikvah cross-section (future 3D?)          |

**How:** Extend `Diagram2dSpecSchema` in `schema.ts`, add Vue panel, wire in `Diagram2dAid.vue`, test in `Diagram2dAid.test.ts`.

### Package C — i18n & catalog polish

- Add `catalog.tractate.*` for all 63 tractates in `src/app/i18n.ts` (Hebrew + English)
- Custom tractate icons in `CatalogIcon.vue` (currently only berakhot, sukkah)
- E2e smoke test for Sukkah 1:1 3D tab (“Build the sukkah” / “3D Build”)

### Package D — Product features

| Feature        | Contract touchpoint    | Notes                                   |
| -------------- | ---------------------- | --------------------------------------- |
| SRS scheduling | `Services.scheduler`   | Replace `IdentityScheduler`             |
| Cloud progress | `ProgressRepository`   | New `RemoteProgressRepository`          |
| PWA            | Vite PWA plugin        | Cache built `data/**/*.json`            |
| More locales   | `schema.ts` `LangCode` | `fr`, `es` stubbed in schema            |
| Accounts       | New feature module     | Out of scope until progress sync exists |

### Package E — Engineering hygiene

- GitHub Dependabot: 3 open vulnerabilities (see repo Security tab)
- Visual regression: `pnpm test:visual --update-snapshots` after major UI changes
- Lighthouse: `pnpm lhci`

---

## Content authoring checklist (per agent)

Copy into PR / agent prompt:

```
- [ ] fetch:sefaria for chapter raw text
- [ ] authoring JSON: phrases split for kids, en/he aligned
- [ ] 1–3 quiz items per mishnah with explanations
- [ ] visualAid where spatial/time concepts help (optional but encouraged)
- [ ] build:content + validate:content
- [ ] new tractate → i18n tractate name + icon
- [ ] typecheck, lint, test, test:e2e
- [ ] commit: feat: add <tractate> chapter <n>
```

**Quality bar for phrases:**

- One mishnah clause per phrase (learner taps to reveal)
- Keep vocalized Hebrew from Torat Emet (Sefaria)
- English from Kulp Mishnah Yomit (CC-BY) — see `ATTRIBUTION.md`

**Quality bar for quizzes:**

- Multiple choice, 3–4 options
- `answerIdx` 0-based
- Brief `explanation` in en + he when possible

---

## Architecture quick reference

```
src/content/authoring/*.json  ──build:content──►  src/content/data/<order>/<tractate>/<n>.json
                                                          │
StaticContentLoader ◄───────────────────────────────────────┘
       │
LessonView → useLessonMachine → activityRegistry / visualAidRegistry
       │
progress.store (localStorage key: web-mishna-progress)
```

**Do not hand-edit** `activities/registry.ts` or `visual/registry.ts` — add `module.ts` in feature folders.

---

## Known gaps & bugs (as of 06a449c)

| Item                                 | Severity | Notes                                             |
| ------------------------------------ | -------- | ------------------------------------------------- |
| 99.6% of mishnayot unauthored        | Expected | Main work item                                    |
| Tractate i18n only berakhot + sukkah | Low      | Falls back to Title Case slug                     |
| Most tractates use default book icon | Low      |                                                   |
| SRS / sync / PWA                     | Future   | Stubs in place                                    |
| Dependabot vulnerabilities           | Medium   | 1 high, 1 moderate, 1 low                         |
| Sukkah ch 1 Sefaria vs canon         | Info     | Canon ch 1 has 11 mishnayot (matches our content) |

---

## Estimated effort (rough)

| Scope             | Mishnayot | Effort @ ~30–45 min/mishnah |
| ----------------- | --------- | --------------------------- |
| Berakhot complete | 57        | ~30–40 hours                |
| Sukkah complete   | 53        | ~25–35 hours                |
| All of Moed       | 681       | ~350–500 hours              |
| Full canon        | 4,192     | ~2,000–3,000 hours          |

**Parallelization:** One agent per chapter (or per tractate) works well — no code conflicts if each owns different `authoring/*.json` files.

---

## Quick commands

```bash
pnpm dev
pnpm build:content && pnpm validate:content
pnpm fetch:sefaria Mishnah_Sukkah.2
pnpm author:sukkah-ch1
pnpm catalog:generate
pnpm catalog:inventory
pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e
```

---

_For narrative “how to extend” docs see [CONTINUING.md](./CONTINUING.md). For every individual mishnah reference see [MISHNAH_INVENTORY.md](./MISHNAH_INVENTORY.md)._
