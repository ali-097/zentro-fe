# ADR-0002: Signals and small stores instead of NgRx

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

Zentro needs to manage: the authenticated session, cached server data (groups, expenses,
balances), and local UI state. The team is small and not uniformly deep in Angular.

Angular 20 ships signals as the primary reactivity primitive, plus `resource()` for async
data, and supports **zoneless** change detection — which we are adopting. That materially
changes the calculus: signals are no longer a lightweight alternative to a state library,
they are the mechanism change detection runs on.

## Decision

**Signals plus small injectable stores. No NgRx, no NgRx SignalStore, no Akita.**

- One store per feature, `providedIn: 'root'`, holding signals and `resource()`s
- `computed()` for every derived value — never a stored duplicate
- Local UI state stays in the component as a plain `signal`
- RxJS only where it earns its place: debouncing, stream combination, cancellation

## Consequences

**Good**
- Very little ceremony. Adding state is a `signal()`; adding derived state is a `computed()`.
  No actions, reducers, effects or selectors for what is fundamentally "fetch and display".
- Native to the framework and to zoneless change detection — nothing to reconcile.
- A newcomer can read a store top to bottom and understand it. No indirection to trace.
- Smaller bundle: no state library.
- Fully typed with no generic gymnastics.

**Bad**
- No time-travel debugging or a Redux DevTools action log. Rarely needed for an app whose
  state is mostly a cache of server responses, but genuinely missed when it is.
- No enforced structure. Discipline has to come from convention and review rather than from
  the library's shape — hence the explicit rules in [state.md](../state.md).
- Cross-feature state coordination has no prescribed pattern; it goes in `core/`, which
  requires judgment.
- Less transferable: engineers with NgRx experience have to learn our conventions instead of
  recognizing a standard one.

**Neutral**
- Adopting a state library later is possible but not free — it would touch every store.

## Alternatives considered

**NgRx (full store).** Excellent at what it's for: complex, deeply shared state with
non-obvious transitions and a real need for auditability. Rejected because Zentro's state is
overwhelmingly *server cache plus a little session state*. NgRx's structure would be
overhead on nearly every feature, and boilerplate on a small team is a tax on shipping.

**NgRx SignalStore.** A genuine middle ground — signal-based with more structure than
hand-rolled stores. Rejected narrowly: a dependency and an API to learn, for structure we can
get from a documented convention. The closest call of the three, and the first thing to
reconsider.

**Plain services with `BehaviorSubject`.** The pre-signals Angular idiom. Strictly worse now:
more code than signals, and doesn't integrate with zoneless change detection.

## When to revisit

If any of these become true:

- Multiple features start needing the same non-trivial state and `core/` becomes a dumping
  ground.
- Debugging state transitions becomes routinely painful, so an action log would earn itself.
- Stores start growing effect-like coordination logic that convention isn't keeping tidy.

In that case NgRx SignalStore is the migration target, not full NgRx.
