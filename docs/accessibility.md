# Accessibility

The baseline every screen meets. These are **review-blocking**, not polish.

Zentro is a money app used on a phone, often one-handed, often in a noisy restaurant. The
things that help someone using a screen reader are the same things that make it usable when
you're distracted and in a hurry.

## Keyboard

**Every interactive element must be reachable and operable by keyboard.** No exceptions.

- Use `<button>` and `<a>` for things that do something. A `<div>` with a `(click)` is not
  focusable, not announced, and doesn't respond to Enter or Space. If you catch yourself
  adding `tabindex` and a keydown handler to a `<div>`, you wanted a `<button>`.
- `<a>` navigates. `<button>` acts. Getting this backwards breaks middle-click, "open in new
  tab", and screen-reader expectations.
- Tab order follows visual order. Never use positive `tabindex`.
- **Never remove a focus ring** without replacing it with something at least as visible.
  `outline: none` with no replacement makes the app unusable by keyboard.
- Modals trap focus while open, restore focus to the trigger on close, and close on Escape.

## Names

Everything interactive needs an accessible name.

```html
<!-- Nothing to announce: "button" -->
<button (click)="delete()"><svg>…</svg></button>

<!-- Named -->
<button (click)="delete()" aria-label="Delete expense"><svg aria-hidden="true">…</svg></button>
```

- Icon-only buttons need `aria-label`; their icon needs `aria-hidden="true"`.
- Every input has a `<label>`, or `aria-label` where a visible label genuinely doesn't fit.
  Placeholder text is **not** a label — it disappears when typing starts.
- Images need `alt`; decorative ones get `alt=""`.

## Money and screen readers

The one place this app needs specific care.

- **Never convey a balance by color alone.** Red/green is the most common color-blindness
  pair, and it's exactly what "you owe" / "you are owed" uses. Always add a sign, a word or
  an icon: `+£12.30 · you are owed`.
- Amounts need an accessible form that reads correctly. `£12.30` renders fine; a bare `1230`
  or a currency glyph without context does not.
- Balance changes after an action should be announced via a live region — otherwise a screen
  reader user gets no confirmation that settling up did anything.

## Structure

- One `<h1>` per page. Don't skip heading levels — screen reader users navigate by them.
- Use `<nav>`, `<main>`, `<header>`. A page of `<div>`s has no landmarks to jump between.
- Lists are `<ul>`/`<li>`. Tables are `<table>` with `<th scope>`.

## Forms

- Errors are announced, not just colored. Associate them with `aria-describedby` and mark the
  field `aria-invalid`.
- Never rely on a disabled submit button as the only feedback — it leaves the user with no
  idea what's wrong. Say what's wrong.
- Don't validate destructively while typing. Validate on blur, clear errors as they're fixed.

## Motion and contrast

- Respect `prefers-reduced-motion`. Vestibular disorders are real and animation can cause
  actual nausea.
- Text meets WCAG AA: **4.5:1** for body, **3:1** for large text. The theme tokens are chosen
  to satisfy this — another reason not to use raw hex.
- Never rely on hover alone to reveal information. Touch devices have no hover.

## Checking your work

Before opening a PR:

1. **Unplug the mouse.** Tab through the whole screen. Can you reach and operate everything?
   Can you see where focus is at all times?
2. **Zoom to 200%.** Does anything overlap or get cut off?
3. Run the browser's built-in accessibility audit (Lighthouse or the a11y panel).

Automated tools catch roughly a third of real problems. The keyboard pass catches most of
the rest, and it takes about a minute.
