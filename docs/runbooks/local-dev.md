# Runbook — local development

From nothing to a running app, plus fixes for what commonly goes wrong.

## Prerequisites

| | Version | Check |
|---|---|---|
| Node | 22 (see `.nvmrc`) | `node --version` |
| npm | 10+ | `npm --version` |

With `nvm`: `nvm use` picks up `.nvmrc` automatically.

## First run

```bash
git clone https://github.com/ali-097/zentro-fe.git
cd zentro-fe

npm ci        # ci, not install — respects the lockfile exactly
npm start     # http://localhost:4200
```

For anything data-driven, the API must also be running. In a
[zentro-be](https://github.com/ali-097/zentro-be) checkout:

```bash
docker compose up -d db
npm run start:dev            # http://localhost:3000
```

Seeded accounts (development only, password `Password123!`):
`alice@zentro.test`, `bob@zentro.test`, `carol@zentro.test`.

## Everyday commands

```bash
npm start                # dev server, hot reload
npm run lint             # check only; lint:fix to autofix
npm run typecheck        # fastest correctness check
npm test                 # unit tests, headless
npm run build            # production build — enforces bundle budgets
npm run api:sync         # regenerate API types after a backend change
```

---

## Troubleshooting

### Port 4200 is in use

```bash
npm start -- --port 4300
```

Or free it:

```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID <pid> /F

# macOS / Linux
lsof -ti:4200 | xargs kill -9
```

### Requests fail with CORS errors

The API isn't running, or it's on a different port. Start zentro-be on `:3000` — that origin
is already in its CORS allowlist.

If the API *is* running, check the backend's `CORS_ORIGINS` includes
`http://localhost:4200`. A wildcard will **not** work: this app sends credentials, and
browsers reject `Access-Control-Allow-Origin: *` on credentialed requests. That's deliberate.

### Logged out on every refresh

Expected during M0 — the current mock `AuthService` is `localStorage`-based and is being
replaced.

Once the real auth lands: the access token lives in memory by design, and the app restores
the session on boot by calling the refresh endpoint with the httpOnly cookie. If that isn't
working, check that requests send `withCredentials` and that the API set the cookie at all
(look for `Set-Cookie` on the login response in devtools).

### A component isn't updating

**Check this before anything else.** The app is zoneless, so change detection runs on signal
changes only:

```ts
groups: Group[] = [];        // will never re-render, and never warns
groups = signal<Group[]>([]); // will
```

There is no error for the first form. It silently does nothing.

### `npm run api:sync` fails

Either the backend hasn't published `openapi.json` yet (true until the M0 Swagger issue
lands), or you're offline. It fetches from the zentro-be repo on GitHub — it does not need
the API running locally.

### CI says API types are stale

Someone changed the backend. Run `npm run api:sync` and commit the result. Don't hand-edit
files under `core/api/generated/` — the next sync discards your change, and in the meantime
it hides a real mismatch.

### Build fails on bundle budgets

A dependency or a non-lazy import pushed the initial bundle over the limit. Check that every
route uses `loadComponent`, and that you haven't imported something heavy into `core/` that
only one feature needs. Raising the budget is a last resort and needs a reason in the PR.

### Everything is inexplicably broken

```bash
rm -rf node_modules .angular/cache && npm ci
```

The Angular build cache is the usual culprit after a branch switch.

---

## Something not covered here?

That's a documentation bug. Once you've solved it, add it to this file in your next PR — the
next person will hit the same thing.
