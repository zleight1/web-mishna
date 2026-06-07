# Continuing development on Web Mishnah

This guide explains how to extend the project after the initial foundation: new chapters, tractates, activities, visual aids, UI, and deployment.

**Read first:** [PROJECT_STATUS.md](./PROJECT_STATUS.md) (full canon inventory + agent playbook), [README.md](../README.md) (quickstart), [AGENTS.md](../AGENTS.md) (conventions), [CONTRACTS.md](../CONTRACTS.md) (frozen interfaces).

---

## Current state (as of foundation + content v1)

| Area            | Shipped                                                                             |
| --------------- | ----------------------------------------------------------------------------------- |
| **Content**     | Berakhot ch. 1 (5 mishnayot), Sukkah ch. 1 (11 mishnayot)                           |
| **Visual aids** | `timeline` (Berakhot 1:1–1:2), `diagram2d` (all Sukkah 1 mishnayot)                 |
| **Activities**  | cloze, reconstruct, match, quiz                                                     |
| **Catalog**     | Home grouped by seder, chapter cards, progress badges                               |
| **Navigation**  | Breadcrumbs, chapter landing (`/learn/:order/:tractate/:chapter`), header home link |
| **Progress**    | localStorage XP, streak, per-mishnah completion (auto-saves when a lesson finishes) |
| **Hosting**     | Cloudflare Pages — https://web-mishna.pages.dev/                                    |

---

## Repository map

```
src/
  app/           Shell, router, i18n, providers
  ui/            Shared primitives (AppCard, AppButton, AppLogo, …)
  core/          Contracts, registries, default services
  content/
    schema.ts    Zod schemas — source of truth for JSON shape
    authoring/   Human-edited chapter JSON (edit here)
    data/        Built output consumed by the app (generated)
    raw/         Sefaria API dumps
  features/
    catalog/     Home, chapter map, icons, credits
    lesson/      Lesson engine + LessonView
    reader/      BilingualReader, phrase reveal
    activities/  One folder per activity; module.ts auto-registers
    visual/      timeline, diagram2d; module.ts auto-registers
    progress/    Pinia store over ProgressRepository
scripts/         Content pipeline CLIs
tests/e2e/       Playwright smoke + a11y (+ @visual snapshots in matrix)
```

**Auto-registration:** Do not hand-edit `src/features/activities/registry.ts` or `src/features/visual/registry.ts`. Add a `module.ts` in a new subfolder; the glob loader picks it up.

---

## Day-to-day workflow

```bash
cd web-mishna          # repo root
pnpm install
pnpm dev               # http://localhost:5173
```

Before opening a PR or pushing to `main`:

```bash
pnpm typecheck && pnpm lint && pnpm test
pnpm validate:content && pnpm build && pnpm size-limit
pnpm test:e2e          # smoke (chromium + webkit phone)
```

Full browser matrix (nightly / manual): `pnpm test:e2e:matrix`  
Visual regression only: `pnpm test:visual`

Branch naming (hobby project): `feat/<short-description>` — see [AGENTS.md](../AGENTS.md). Conventional Commits (`feat:`, `fix:`, `test:`).

---

## Adding a new chapter (content pipeline)

This is the most common task. Follow the pipeline **in order**.

### 1. Fetch raw text from Sefaria

```bash
pnpm fetch:sefaria Mishnah_Berakhot.2
# optional: --he=hebrew --en=english
```

Writes `src/content/raw/Mishnah_Berakhot_2.raw.json`.

### 2. Create an authoring file

Copy an existing chapter as a template:

```bash
cp src/content/authoring/Mishnah_Berakhot_1.json \
   src/content/authoring/Mishnah_Berakhot_2.json
```

Edit `src/content/authoring/Mishnah_Berakhot_2.json`:

