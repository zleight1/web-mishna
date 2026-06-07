# AGENTS.md — Web Mishnah

Hobby project. **Exempt from Torq/Stackpulse SP-XXXXX branch and PR naming rules.**

## Conventions

- Branches: `feat/<wp-id>` (e.g. `feat/wp-cloze`)
- Commits: Conventional Commits (`feat:`, `fix:`, `test:`)
- Package manager: pnpm
- Read `CONTRACTS.md` before editing shared interfaces

## File ownership

| Path                                                 | Owner          |
| ---------------------------------------------------- | -------------- |
| `src/core/**`, `src/app/**`, `src/ui/**`, registries | Foundation     |
| `src/features/activities/cloze/**`                   | WP-Cloze       |
| `src/features/activities/reconstruct/**`             | WP-Reconstruct |
| `src/features/activities/match/**`                   | WP-Match       |
| `src/features/activities/quiz/**`                    | WP-Quiz        |
| `src/features/reader/**`                             | WP-Reader      |
| `src/features/visual/timeline/**`                    | WP-Timeline    |
| `src/features/progress/**`                           | WP-Progress    |
| `src/features/catalog/**`                            | WP-Catalog     |
| `src/features/lesson/**`                             | Integration    |
| `src/content/data/**`, `scripts/**`                  | WP-Content     |

**Never hand-edit** `src/features/activities/registry.ts` or `src/features/visual/registry.ts` — plugins auto-register via glob.

## Continuing work

See **[docs/CONTINUING.md](docs/CONTINUING.md)** for the content pipeline, adding activities/visual aids, testing checklist, and roadmap.

## Commands

```bash
pnpm dev          # dev server
pnpm typecheck    # vue-tsc
pnpm lint         # eslint + prettier
pnpm test         # vitest + coverage
pnpm validate:content
pnpm build
pnpm test:e2e     # playwright smoke
```

## Testing

Build against `mocks/fixtures/berakhot-1.fixture.json`. Each WP ships tests in its owned folder.
