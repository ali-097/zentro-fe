---
name: ui-review
description: Audit a Zentro Web diff before opening a PR - checks accessibility, design token usage, signals and zoneless correctness, layering, view states and money handling against this repo's conventions. Use before requesting review.
---

# Review a UI change

Audit the diff (`git diff main...HEAD`) against the checks below. Report findings ordered by
severity with file, line, and what specifically breaks. Skip style — the linter covers it.

## Blocking

### Accessibility

Most of this app's real defects live here, and they pass a visual review perfectly.

- **Actions are `<button>`, navigation is `<a>`.** A `<div>` or `<a>` with `(click)` is not
  keyboard-focusable and is announced wrongly. Adding `tabindex` and a keydown handler means
  you wanted a `<button>`.
- Every interactive element has an accessible name. Icon-only buttons need `aria-label`;
  their icon needs `aria-hidden="true"`.
- Every input has a `<label>` or `aria-label`. **A placeholder is not a label** — it
  disappears the moment typing starts.
- No `outline: none` without an at-least-as-visible replacement.
- Modals trap focus, restore it to the trigger on close, and close on Escape.
- Images have `alt` (or `alt=""` if decorative).
- One `<h1>` per page; heading levels not skipped.

### Design tokens

- **No raw hex, no `rgb()`, no arbitrary `[...]` values.** A raw color is invisible to the
  theme, survives a palette change, and breaks in dark mode.
- Spacing comes from the scale. `p-[13px]` means the design is wrong, not the scale.
- Anything new checked in dark mode and at 375px wide.

### Signals and zoneless

- **Anything a template reads is a signal.** A plain class property will not re-render and
  **nothing warns you** — this is the single most confusing failure mode in this codebase.
- Derived values are `computed()`, never a stored duplicate kept in sync by hand.
- No function calls in templates that do work — template expressions run on every check.
- Components are `OnPush`.

### Money

- **No arithmetic on amounts.** No summing, dividing, converting, or `/100`. The API
  computes; this app formats.
- Formatted through the shared money pipe, which handles per-currency exponents.
- **Balance sign is not conveyed by color alone** — red/green is the most common
  color-blindness pair and it's exactly what "you owe" / "you are owed" uses.
- Amounts use `tabular-nums` so columns don't jitter.

### Security

- **No token in `localStorage` or `sessionStorage`.** Memory only.
- No `bypassSecurityTrust*` or `innerHTML` with user content.
- No secret, key or credential in the source — the bundle is public.

## Important

### Layering

- Imports go `features → shared → core`. **No feature imports another feature.**
- No `shared/` component injects a service. If it needs one, it isn't shared.
- Nothing in `core/` or `shared/` reaches up into `features/`.

### View states

- All four handled: loading, **empty**, error, loaded. Empty is the most-skipped and the
  first thing a new user sees — a blank screen reads as a broken app.
- Error states say what the user can do, not just "Something went wrong".
- `@for` has `track`; without it Angular re-creates every node and the list flickers.

### API

- No hand-written interface mirroring a response — types come from `core/api/generated/`.
- Nothing under `generated/` hand-edited.
- No `any`-cast around a generated type error; that error means the server changed.
- Errors branch on the envelope's `type`, never on `detail` prose.

### Tests

- The four states covered.
- Queried by role and accessible name, not CSS class — so a11y regressions fail the build.
- Testing rendered behaviour, not "called the service once".

## Worth mentioning

- A pattern now on its third use that should become a `shared/ui` primitive.
- Anything that took real thought and has no comment explaining *why*.
- A decision that should be an ADR.

## Output

For each finding: **severity · file:line · what is wrong · what the user experiences.** If
nothing blocking is found, say so plainly rather than inventing findings — a review that
always produces results teaches people to ignore it.
