---
name: sync-api-types
description: Regenerate Zentro Web's typed API client from the backend's OpenAPI document, and reconcile the code with what changed. Use after any backend API change, or when CI reports that API types are stale.
---

# Sync the API types

The API is a separate repo, so nothing structurally stops this app's types drifting from what
the server actually returns. Generation plus a CI diff check is what prevents that — see
[ADR-0004](../../../docs/adr/0004-generated-api-client.md).

## Run it

```bash
npm run api:sync
```

This fetches `openapi.json` from
[Zentro-BE](https://github.com/ali-097/Zentro-BE) on GitHub and regenerates
`src/app/core/api/generated/`. It does **not** need the API running locally.

Then check what moved:

```bash
git diff src/app/core/api/generated
```

## Read the diff — it is the point

The regenerated types are a changelog of the backend's contract. Look for:

- **A removed or renamed field.** Everything that referenced it now fails to compile. That
  is the system working — fix the call sites rather than restoring the old name.
- **A field that became optional.** Existing code assumes it's present. Every read needs a
  null check, and the UI needs a sensible fallback.
- **A field that became required.** Requests that omit it will now be rejected at runtime.
- **A new enum value.** Any `switch` over that enum needs a case, and any UI mapping it to a
  label needs an entry — otherwise it renders blank.
- **A type widened to `any`.** This means the backend is **missing a Swagger annotation**.
  Don't work around it locally: file a backend issue, because everyone consuming that
  endpoint silently loses type safety.

## Then

```bash
npm run typecheck    # fastest way to find every affected call site
npm run lint && npm test
```

Commit the generated files together with the code that adapts to them, in one PR — a commit
where the types and their consumers disagree doesn't build.

## Rules

1. **Never hand-edit anything under `generated/`.** Your change is gone on the next sync,
   and in the meantime it hides a real mismatch.
2. **Never hand-write an interface mirroring an API response.** That is the drift this
   exists to prevent.
3. **Never `any`-cast around a type error from generated code.** The error is telling you
   the server changed. Fix the consumer.
4. Map generated wire types to whatever shape the UI wants **in the feature's service** —
   not by editing the generated file.

## If it fails

- **404 / nothing to fetch** — the backend hasn't published `openapi.json` yet. True until
  the M0 Swagger issue lands.
- **CI says types are stale** — someone changed the backend. Run this and commit the result.
- **Everything is suddenly `any`** — the backend's annotations regressed. Backend issue.
