# GitHub Copilot instructions

The instructions for this repository live in **[`AGENTS.md`](../AGENTS.md)** at the repo
root. Read that file — it is the single source of truth for every AI tool used here, so
there is nothing to keep in sync.

Two things that catch people out and produce no error message:

- The app is **zoneless**. State a template reads must be a `signal`; a plain class property
  will not re-render and nothing will warn you.
- Colors and spacing come from **Tailwind theme tokens**, never raw hex. A raw color is
  invisible to the theme and breaks in dark mode. See
  [`docs/styling.md`](../docs/styling.md).
