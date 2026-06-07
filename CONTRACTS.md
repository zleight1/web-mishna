# CONTRACTS.md — Frozen interfaces

Do not change without updating all consumers and tests.

## Content (`src/content/schema.ts`)

- `Phrase`: `{ he, translations: Record<LangCode,string>, translit? }`
- `Mishnah`: canonical ref + phrases + quiz + optional visualAid + source attribution
- `Chapter`: order/tractate/chapter + mishnayot[]

## Activity (`src/core/contracts/activity.ts`)

```ts
;(ActivityModule < State,
  Answer >
    {
      kind,
      label,
      isApplicable,
      generate,
      validate,
      component,
    })
```

Component props: `{ state, lang }`. Emits: `complete(ActivityResult)`.

## Visual aid (`src/core/contracts/visual-aid.ts`)

```ts
VisualAidRenderer { kind, lazy?, component }
```

Component props: `{ aid, lang }`.

## Services (`src/core/contracts/services.ts`)

```ts
Services { content, progress, scheduler, telemetry }
```

Consumed via `useServices()` only.

## Progress (`src/core/contracts/progress.ts`)

```ts
ProgressState { schemaVersion, xp, streak, lastActiveDate, perMishnah }
```
