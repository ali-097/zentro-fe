# ADR-0001: Drop SSR, ship a client-rendered SPA

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

The project was scaffolded with `ng new --ssr`, so `@angular/ssr`, `server.ts`,
`main.server.ts`, `app.config.server.ts` and prerendering were all present — by CLI default,
not by decision.

Zentro is an authenticated app. Every screen that matters — groups, expenses, balances,
settle-up — sits behind a login. There is no public content to index and no anonymous
first-paint to optimize.

Meanwhile SSR imposes a continuous cost on an app shaped like this one:

- It fights **httpOnly cookie auth**: the server render has no user session unless cookies
  are forwarded and the token exchange is replicated server-side.
- It fights **browser-only APIs** — `localStorage`, `window`, `document` — requiring
  `isPlatformBrowser` guards scattered through auth, storage and layout code.
- It requires a **Node server in production**, rather than static files on any CDN.
- It doubles the execution environments every bug must be reasoned about in.

That cost is paid on every feature, forever, in exchange for a benefit this app cannot use.

## Decision

**Remove SSR. Ship a client-rendered SPA.**

- Delete `src/server.ts`, `src/main.server.ts`, `src/app/app.config.server.ts`,
  `src/app/app.routes.server.ts`
- Remove `@angular/ssr` and the `server` / `outputMode` / `ssr` keys from `angular.json`
- Replace `provideClientHydration(withEventReplay())` in `app.config.ts`
- Deploy the built bundle as static files with an SPA fallback rewrite

Taken together with the move to zoneless, this is a single small change now and a large one
later.

## Consequences

**Good**
- Auth is straightforward: one execution environment, no cookie forwarding, no session
  replication.
- No `isPlatformBrowser` guards.
- Deploys as static files to any CDN — no Node process, no server to scale or patch.
- One environment to reason about, test and debug.
- Smaller dependency surface.

**Bad**
- Slower first contentful paint on a cold load: the user waits for the JS bundle. Mitigated
  by lazy-loaded routes, bundle budgets in CI, and skeleton loading states.
- No SEO. Correct for the app, but a future public marketing page cannot live in this
  project — it would be a separate static site.
- No no-JS fallback. Acceptable for an interactive financial tool.

**Neutral**
- Prerendering could be reintroduced for a small set of public routes later if one ever
  exists, without reversing this decision.

## Alternatives considered

**Keep SSR.** Rejected: continuous complexity for a benefit an authenticated app cannot
realize.

**Keep it and decide later.** Rejected as the worst option. Every feature built in the
interim inherits the SSR constraints, and the eventual removal gets larger and riskier the
longer it waits. The app is nearly empty today, so now is the cheapest this change will ever
be.

**SSR only for public routes.** There are no public routes.

## When to revisit

If Zentro grows genuinely public, indexable content — shared expense summaries, a public
group view, a marketing surface that must live in this app.
