# CLAUDE.md

@AGENTS.md

Everything below is Claude Code specific; the import above is the shared ruleset.

## Skills

Invoke rather than scaffolding by hand — each encodes the conventions in `docs/`, and loads
only when called:

- `/add-feature-page` — a new routed screen: feature folder, component, store, route, tests
- `/add-ui-primitive` — a `shared/ui` component with tokens, a11y and a spec
- `/sync-api-types` — regenerate the API client after a backend change
- `/ui-review` — audit your diff for a11y, tokens, signals and layering before a PR

## Working here

- **Check `docs/styling.md` before writing any color or spacing value.** Raw hex in a
  component is a review-blocking finding; everything comes from theme tokens.
- `npm run typecheck` beats a full build for checking your work.
- The API must be running on `:3000` for anything data-driven. If requests fail with CORS or
  connection errors, start the backend before debugging the frontend.
- Angular 20 is **zoneless**: state changes must go through signals. A plain class property
  mutated outside a signal will not re-render, and it fails silently.
