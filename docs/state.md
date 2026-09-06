# State management

Signals plus small injectable stores. No NgRx — see
[ADR-0002](./adr/0002-signals-over-ngrx.md).

## The one thing that will bite you

The app is **zoneless**. Change detection is driven entirely by signals.

```ts
// Does not re-render. Fails silently — no error, nothing in the console.
export class GroupList {
  groups: Group[] = [];
  load() { this.groups = fetched; }
}

// Re-renders.
export class GroupList {
  groups = signal<Group[]>([]);
  load() { this.groups.set(fetched); }
}
```

There is no warning for the first version. It simply doesn't update, and the usual reaction
is to go looking for a bug in the data layer. **If a view isn't updating, check that the
value is a signal before checking anything else.**

## Three kinds of state

Treating these the same is what makes state management painful.

| Kind | Example | Where it lives | Lifetime |
|---|---|---|---|
| **Server state** | Groups, expenses, balances | `resource()` in a feature store | Cached view of the server |
| **Session state** | Current user, access token | `core/auth` store | App lifetime |
| **Local UI state** | Modal open, active tab, form draft | A `signal` in the component | Component lifetime |

Most "state management" difficulty comes from putting local UI state in a store. **Is this
modal open** is not application state. Leave it in the component.

## Server state

The server is the source of truth. We hold a cached view and refresh it — we don't maintain
a parallel copy and try to keep it in sync.

```ts
@Injectable({ providedIn: 'root' })
export class GroupsStore {
  private readonly api = inject(GroupsService);

  readonly groups = resource({
    loader: () => this.api.list(),
  });

  // Derived — never a second stored field.
  readonly totalOwed = computed(() =>
    this.groups.value()?.reduce((sum, g) => sum + g.balanceMinor, 0) ?? 0,
  );

  async create(dto: CreateGroupDto) {
    await this.api.create(dto);
    this.groups.reload();   // re-fetch rather than patching the local array
  }
}
```

**Re-fetch after a mutation rather than patching local state.** Hand-patching is where
client and server quietly diverge — the server may have set defaults, computed a balance, or
rejected part of the change. For a balance, being subtly wrong is worse than a brief spinner.

Optimistic updates are the exception, not the default. Use them where latency genuinely hurts
(toggling a checkbox), never for anything involving money.

## Derived state

`computed()` — always. Never store a value you can derive, and never keep two fields in sync
by hand.

```ts
// Wrong — two sources of truth that will drift
members = signal<Member[]>([]);
memberCount = signal(0);

// Right
members = signal<Member[]>([]);
memberCount = computed(() => this.members().length);
```

## Loading and error state

Every server-backed view has **four** states, and all four need a design:

1. **Loading** — a skeleton, not a spinner where you can predict the shape
2. **Empty** — success with no data. Needs its own message and usually a call to action.
3. **Error** — what failed, and what the user can do about it. Never a bare "Something went
   wrong."
4. **Loaded**

`resource()` exposes these directly:

```html
@if (groups.isLoading()) {
  <z-skeleton-list />
} @else if (groups.error()) {
  <z-error-state [error]="groups.error()" (retry)="groups.reload()" />
} @else if (groups.value()?.length === 0) {
  <z-empty-state message="No groups yet" actionLabel="Create one" />
} @else {
  ...
}
```

**Empty is the most-skipped case** and the first thing a new user sees. A blank screen on
first login reads as a broken app.

## Forms

Reactive forms for anything non-trivial. Validation mirrors the API's rules so users get
immediate feedback — but the API is the authority, and its errors are always displayed.

Never disable a submit button as the only validation feedback: it leaves the user with no
idea what's wrong. Show the reason.

## Rules

1. **Signals for anything a template reads.** Zoneless has no other mechanism.
2. **`computed()` for anything derived.** Never a stored duplicate.
3. **Local UI state stays in the component.**
4. **Re-fetch after mutations** instead of patching, especially for money.
5. **Never store the access token anywhere persistent.** Memory only — see
   [ARCHITECTURE.md](../ARCHITECTURE.md#5-authentication).
6. **Never compute a balance or split client-side.** The server owns that arithmetic.
7. **Handle all four view states** every time.
