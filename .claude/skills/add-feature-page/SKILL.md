---
name: add-feature-page
description: Scaffold a new routed screen in Zentro Web - feature folder, standalone OnPush component, store, service, route and spec - following this repo's layering, state and accessibility conventions. Use when adding any new page or screen.
---

# Add a feature page

## 1. Establish the shape first

- **Which feature does it belong to?** `auth`, `groups`, `expenses`, `settlements`,
  `activity`, `friends`, `profile`. If it doesn't fit one, that's a new feature folder —
  which is a bigger decision than it looks.
- **Route and guard.** Does it need `authGuard`? (Remember: guards are UX, not security —
  the API is the authority.)
- **What data does it need?** Which endpoint, and does the generated client already have it?

## 2. Create the folder

```
features/<area>/<screen-name>/
├── <screen-name>.ts        Smart component — injects the store, routed
├── <screen-name>.html
└── <screen-name>.spec.ts
```

If the feature has no store yet, add `features/<area>/<area>.store.ts` and
`features/<area>/<area>.service.ts` alongside.

## 3. The component

```ts
@Component({
  selector: 'z-group-list',
  imports: [RouterLink, MoneyPipe],
  templateUrl: './group-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupList {
  protected readonly store = inject(GroupsStore);
}
```

- `z-` selector prefix, `OnPush`, standalone, `inject()` over constructor injection. All
  three are lint-enforced.
- **Import only from `shared/` and `core/`. Never from another feature** — ESLint blocks it.

## 4. The route

In the feature's own `.routes.ts`, not the global one — so adding a screen doesn't touch a
shared file:

```ts
export const groupsRoutes: Routes = [
  {
    path: 'groups',
    loadComponent: () => import('./group-list/group-list').then((m) => m.GroupList),
    canActivate: [authGuard],
    title: 'Groups',
  },
];
```

Always `loadComponent` — every route is its own chunk, which is what keeps the initial
bundle inside the CI budget.

## 5. The template — all four states

Every server-backed view needs all four. **Empty is the most-skipped and the first thing a
new user sees**; a blank screen reads as a broken app.

```html
@if (store.groups.isLoading()) {
  <z-skeleton-list />
} @else if (store.groups.error()) {
  <z-error-state [error]="store.groups.error()" (retry)="store.groups.reload()" />
} @else {
  <ul>
    @for (group of store.groups.value(); track group.id) {
      <li><z-group-card [group]="group" /></li>
    } @empty {
      <z-empty-state message="No groups yet" actionLabel="Create one" />
    }
  </ul>
}
```

`track` is mandatory — without it Angular re-creates every DOM node on each change and the
list visibly flickers.

## 6. Accessibility and styling — not optional

- Actions are `<button>`, navigation is `<a>`. A `<div>` with `(click)` is not focusable and
  is announced as nothing.
- Icon-only buttons need `aria-label`; their icon needs `aria-hidden="true"`.
- Every input has a `<label>`. A placeholder is not a label.
- **Colors and spacing come from theme tokens.** No raw hex, no `[...]` arbitrary values.
- Check it at 375px wide and in dark mode.

## 7. State

- Anything the template reads is a **signal**. The app is zoneless — a plain property will
  not re-render, and **nothing warns you**.
- Derived values are `computed()`, never a stored duplicate.
- Local UI state (is this modal open) stays in the component, not the store.
- **Never do arithmetic on money.** The API computes; format via the money pipe.

## 8. Test

Mock at the HTTP boundary with `HttpTestingController`, not by mocking your own store.
Cover the four states, and query by role or accessible name rather than CSS class — that way
an accessibility regression fails the build.

## 9. Verify

```bash
npm run lint && npm run typecheck && npm test
```

Then tab through the screen with the mouse unplugged. It takes a minute and catches most of
what automated tooling misses.

## Reference

- [docs/structure.md](../../../docs/structure.md) · [docs/state.md](../../../docs/state.md)
- [docs/styling.md](../../../docs/styling.md) · [docs/accessibility.md](../../../docs/accessibility.md)
