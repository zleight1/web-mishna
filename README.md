# Web Mishnah

A bilingual (Hebrew + English) interactive web game for learning Mishnah — Berakhot chapter 1 (timelines) and Sukkah chapter 1 (all 11 mishnayot with diagram visual aids).

## Quickstart

**Run commands from the repo root** (`web-mishna/`), not the parent `work/` folder:

```bash
cd web-mishna   # or: cd ~/work/zleight1/web-mishna
pnpm install
pnpm dev
```

Open http://localhost:5173

Requires **Node 22+** and **pnpm** (`corepack enable && corepack prepare pnpm@latest --activate`).

## Scripts

| Command                 | Description                     |
| ----------------------- | ------------------------------- |
| `pnpm dev`              | Development server              |
| `pnpm build`            | Production build                |
| `pnpm test`             | Unit + component tests          |
| `pnpm test:e2e`         | Playwright smoke tests          |
| `pnpm validate:content` | Validate content JSON           |
| `pnpm fetch:sefaria`    | Fetch raw text from Sefaria API |

## Architecture

Vue 3 SPA with plugin-based activities and visual aids. See `CONTRACTS.md` and `AGENTS.md`.

## Continuing development

**[docs/CONTINUING.md](docs/CONTINUING.md)** — how to add chapters, tractates, activities, visual aids, run CI, and suggested next steps.

## Attribution

See `ATTRIBUTION.md`. Hebrew (Torat Emet, PD) and English (Kulp, CC-BY) via Sefaria.

## License

MIT — see LICENSE
