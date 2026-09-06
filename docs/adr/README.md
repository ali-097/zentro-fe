# Architecture Decision Records

Short documents recording decisions that shape this codebase, and — more importantly — the
reasoning behind them.

The point isn't ceremony. It's that six months from now someone will look at a piece of code,
think "this is needlessly awkward", and change it. An ADR is how you tell that person what
they'd be trading away.

## Index

| # | Decision | Status |
|---|---|---|
| [0001](./0001-drop-ssr-for-spa.md) | Drop SSR, ship a client-rendered SPA | Accepted |
| [0002](./0002-signals-over-ngrx.md) | Signals and small stores instead of NgRx | Accepted |
| [0003](./0003-core-shared-features-layering.md) | `core`/`shared`/`features` layering, enforced by lint | Accepted |
| [0004](./0004-generated-api-client.md) | Generate the API client from the backend's OpenAPI document | Accepted |
| [0005](./0005-zoneless-change-detection.md) | Zoneless change detection | Accepted |

Backend decisions live in
[Zentro-BE/docs/adr](https://github.com/ali-097/Zentro-BE/tree/main/docs/adr) — including
money as integer minor units and the two-repo split, both of which constrain this app.

## Writing one

Copy [`0000-template.md`](./0000-template.md), take the next number, link it from your PR.

**Write an ADR when** a choice would make a newcomer ask "why is it like this?" — adding or
replacing a dependency, a state or rendering strategy, a structural boundary, or anything you
deliberately chose *not* to do.

**Don't write one for** ordinary implementation choices, anything a linter enforces, or
things obvious from the code.

## Changing a decision

Never edit an accepted ADR to reverse it. Write a new one, and mark the old one
`Superseded by ADR-XXXX`. The old reasoning is the valuable part — it tells you what the new
decision has to be better than.
