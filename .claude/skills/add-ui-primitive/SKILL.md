---
name: add-ui-primitive
description: Create a reusable dumb component in Zentro Web's shared/ui - design tokens, accessibility, inputs and outputs, and a spec - following this repo's conventions. Use when a UI pattern is repeated and should become a shared primitive.
---

# Add a shared UI primitive

## 1. Should this exist yet?

A pattern earns a primitive on its **third** use. The first is premature — you're
generalizing from one example and will guess wrong. The tenth is too late.

Check `shared/ui/` first; something close may already exist and want an input rather than a
sibling.

**It does not belong in `shared/ui/` if it injects a service or knows anything about
Zentro's domain.** A `<z-money>` renders an amount; it must not know what an expense is.
Domain-aware components live in `features/<area>/components/`.

## 2. The shape

```
shared/ui/<name>/
├── <name>.ts
├── <name>.html      (inline template is fine under ~15 lines)
└── <name>.spec.ts
```

```ts
@Component({
  selector: 'z-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span [class]="classes()">
      <ng-content />
    </span>
  `,
})
export class Badge {
  readonly variant = input<'neutral' | 'positive' | 'negative'>('neutral');

  protected readonly classes = computed(
    () => `inline-flex items-center rounded px-2 py-0.5 text-sm ${VARIANTS[this.variant()]}`,
  );
}
```

- **Inputs and outputs only. Inject nothing.** That's what makes it reusable and trivially
  testable.
- `input()` / `output()` signal APIs, not the old decorators.
- `OnPush`, standalone, `z-` prefix — all lint-enforced.
- Use `<ng-content>` for content rather than a `text` input where you can; it composes better.

## 3. Tokens, not colors

```ts
// Wrong: invisible to the theme, breaks in dark mode, unfindable later
const VARIANTS = { positive: 'bg-[#dcfce7] text-[#166534]' };

// Right
const VARIANTS = { positive: 'bg-positive-subtle text-positive' };
```

If the token you need doesn't exist, **add a semantic token** to the `@theme` block in
`src/styles.css` — don't reach for a primitive color or a raw hex. See
[docs/styling.md](../../../docs/styling.md).

## 4. Accessibility is the primitive's job

Getting this right once here means every feature gets it for free — which is the main reason
shared primitives are worth having.

- Interactive? Use the real element: `<button>`, `<input>`, `<a>`. Not a styled `<div>`.
- Expose an input for the accessible name where the content doesn't provide one, and make it
  `input.required()` if the component is meaningless without it.
- **Never remove a focus ring** without replacing it with something at least as visible.
- Touch targets at least 44×44px.
- Modal-like primitives: trap focus, restore it on close, close on Escape.
- **Never convey meaning by color alone** — pair it with text or an icon.

## 5. Test

Test the rendered output and the interaction, not the implementation. Query by role and
accessible name so an accessibility regression fails the build:

```ts
// Good — fails if the button loses its accessible name, which is a real bug
el.querySelector('button[aria-label="Dismiss"]');

// Bad — passes even if the button is unreachable and unnamed
el.querySelector('.dismiss');
```

Cover each variant and each state (disabled, loading, error) the component supports.

## 6. Verify

```bash
npm run lint && npm run typecheck && npm test
```

Then check it in dark mode, at 375px wide, and with the mouse unplugged.

## Reference

- [docs/styling.md](../../../docs/styling.md) — tokens, scales, dark mode
- [docs/accessibility.md](../../../docs/accessibility.md) — the baseline
- [docs/conventions.md](../../../docs/conventions.md) — smart vs dumb, naming
