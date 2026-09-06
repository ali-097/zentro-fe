<!--
Keep it small. A 200-line PR gets a real review; a 2,000-line PR gets a rubber stamp.
-->

## What and why

<!-- What changed, and what problem it solves. The diff shows the what — explain the why. -->

Closes #

## How I tested it

<!--
Not "CI passed". What did you actually click through? Which states did you exercise?
-->

## Screenshots

<!-- Any visual change: light AND dark, mobile AND desktop. -->

## Checklist

- [ ] `npm run lint && npm run typecheck && npm test` pass locally
- [ ] Tests added for the behaviour this changes

### If this adds or changes UI

- [ ] **Keyboard reachable** — tabbed through it with the mouse unplugged, focus always visible
- [ ] Interactive elements have accessible names (icon-only buttons have `aria-label`)
- [ ] Actions use `<button>`, navigation uses `<a>`
- [ ] **Colors come from theme tokens** — no raw hex, no arbitrary `[...]` values
- [ ] Works in dark mode
- [ ] Works at 375px wide
- [ ] All four states handled: loading, **empty**, error, loaded

### If this touches state

- [ ] Anything a template reads is a signal (the app is zoneless — a plain property fails silently)
- [ ] Derived values are `computed()`, not stored duplicates
- [ ] Local UI state stayed in the component rather than moving into a store

### If this touches money

- [ ] No arithmetic on amounts — the server computes, we format
- [ ] Formatted through the shared money pipe
- [ ] Balance sign conveyed by text or icon, **not by color alone**

### If this touches the API

- [ ] `npm run api:sync` run and the result committed
- [ ] No hand-written interface mirroring a response
- [ ] Paired backend issue linked below

Paired backend issue:

### If this is a decision

- [ ] ADR added in `docs/adr/`, linked here

## Notes for the reviewer

<!-- Anything you're unsure about, or want a second opinion on. -->
