# ADR-0004: Generate the API client from the backend's OpenAPI document

- **Status:** Accepted
- **Date:** 2026-09-06

## Context

The API lives in a separate repository ([zentro-be](https://github.com/ali-097/zentro-be)),
so there is no shared package and nothing structurally prevents this app's idea of a response
from drifting from what the server actually returns.

The usual approach is hand-written interfaces in the client. They rot. A field renamed on the
server compiles perfectly here — TypeScript is checking against our stale copy, not against
reality — and fails at runtime, in front of a user, on a screen about money.

## Decision

**Types are generated from the backend's OpenAPI document, and drift fails the build.**

1. zentro-be emits `openapi.json` on merge to `main`, generated from its Swagger decorators.
2. `npm run api:sync` fetches it and regenerates `src/app/core/api/generated/`.
3. **Generated files are committed.**
4. **CI regenerates and fails if the result differs from what's committed.**

Step 4 is what makes this real rather than aspirational — drift becomes a red build in
minutes instead of a runtime surprise in weeks.

## Consequences

**Good**
- Our types are derived from the server's actual behaviour, not from someone's memory of it.
- A breaking API change fails this repo's CI quickly and visibly.
- Committed generated files mean the app builds offline and API changes show up in diffs,
  which is genuinely useful in review.
- Zero hand-maintained response interfaces.

**Bad**
- Generated code is only as good as the backend's annotations. **An unannotated response
  degrades to `any`** — worse than an error, because nothing complains. Enforced on the
  backend side by its own review checklist.
- Generated types are shaped for the wire, not for our UI. Some mapping is needed at the
  service layer.
- Committed generated files create occasional merge conflicts. Regenerate, don't hand-merge.
- Coordinating a breaking change takes two PRs in a deliberate order.

**Neutral**
- One more command to remember after a backend change. CI catches you when you forget.

## Alternatives considered

**Hand-written interfaces.** Zero tooling, and exactly the drift this decision exists to
prevent.

**A shared npm package of types.** Cleaner in principle, and the reason monorepos exist.
Rejected as a consequence of the two-repo split: publishing and versioning a package across
repos is more overhead than generating from a document, and it would still be hand-written
rather than derived from the implementation.

**Generating the full service layer, not just types.** Less code to write, but the generated
services wouldn't follow our store patterns, error handling or interceptor conventions.
Generating types and writing thin services by hand is the better trade.

**tRPC or end-to-end inference.** Requires a shared build graph, and abandons a documented
REST surface a future mobile client may want.

## When to revisit

If the repos ever merge into a monorepo, replace this with a shared types package.
