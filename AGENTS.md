# Zentro Web — Agent Instructions

For any AI coding agent (Claude Code, Cursor, Copilot, Codex). Humans: read
[CONTRIBUTING.md](./CONTRIBUTING.md).

**This file is loaded into every session — keep it short.** Details belong in `docs/`; this
file only points at them.

## What this is

Zentro is an expense-sharing app (Splitwise-class). This repo is the **Angular SPA**; the
REST API is a separate repo, [Zentro-BE](https://github.com/ali-097/Zentro-BE).

Angular 20 standalone · signals · zoneless · Tailwind v4 · TypeScript strict · Node 22.
**No SSR** — see [ADR-0001](./docs/adr/0001-drop-ssr-for-spa.md). **No NgRx** — see
[ADR-0002](./docs/adr/0002-signals-over-ngrx.md).

## Rules that cause real bugs when broken

1. **The client enforces nothing.** Every rule that matters lives in the API. A guard that
   hides a route is a UX affordance, not security — never treat it as one.
2. **Money is `{ amountMinor, currency }` from the API.** Never do arithmetic on it, never
   parse it into a float. Format for display only, via the shared money pipe.
3. **API types are generated, never hand-written.** Run `npm run api:sync` after any backend
   change. CI fails if the committed types have drifted.
4. **The access token lives in memory only.** Never `localStorage`, never `sessionStorage` —
   both are readable by any XSS payload. The refresh token is an httpOnly cookie the client
   cannot and must not touch.
5. **Layer imports go one way:** `features → shared → core`. Never upward, never
   feature → feature. ESLint enforces this.
6. **Components are `OnPush`** and read state through signals.
7. **Every interactive element is reachable by keyboard** and has an accessible name. This
   is a review-blocking item, not a polish item.

## Layout

```
src/app/
  core/      Singletons: auth, HTTP interceptors, generated API client, config, layout
  shared/    Reusable dumb pieces: ui/, pipes/, directives/, utils/
  features/  One folder per domain area: auth, groups, expenses, settlements, profile
```

Smart components (routed, fetch data) live in `features/`. Dumb components (props in, events
out) live in `shared/ui/`. If a shared component imports a service, it is in the wrong place.

## Commands

```bash
npm start             # dev server on :4200 (needs the API on :3000)
npm run lint          # check only, as CI runs it; lint:fix to autofix
npm run typecheck     # fastest correctness check
npm test              # unit tests, headless
npm run build         # production build, enforces bundle budgets
npm run api:sync      # regenerate API types from the backend's OpenAPI document
```

Before finishing: `npm run lint && npm run typecheck && npm test` pass, new UI is
keyboard-reachable, and colors come from Tailwind theme tokens rather than raw hex.

## Where to look

| For | Read |
|---|---|
| Layering, data flow, why no SSR/NgRx | [ARCHITECTURE.md](./ARCHITECTURE.md) |
| Where a new file goes | [docs/structure.md](./docs/structure.md) |
| Signals, stores, loading and error state | [docs/state.md](./docs/state.md) |
| Design tokens, Tailwind usage, dark mode | [docs/styling.md](./docs/styling.md) |
| Calling the API, generated types | [docs/api-client.md](./docs/api-client.md) |
| Keyboard, focus, labels, contrast | [docs/accessibility.md](./docs/accessibility.md) |
| Naming, component and test style | [docs/conventions.md](./docs/conventions.md) |
| Setup problems, troubleshooting | [docs/runbooks/local-dev.md](./docs/runbooks/local-dev.md) |
| Why something is the way it is | [docs/adr/](./docs/adr/) |

Read the one you need, not all of them.
