# Zentro Web

The Angular client for **Zentro**, an expense-sharing app — groups, shared expenses, split
calculation, running balances and settle-up.

The API lives in a separate repository: **[zentro-be](https://github.com/ali-097/zentro-be)**.
This app is a pure consumer of it — see [The client enforces nothing](#the-client-enforces-nothing).

| | |
|---|---|
| **Stack** | Angular 20 (standalone, signals, zoneless) · Tailwind v4 · TypeScript 5.9 |
| **Node** | 22 (see `.nvmrc`) |
| **Dev server** | `http://localhost:4200` |
| **API** | `http://localhost:3000/api/v1` |
| **Board** | [Zentro project board](https://github.com/users/ali-097/projects) |

---

## Project status

> **Pre-release. The `M0 Foundation` milestone is in progress.**
>
> This README, `ARCHITECTURE.md` and `docs/` describe the **target** design — they are what
> M0 builds toward and what every issue is written against. Read them as the spec.
>
> The app today is a scaffold: pages exist but are mostly empty, auth is a `localStorage`
> mock, and there is no HTTP layer. The zoneless migration, the `core`/`shared`/`features`
> restructure and the generated API client are all `priority:P0` issues on the board. Until
> they land, `npm run api:sync` has nothing to fetch.

---

## Quickstart

You need **Node 22**. From a clean clone:

```bash
npm ci                # install dependencies
npm start             # http://localhost:4200
```

For anything data-driven you also need the API running:

```bash
# in the zentro-be checkout
docker compose up -d db && npm run start:dev     # http://localhost:3000
```

`http://localhost:4200` is already in the backend's CORS allowlist, so requests work
directly against `:3000`.

> The dev-server proxy for `/api` does **not** exist yet — it lands with
> [#7](https://github.com/ali-097/zentro-fe/issues/7) alongside the environment config.
> Until then there is no HTTP layer at all, so nothing calls the API regardless.

If something misbehaves, check
**[docs/runbooks/local-dev.md](./docs/runbooks/local-dev.md)** before debugging — it covers
the common failures. If your problem isn't there, that's a documentation bug worth filing.

---

## Scripts

| Command | What it does |
|---|---|
| `npm start` | Dev server with hot reload on `:4200` |
| `npm run build` | Production build to `dist/`, enforcing bundle budgets |
| `npm run watch` | Development build in watch mode |
| `npm run lint` | ESLint, check only — this is what CI runs |
| `npm run lint:fix` | ESLint with `--fix` |
| `npm run format` | Prettier over the source tree |
| `npm run format:check` | Prettier in check mode — what CI runs |
| `npm run typecheck` | `tsc --noEmit` — fastest correctness check |
| `npm test` | Unit tests, headless |
| `npm run test:watch` | Unit tests in watch mode |
| `npm run api:sync` | Regenerate typed API models from the backend's OpenAPI document |

---

## Deploying

`npm run build` emits **static files** to `dist/Zentro-FE/browser/` — HTML, JS and CSS.
There is no server bundle and no Node process to run, so any static host or CDN will serve it.

Two things the host has to get right:

- **Rewrite every unmatched path to `/index.html`.** Routing happens in the browser, so `/`
  is the only path that exists on disk. Without the fallback, a deep link like `/group/42` —
  or simply refreshing that page — returns 404.
- **Don't cache `index.html`.** Assets are content-hashed (`outputHashing: "all"`) and can be
  cached indefinitely, but `index.html` is what points at the current hashes.

The actual deployment setup — host, pipeline, environments — is
[#39](https://github.com/ali-097/zentro-fe/issues/39).

---

## Project layout

```
src/app/
  core/       Singletons, instantiated once: auth service and store, HTTP
              interceptors, generated API client, config, app shell and nav
  shared/     Reusable and dumb: ui/ primitives, pipes/, directives/, utils/
  features/   One folder per domain area — auth, groups, expenses,
              settlements, activity, friends, profile
```

The dependency rule is one-directional: **`features → shared → core`**. Never upward, never
feature-to-feature. ESLint enforces it, because this is the boundary that quietly erodes
first and takes the codebase's navigability with it.

Full annotated tree and a "where do I put X?" table:
[docs/structure.md](./docs/structure.md).

---

## The client enforces nothing

Worth stating plainly, because it shapes how you write everything here.

Every rule that matters — who may see a group, whether a split is valid, what a balance is —
lives in the API. This app renders what the server allows and sends what the user asks for.

A route guard that hides `/groups` from a logged-out user is a **convenience**, so they see a
login screen rather than an empty page. It is not security. Anyone can edit client state.
Never move a check here to "save a round trip", and never trust a value this app computed
about money.

---

## Working with the API

Types are **generated from the backend's OpenAPI document, never hand-written**:

```bash
npm run api:sync      # fetches openapi.json, regenerates src/app/core/api/generated/
```

Generated files are committed, and **CI fails if regenerating produces a diff** — so this
app can't silently drift from what the server actually returns. Run it after any backend
change. See [docs/api-client.md](./docs/api-client.md) and
[ADR-0004](./docs/adr/0004-generated-api-client.md).

---

## Contributing

Read [CONTRIBUTING.md](./CONTRIBUTING.md) — branching, Conventional Commits, the PR flow and
the review bar. Work is tracked on the shared project board; start with anything in the
**M0 Foundation** milestone.

AI coding agents should read [AGENTS.md](./AGENTS.md).

## Security

Found a vulnerability? See [SECURITY.md](./SECURITY.md) — please don't open a public issue.
