# Styling & design tokens

Tailwind v4 with a `@theme` token layer defined in `src/styles.css`.

## The rule

**Components use semantic tokens. Never a raw hex value, never an arbitrary value.**

```html
<!-- Wrong: invisible to the theme, survives a palette change, breaks in dark mode -->
<div class="bg-[#3b82f6] text-[#fff] p-[13px]">

<!-- Right -->
<div class="bg-brand text-on-brand p-3">
```

A raw color in a component is unreachable by the theme. It won't respond to dark mode, it
won't change when the palette does, and there is no way to find every instance later. Tokens
are what make a coherent redesign possible at all.

Raw hex in a component is a **review-blocking** finding.

## Token layers

Two levels, deliberately. Primitives are the palette; semantic tokens are what components
actually use.

```css
@theme {
  /* ── Primitives — the raw palette. Components never reference these. ── */
  --color-slate-50:  #f8fafc;
  --color-slate-900: #0f172a;
  --color-blue-500:  #3b82f6;
  --color-green-500: #22c55e;
  --color-red-500:   #ef4444;

  /* ── Semantic — what components use. These are the API. ── */
  --color-surface:      var(--color-white);      /* page background */
  --color-surface-sunken: var(--color-slate-50); /* cards, wells */
  --color-border:       var(--color-slate-200);
  --color-text:         var(--color-slate-900);
  --color-text-muted:   var(--color-slate-500);
  --color-brand:        var(--color-blue-500);
  --color-on-brand:     var(--color-white);

  /* Money has meaning — never just "green" and "red" */
  --color-positive:     var(--color-green-600);  /* you are owed */
  --color-negative:     var(--color-red-600);    /* you owe */
}
```

Adding a semantic token is normal and expected. Adding a primitive should be rare — if you
need a color the palette doesn't have, that's a design decision, not an implementation
detail.

## Dark mode

Redefine **only the semantic tokens**. Primitives never change; what they *mean* does.

```css
@media (prefers-color-scheme: dark) {
  :root:not([data-theme='light']) {
    --color-surface:        var(--color-slate-900);
    --color-surface-sunken: var(--color-slate-800);
    --color-border:         var(--color-slate-700);
    --color-text:           var(--color-slate-50);
    --color-text-muted:     var(--color-slate-400);
  }
}
:root[data-theme='dark'] { /* same overrides, so an explicit toggle wins */ }
```

Because components only ever reference semantic tokens, dark mode requires **no component
changes at all**. That is the entire payoff of the two-layer split.

## Money colors

Green and red carry meaning here, so they get their own tokens and two rules:

1. **Never color alone.** Roughly 1 in 12 men has some form of color blindness, and
   red/green is the common case — exactly the pair we're using for "you owe" and "you are
   owed". Always pair with a sign, a word, or an icon: `+£12.30 you are owed`.
2. **Zero is neutral.** A settled balance is `text-muted`, not green. Green means "you are
   owed"; a zero balance means nothing is outstanding.

## Spacing and type

Use Tailwind's scale. Don't invent values.

- Spacing: `p-2 p-3 p-4 p-6 p-8`. If you need `p-[13px]`, the design is wrong, not the scale.
- Type: `text-sm` body, `text-base` emphasis, `text-lg`/`text-xl` headings.
- **Amounts use tabular numerals** (`tabular-nums`). Without it, digits shift width and a
  column of figures visibly jitters — the most obvious tell of an unpolished finance UI.

## Components

- Layout via flex/grid utilities. No fixed pixel widths.
- Mobile first. Splitting a bill happens at a restaurant table, on a phone — the narrow
  layout is the primary one, not an afterthought.
- Interactive elements need `hover:`, `focus-visible:` and `disabled:` states. **Never remove
  a focus ring** without replacing it with something at least as visible.
- Touch targets are at least 44×44px.
- A repeated pattern earns a `shared/ui/` primitive on its **third** use — not the first
  (premature) and not the tenth (too late).

## Global CSS

`src/styles.css` holds the `@theme` block, a small reset, and nothing else. Component styles
belong in the component. If you're reaching for a global style, you probably want a token or
a `shared/ui/` primitive instead.
