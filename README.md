# Web Mishnah

A bilingual (Hebrew + English) interactive web game for learning Mishnah, starting with Berakhot chapter 1.

## Quickstart

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173

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

## Attribution

See `ATTRIBUTION.md`. Hebrew (Torat Emet, PD) and English (Kulp, CC-BY) via Sefaria.

## License

MIT — see LICENSE
