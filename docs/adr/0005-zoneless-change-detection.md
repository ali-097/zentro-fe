# ADR-0005: Zoneless change detection

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

The app was scaffolded with `provideZoneChangeDetection({ eventCoalescing: true })` and
`zone.js` — the Angular default.

Zone.js works by monkey-patching every asynchronous browser API (`setTimeout`, `Promise`,
`addEventListener`, `XMLHttpRequest`) so Angular knows when *something* happened and can
check the whole component tree. It is effective and entirely implicit: change detection runs
constantly, for reasons that are hard to see, and the fix for performance problems is
`OnPush` plus manual `markForCheck()` calls.

Angular 20 supports zoneless change detection as a stable option, driven by signals.

We are already committed to signals as the state mechanism ([ADR-0002](./0002-signals-over-ngrx.md)),
which is the prerequisite.

## Decision

**Adopt zoneless change detection.** Replace `provideZoneChangeDetection` with
`provideZonelessChangeDetection()` and remove `zone.js` from polyfills and dependencies.

All components are `OnPush`. All state a template reads is a signal.

Done in M0, alongside the SSR removal — both touch the same configuration files, and both get
dramatically more expensive once there are real screens.

## Consequences

**Good**
- No monkey-patching of browser globals. Stack traces are real; async debugging is normal.
- Change detection runs when a signal changes, not on every stray timer or event. Less work,
  and *predictable* work.
- ~13KB less JavaScript.
- Third-party libraries that break under Zone patching just work.
- Aligns with where Angular is going, so we won't migrate later.

**Bad**
- **The failure mode is silent.** A plain class property mutated outside a signal will not
  re-render, with no warning and nothing in the console. This is the single most confusing
  bug a newcomer will hit here, and it is why it is called out in `AGENTS.md`,
  `docs/state.md` and the local-dev runbook.
- Tests must trigger change detection explicitly after a signal change.
- Any library that assumed Zone-driven detection needs its updates wrapped in a signal.

**Neutral**
- `OnPush` everywhere becomes mandatory rather than a best practice. We wanted that anyway.

## Alternatives considered

**Keep Zone.js.** The safer default, and no silent-failure footgun. Rejected because we are
building on signals regardless, which makes Zone pure overhead — and because migrating later
means auditing every component instead of writing one line of config today.

**Adopt it later.** Rejected for the same reason as SSR removal: the app is nearly empty, so
this is the cheapest the change will ever be. Every component written under Zone would need
re-auditing.

## When to revisit

If a dependency we genuinely need turns out to be incompatible and cannot be wrapped. Nothing
in the current or planned stack is.
