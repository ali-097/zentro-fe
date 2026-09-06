# Contributing to Zentro Web

## Getting set up

See the [Quickstart](./README.md#quickstart) and, if anything misbehaves,
[docs/runbooks/local-dev.md](./docs/runbooks/local-dev.md).

## Picking work

All work lives on the shared **Zentro project board**, which spans this repo and
[zentro-be](https://github.com/ali-097/zentro-be).

- Anything in the **M0 Foundation** milestone comes first. It is all `priority:P0` and it
  blocks feature work — M1+ issues assume the restructure, the HTTP layer and the generated
  API client have landed.
- Filter by `good-first-issue` if you're new to the codebase.
- Assign yourself before starting, and move the card to **In progress**. If you stop working
  on something, unassign — a stale assignment is worse than an empty one.

## Branching

Branch from `main`. `main` is protected: no direct pushes, PR + 1 approval + green CI.

```
feat/31-group-list-screen      # feature, with the issue number
fix/44-money-pipe-jpy          # bug fix
chore/eslint-boundaries        # tooling, docs, dependencies
spike/vitest-migration         # timeboxed investigation, not meant to merge as-is
```

## Commits

[Conventional Commits](https://www.conventionalcommits.org/). `commitlint` enforces this on
commit, so a malformed message fails immediately rather than in CI.

```
feat(groups): add group list screen
fix(money): format JPY without decimals
chore(deps): bump angular to 20.3
docs(adr): record the zoneless decision
refactor(core): move auth guard into core/auth
test(expenses): cover the empty state
```

Scope is the feature or layer. Write the message for someone reading `git log` in a year —
the *what* is in the diff, put the *why* in the body.

## Pull requests

Fill in the template — it isn't ceremony, it's the review checklist:

1. **What and why**, linked to the issue (`Closes #31`).
2. **How you tested it.** "CI passed" is not testing.
3. **Screenshots** for any visual change — light *and* dark, mobile *and* desktop.
4. **Paired backend issue** linked if this depends on an API change.

Keep PRs small. A 200-line PR gets a real review; a 2,000-line PR gets a rubber stamp, and
that is how bugs reach `main`.

Before requesting review:

```bash
npm run lint && npm run typecheck && npm test
```

## The review bar

A reviewer is checking:

- **Accessibility.** Keyboard-reachable, accessible names on interactive elements, focus
  visible. This is blocking, not polish — see
  [docs/accessibility.md](./docs/accessibility.md).
- **Design tokens.** No raw hex, no arbitrary values. A raw color is invisible to the theme
  and breaks in dark mode.
- **Signals.** State a template reads is a signal; derived values are `computed()`. The app
  is zoneless, so a plain property **fails silently**.
- **Layering.** `features → shared → core`, one direction. No feature imports another. No
  service injected into a `shared/` component.
- **All four states** handled — loading, empty, error, loaded. Empty is the most-skipped and
  the first thing a new user sees.
- **No money arithmetic.** The server computes; we format.
- **No hand-written API types.** They come from `core/api/generated/`.

Approve when you'd be comfortable being paged for it. Request changes plainly and say why.

## Architecture decisions

Anything that would make a new engineer ask *"why is it like this?"* gets an ADR in
[docs/adr/](./docs/adr/). Copy `0000-template.md`, take the next number, link it from the PR.
This includes reversing an existing decision — supersede the old ADR rather than editing it,
so the reasoning stays readable.

Adding a dependency counts as a decision. Say what it replaces and what it costs — in bundle
size as well as complexity.

## Documentation

Docs live next to the code and are part of the change, not a follow-up:

- New design token → [docs/styling.md](./docs/styling.md)
- New state pattern → [docs/state.md](./docs/state.md)
- New setup step → [docs/runbooks/local-dev.md](./docs/runbooks/local-dev.md)
- Backend shape changed → run `npm run api:sync` and commit the result

If following the README from a clean clone doesn't work, that's a bug — file it.

## Using AI agents

Read [AGENTS.md](./AGENTS.md) — it carries the rules that cause real bugs when broken. You
own what you submit; "the agent wrote it" is not a defence in review. Pay particular
attention to generated markup that uses `<div>` where a `<button>` belongs, raw hex colors,
and plain properties where a signal is required.