- Set `order`, `tractate`, `chapter`, `title`
- One object per mishnah in `mishnayot[]`
- **Phrases:** split Hebrew into learner-sized units; align `translations.en` (and optional `translit`)
- **Quiz:** 3–5 `quizItems` per mishnah (`prompt`, `choices`, `answerIdx`, optional `explanation`) — all localized (`en` / `he`)
- **visualAid** (optional): see [Visual aids](#adding-a-visual-aid) below

Validate shape against [src/content/schema.ts](../src/content/schema.ts).

### 3. Build and validate

```bash
pnpm build:content      # authoring → src/content/data/<order>/<tractate>/<chapter>.json
pnpm validate:content   # Zod check all data files
```

If the tractate is new, add it to `ORDER_BY_TRACTATE` in [scripts/build-content.ts](../scripts/build-content.ts) (or set `order` explicitly in the authoring JSON).

### 4. Catalog / UI hooks (when needed)

The app auto-discovers chapters via `import.meta.glob` in `StaticContentLoader` — **no router change** for a new chapter.

Optional polish:

| Task                | File                                                                                                                   |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Tractate sort order | [src/content/catalogOrder.ts](../src/content/catalogOrder.ts) — `TRACTATE_ORDER`                                       |
| Seder label (i18n)  | [src/app/i18n.ts](../src/app/i18n.ts) — `catalog.seder.<order>` (headings), `catalog.sederShort.<order>` (breadcrumbs) |
| Tractate names      | [src/content/catalogLabels.ts](../src/content/catalogLabels.ts) — `tractateDisplayName()` + `catalog.tractate.<slug>`  |
| Tractate icon       | [src/features/catalog/CatalogIcon.vue](../src/features/catalog/CatalogIcon.vue) — `kind="tractate"` branch             |
| Seder icon          | Same file — `kind="seder"` branch                                                                                      |

### 5. Test

- Unit: phrase/quiz logic if you add helpers
- Manual: open `/learn/<order>/<tractate>/<chapter>/1`
- E2e: extend [tests/e2e/lesson.spec.ts](../tests/e2e/lesson.spec.ts) if you add critical flows

### Sukkah ch. 1 authoring script (reference)

For a full chapter with diagrams, see [scripts/author-sukkah-ch1.ts](../scripts/author-sukkah-ch1.ts) — pattern for generating authoring JSON from structured metadata.

---

## Adding a visual aid

### Existing kinds

| `kind`      | Use case                                       | Entry component                  |
| ----------- | ---------------------------------------------- | -------------------------------- |
| `timeline`  | Time windows (e.g. Shema)                      | `src/features/visual/timeline/`  |
| `diagram2d` | 2D spatial diagrams (Sukkah)                   | `src/features/visual/diagram2d/` |
| `scene3d`   | Sukkah boss 3D builder (Three.js, lazy-loaded) | `Scene3dAid` → `SukkahBuilder3d` |

### New `diagram2d` panel

1. Extend `Diagram2dSpecSchema` in [src/content/schema.ts](../src/content/schema.ts) with a new `type` literal
2. Add a Vue panel under `src/features/visual/diagram2d/`
3. Wire it in [Diagram2dAid.vue](../src/features/visual/diagram2d/Diagram2dAid.vue)
4. Add component tests in `Diagram2dAid.test.ts`
5. Reference in mishnah JSON: `{ "kind": "diagram2d", "spec": { "type": "your-type", … } }`

### New visual aid _kind_ (e.g. map, chart)

1. Add variant to `VisualAidSchema` in `schema.ts`
2. Create `src/features/visual/<kind>/` with `module.ts`:

```ts
import { defineAsyncComponent } from 'vue'
import type { VisualAidRenderer } from '@core/contracts/visual-aid'

const mod: VisualAidRenderer = {
  kind: 'your-kind',
  component: defineAsyncComponent(() => import('./YourAid.vue')),
}
export default mod
```

3. Component props: `{ aid, lang }` per [CONTRACTS.md](../CONTRACTS.md)
4. Prefer `lazy` / async component to protect bundle size (`size-limit` enforces 250 KB brotlied entry)

---

## Adding an activity

Activities power **Practice** (cloze, reconstruct, match) and **Recall** (quiz).

1. Create `src/features/activities/<kind>/`:
   - `logic.ts` — pure `generate` / `validate` (unit test heavily)
   - `<Kind>Activity.vue` — props `{ state, lang }`, emit `complete(ActivityResult)`
   - `module.ts` — export `ActivityModule` default
2. `isApplicable(mishnah)` — when to offer this activity
3. Quiz is `kind: 'quiz'` and runs in the recall stage; other kinds run in practice

Registry picks up `module.ts` automatically. Do not edit `registry.ts`.

---

## Lesson flow (integration)

```
read → practice (each applicable activity) → recall (quiz) → complete
```

Implemented in [useLessonMachine.ts](../src/features/lesson/useLessonMachine.ts) and [LessonView.vue](../src/features/lesson/LessonView.vue).

- **Read:** `BilingualReader` + optional visual aid
- **Practice / recall:** activity components from registry
- **Complete:** `progress.recordResult()` — XP, streak, completion (persisted via `LocalStorageProgressRepository`, key `web-mishna-progress`)

### Progress: implemented vs stubbed

| Piece                            | Status          | Notes                                                                  |
| -------------------------------- | --------------- | ---------------------------------------------------------------------- |
| XP + streak + per-mishnah scores | **Implemented** | [store.ts](../src/features/progress/store.ts), saved to `localStorage` |
| Home / chapter “done” badges     | **Implemented** | Reads `perMishnah[id].completed` (≥ 80% best score)                    |
| Lesson auto-save                 | **Implemented** | Fires when the lesson reaches the complete stage                       |
| SRS scheduling                   | **Stubbed**     | `IdentityScheduler` returns IDs unchanged                              |
| Telemetry                        | **Stubbed**     | `NoopTelemetry`                                                        |
| Cloud sync / accounts            | **Not started** | Would be a `RemoteProgressRepository`                                  |

Progress is **per browser / per device** only. Clearing site data or another browser starts fresh.

Routes ([router.ts](../src/app/router.ts)):

| Path                                        | View                 |
| ------------------------------------------- | -------------------- |
| `/`                                         | Home catalog         |
| `/learn/:order/:tractate/:chapter`          | Chapter mishnah grid |
| `/learn/:order/:tractate/:chapter/:mishnah` | Lesson               |
| `/credits`                                  | Attribution          |

Breadcrumb helpers: [src/content/catalogNav.ts](../src/content/catalogNav.ts)

---

## UI and i18n

- **Tokens / theme:** [src/ui/tokens.css](../src/ui/tokens.css) — colors, fonts, shadows
- **Strings:** [src/app/i18n.ts](../src/app/i18n.ts)
  - `app.*` — shell, lesson, activities
  - `catalog.*` — home, breadcrumbs, seder names (top-level keys)
- **RTL:** Hebrew uses `Frank Ruhl Libre`; `useAppLanguage()` drives `dir` on reader components
- **Icons:** [CatalogIcon.vue](../src/features/catalog/CatalogIcon.vue) — add SVG branches per tractate/seder

---

## Testing strategy

| Layer            | Command                 | Notes                                                            |
| ---------------- | ----------------------- | ---------------------------------------------------------------- |
| Unit / component | `pnpm test`             | Coverage thresholds on core logic                                |
| Content          | `pnpm validate:content` | All `src/content/data/**/*.json`                                 |
| Contracts        | `tests/contracts/`      | Registry + schema smoke                                          |
| E2e smoke        | `pnpm test:e2e`         | Home → lesson, nested nav, a11y                                  |
| E2e matrix       | `pnpm test:e2e:matrix`  | All browser/viewport projects                                    |
| Visual           | `pnpm test:visual`      | Tagged `@visual`; update snapshots when UI changes intentionally |

Playwright serves `pnpm build && pnpm preview` — always builds fresh dist before e2e.

**Fixture:** [mocks/fixtures/berakhot-1.fixture.json](../mocks/fixtures/berakhot-1.fixture.json) for isolated component tests.

---

## CI/CD

| Workflow                                        | Trigger          | What it runs                                                  |
| ----------------------------------------------- | ---------------- | ------------------------------------------------------------- |
| [ci.yml](../.github/workflows/ci.yml)           | push / PR        | typecheck, lint, deps, test, validate, build, size-limit, e2e |
| [deploy.yml](../.github/workflows/deploy.yml)   | push `main`, PRs | build → Cloudflare Pages                                      |
| [nightly.yml](../.github/workflows/nightly.yml) | schedule         | full e2e matrix                                               |

Production URL: **https://web-mishna.pages.dev/** (SPA fallback in `public/_redirects`).

---

## Suggested roadmap (pick any order)

### Content expansion

1. **Berakhot ch. 2+** — reuse timeline where time/halakha fits
2. **Eruvin ch. 1** — strong candidate for `diagram2d` (courtyards, alleys)
3. **More Moed / Zeraim tractates** — follow catalog order in `catalogOrder.ts`

### Product features

- **SRS / scheduling** — replace noop `scheduler` in services ([CONTRACTS.md](../CONTRACTS.md))
- **Accounts / sync** — `RemoteProgressRepository` implementing progress contract
- **PWA** — offline chapter cache, install prompt
- **More locales** — `fr` / `es` already in schema; wire i18n messages
- **scene3d** — TresJS/Three for spatial mishnayot (code-split; watch size-limit)

### Engineering

- Dependabot security updates (see GitHub Security tab)
- Refresh home visual snapshot after major UI changes: `pnpm test:visual --update-snapshots`
- Lighthouse CI: `pnpm lhci` (budgets in `lighthouserc.cjs`)

---

## Checklist: new chapter PR

- [ ] Authoring JSON in `src/content/authoring/`
- [ ] `pnpm build:content && pnpm validate:content`
- [ ] Phrases hand-checked (Hebrew vocalization, English alignment)
- [ ] Quiz items reviewed for correctness
- [ ] Visual aids tested on phone + desktop
- [ ] Icons/i18n updated if new tractate or seder
- [ ] `pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e`
- [ ] Commit message: `feat: add <tractate> chapter <n>`

---

## Getting help

- **Schema questions** → read `ChapterSchema` / `MishnahSchema` in [schema.ts](../src/content/schema.ts)
- **Interface changes** → update [CONTRACTS.md](../CONTRACTS.md) and all consumers
- **Sefaria API** → https://www.sefaria.org/api/docs
- **Attribution** → [ATTRIBUTION.md](../ATTRIBUTION.md) (Torat Emet Hebrew, Kulp English)

---

## Quick reference: useful commands

```bash
pnpm dev
pnpm build:content && pnpm validate:content
pnpm fetch:sefaria Mishnah_Sukkah.2
pnpm author:sukkah-ch1          # regenerate Sukkah ch.1 authoring (reference)
pnpm lint:fix
pnpm test:watch
pnpm test:e2e
pnpm test:e2e:matrix
```
