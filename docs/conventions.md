# Code conventions

Not style preferences — Prettier and ESLint handle those. These are the conventions a linter
can't enforce.

## Naming

| Thing | Convention | Example |
|---|---|---|
| Files | kebab-case | `group-detail.ts` |
| Components | PascalCase class, `z-` prefixed selector | `class GroupCard`, `<z-group-card>` |
| Stores / services | `<name>.store.ts`, `<name>.service.ts` | `groups.store.ts` |
| Signals | Name the value, not the mechanism | `groups`, not `groupsSignal` |
| Booleans | A predicate | `isLoading`, `hasMembers` |
| Outputs | An event that happened, no `on` prefix | `saved`, `dismissed` |
| Money in the UI | Keep `Minor` in the variable name | `amountMinor` |

## Components

- **Standalone always.** No NgModules.
- **`OnPush` always.** The app is zoneless; this is not optional.
- Prefer `inject()` over constructor parameters — shorter, and works in functions.
- **Templates stay dumb.** No function calls in a template that do work; use a `computed()`.
  A template expression runs on every check.
- Keep templates in a `.html` file once they exceed a handful of lines.
- One component per file.

```ts
@Component({
  selector: 'z-group-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './group-card.html',
})
export class GroupCard {
  readonly group = input.required<GroupResponse>();
  readonly selected = output<string>();
}
```

## Smart vs dumb

- **Smart** (`features/`): injects services, fetches data, owns state, is routed.
- **Dumb** (`shared/ui/`): inputs and outputs only. **Injects nothing.** Knows nothing about
  Zentro's domain — a `<z-money>` renders an amount without knowing what an expense is.

If a `shared/` component needs a service, it's in the wrong place.

## State

Covered fully in [state.md](./state.md). The short version:

- Signals for anything a template reads. Zoneless has no other mechanism, and a plain
  property fails **silently**.
- `computed()` for anything derived — never a stored duplicate.
- Local UI state stays in the component.

## Money

- **Never do arithmetic on an amount.** The server computes; we format.
- Never parse an amount into a float.
- Format only through the shared money pipe — it handles per-currency exponents.
- Amounts render with `tabular-nums` so columns don't jitter.
- Never signal a balance by color alone (see [accessibility.md](./accessibility.md)).

## TypeScript

- `strict` is on and stays on.
- **No `any`.** `unknown` plus narrowing where a type is genuinely unknown.
- No non-null assertions (`!`) to silence the compiler — if it might be null, handle it.
- Types for API data come from `core/api/generated/`. **Never hand-write an interface
  mirroring a response.**
- `readonly` for inputs, outputs and injected dependencies.

## RxJS

Signals are the default. Reach for RxJS when you need what it's actually good at — debouncing
a search box, combining event streams, cancellation.

- Always unsubscribe: `takeUntilDestroyed()`.
- Never `subscribe()` inside another `subscribe()`. Use `switchMap`.
- Never `.subscribe()` just to assign a value. `toSignal()` instead.

## Templates

- New control flow: `@if`, `@for`, `@switch`. Not `*ngIf`/`*ngFor`.
- `@for` requires `track`. Without it, Angular re-creates every DOM node on each change and
  the list visibly flickers.
- **Always write the `@empty` block.** The empty state is the first thing a new user sees,
  and a blank screen reads as a broken app.
- Semantic elements over `<div>` — see [accessibility.md](./accessibility.md).

## Tests

- Name the behaviour: `it('shows an empty state when the user has no groups')`, not
  `it('works')`.
- Test what the user sees — rendered output and interactions — not implementation detail.
  Asserting "called the service once" breaks on every refactor and proves nothing.
- Mock at the HTTP boundary with `HttpTestingController`. Don't mock your own stores.
- Every component with a loading, empty or error state has a test for each.

## Comments

Comment the **why**, never the what.

```ts
// Bad — restates the code
// set loading to true
this.isLoading.set(true);

// Good — records something the code cannot express
// Refetch rather than patching locally: the server recalculates the group balance
// on write, and a patched value would disagree with it until the next full load.
this.groups.reload();
```

Anything that made you pause for thirty seconds deserves a comment. Anything that took an
afternoon deserves an ADR.
