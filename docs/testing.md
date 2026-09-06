# Testing

Unit and component tests run headless. `npm test`.

> Karma is deprecated upstream. Migrating to Vitest via Angular's
> `@angular/build:unit-test` builder is an M0 spike — see the board. Everything below is
> runner-agnostic.

## What to test

**Test what the user sees.** Rendered output, and what happens when they interact.

```ts
// Good — describes behaviour
it('shows an empty state when the user has no groups');
it('disables the submit button while the form is saving');
it('shows the API error message when creating a group fails');

// Bad — implementation detail; breaks on refactor, proves nothing
it('calls groupsService.list once');
it('sets isLoading to true');
```

The second kind passes while the component renders nothing at all.

## The four states

Every component backed by server data has four states, and each gets a test:

1. **Loading** — skeleton renders
2. **Empty** — success with no data shows the empty state
3. **Error** — failure shows a message and a retry affordance
4. **Loaded** — data renders

**Empty is the most-skipped and the most-seen** — it's the first thing a new user hits.

## Mocking

Mock at the **HTTP boundary**, with `HttpTestingController`. Don't mock your own stores or
services — then you're testing the mock.

```ts
TestBed.configureTestingModule({
  imports: [GroupList],
  providers: [provideHttpClient(), provideHttpClientTesting()],
});

const http = TestBed.inject(HttpTestingController);
http.expectOne('/groups').flush({ data: [] });
fixture.detectChanges();

expect(el.textContent).toContain('No groups yet');
```

This exercises the real interceptors, the real store and the real component — which is where
bugs actually are.

## Zoneless

Tests must trigger change detection explicitly after a signal changes:

```ts
component.groups.set([aGroup()]);
fixture.detectChanges();
```

A test that "sees stale data" has almost always skipped this. Check it before assuming the
component is broken.

## Accessibility in tests

Query the way a user finds things — by role and accessible name, not by CSS class:

```ts
// Good: fails if the button loses its accessible name, which is a real bug
const button = el.querySelector('button[aria-label="Delete expense"]');

// Bad: passes even if the button is unreachable and unnamed
const button = el.querySelector('.delete-btn');
```

This makes accessibility regressions fail the build instead of shipping.

## Money

- Assert exact values: `toBe('£12.30')`. Never `toBeCloseTo` — this app does no arithmetic,
  so an approximate assertion means something is wrong.
- Test the currency exponents that break naive formatting: JPY (zero decimals), BHD (three).
- Test that a balance's sign is conveyed by **text**, not only color.

## What not to test

- Framework behaviour. Angular routes and binds correctly.
- Generated API types.
- Getters and pass-through inputs with no logic.
- Exact markup. Asserting on class names or DOM depth breaks on every restyle.

## Coverage

No enforced percentage — a number that's satisfied by testing getters. What matters:

- Every component's four states
- Every user-visible interaction
- Money formatting, exhaustively
- Auth flows: login, refresh, logout, guard redirect

## Running

```bash
npm test                    # headless, once
npm run test:watch          # watch mode
npm test -- --include='**/groups/**'
```
