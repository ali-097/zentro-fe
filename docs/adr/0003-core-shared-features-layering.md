# ADR-0003: `core` / `shared` / `features` layering, enforced by lint

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

The app was organised as a flat `pages/`, `services/`, `guards/` — grouping by *technical
kind* rather than by *domain*. That works at six files and stops working well before sixty:
everything related to groups ends up scattered across four folders, and nothing constrains
what may import what.

Zentro's v1 scope is large — auth, groups, invites, expenses with four split types,
settlements, activity, receipts, multi-currency, friends. Left flat, it becomes hard to
navigate quickly and impossible to reason about in pieces.

## Decision

Three layers, with a **one-directional** dependency rule:

```
features/  ──▶  shared/  ──▶  core/
```

| Layer | Contains | Constraint |
|---|---|---|
| `core/` | Singletons: auth, interceptors, generated API client, config, shell | Imports nothing above it |
| `shared/` | Dumb reusable pieces: `ui/`, pipes, directives, pure utils | **Injects no services** |
| `features/` | One folder per domain area, each owning its routes, store, screens | **Never imports another feature** |

**Enforced by ESLint** (`no-restricted-imports`), not by convention alone.

## Consequences

**Good**
- Everything about groups is in `features/groups/`. Onboarding is "read one folder".
- Feature routes live in the feature, so adding a screen doesn't touch a shared file and two
  people adding screens don't conflict.
- The no-feature-to-feature rule keeps the import graph a tree. Any feature can be understood,
  changed or deleted alone.
- `shared/` injecting nothing keeps UI primitives genuinely reusable and trivially testable.
- Lazy loading falls out naturally — each feature is a chunk.

**Bad**
- Deeper nesting; more clicks to a file.
- Requires judgment: does this belong in `shared/` or the feature? The rule of thumb is the
  third use, and being wrong occasionally is fine.
- Genuinely cross-feature state has to go in `core/`, which risks becoming a dumping ground.
  Watched in review.
- The lint rule occasionally blocks a legitimate-looking shortcut. That's the rule working —
  the fix is to move the shared thing down a layer, not to add an exception.

**Neutral**
- Migrating the existing `pages/` layout is an M0 task. Small now; large later.

## Alternatives considered

**Keep the flat `pages/` layout.** Fine for a prototype. Rejected: it does not survive the
v1 scope, and restructuring later means touching every file — much cheaper now, while the app
is nearly empty.

**Feature folders without lint enforcement.** Same structure, convention only. Rejected
because this specific boundary erodes silently: one feature-to-feature import looks harmless
and is never the last one. Automated enforcement costs one config block.

**Nx with enforced module boundaries.** Stronger tooling and better-defined boundaries.
Rejected as disproportionate — a whole build system and a new mental model for one
application.

## When to revisit

If `core/` accumulates feature-specific state, or if the lint rule is being suppressed
regularly — both are signals that the layer split doesn't match how the app actually works.
