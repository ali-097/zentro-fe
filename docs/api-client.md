# Talking to the API

## Types are generated, never written

The backend serves an OpenAPI document. This app generates its types from it:

```bash
npm run api:sync
```

That fetches `openapi.json` from [Zentro-BE](https://github.com/ali-097/Zentro-BE) and
regenerates `src/app/core/api/generated/`. **Generated files are committed, and CI fails if
regenerating produces a diff.**

**Never hand-edit anything under `generated/`.** Your change is gone on the next sync, and
worse, it will have masked a real mismatch in the meantime.

**Never hand-write an interface that mirrors an API response.** That is exactly the drift
this prevents: a field renamed on the server compiles cleanly here and fails in front of a
user. See [ADR-0004](./adr/0004-generated-api-client.md).

Run `api:sync` after any backend change that touches a shape. If CI complains that types are
stale, run it and commit the result — don't edit around it.

## Feature services

Each feature has a service wrapping the calls it needs, using generated types:

```ts
@Injectable({ providedIn: 'root' })
export class GroupsService {
  private readonly http = inject(HttpClient);

  list(): Observable<GroupResponse[]> {
    return this.http
      .get<Paginated<GroupResponse>>('/groups')
      .pipe(map((r) => r.data));
  }
}
```

Paths are relative — the base-URL interceptor prefixes the configured API origin. Never
hardcode `http://localhost:3000` anywhere.

## Interceptors

Three, in order, all in `core/auth/interceptors/`:

1. **Base URL** — turns `/groups` into the configured origin.
2. **Auth** — attaches the in-memory access token and sets `withCredentials` so the httpOnly
   refresh cookie is sent.
3. **Error** — normalizes the API's error envelope and handles `401`.

## The 401 flow

A `401` is **routine**, not exceptional — access tokens last about fifteen minutes.

```
request → 401 → refresh once → retry the original request
                     ↓ fails
                 clear session → redirect to /login
```

Two things matter in the implementation:

- **Concurrent 401s share one refresh.** If five requests fail at once, five refresh calls
  will rotate the token five times and the family reuse-detection on the server will revoke
  the whole session. Queue them behind a single in-flight refresh.
- **Never retry more than once.** A second 401 means the session is genuinely over.

## Errors

The API returns one envelope for every failure:

```json
{
  "type": "https://zentro.app/errors/split-mismatch",
  "title": "Splits do not sum to the expense total",
  "status": 422,
  "detail": "Splits total 999 but the expense is 1000",
  "requestId": "01J8XY...",
  "errors": [{ "field": "splits", "message": "must sum to amountMinor" }]
}
```

- **Branch on `type`**, never on `detail`. `detail` is prose and will change.
- Use `errors[]` to attach messages to the right form fields.
- Show `requestId` in the error UI — it's how a user's report gets traced to a server log.
- **Never show a raw `detail` as the whole error message.** Write a human sentence and use
  `detail` as supporting text.

## Money

The API sends `{ amountMinor: 1230, currency: 'EUR' }`.

- **Never do arithmetic on it.** No summing, no dividing, no converting. The server owns
  every calculation, and a client-side figure that disagrees with the server is a support
  ticket about missing money.
- **Never parse it into a float.** `1230 / 100` is where precision starts leaking.
- Format for display only, through the shared money pipe, which handles the currency's
  exponent (JPY has none, BHD has three).

## Status codes worth handling specifically

| Code | What it means here |
|---|---|
| `401` | Routine — refresh and retry. Only surface it if the refresh fails. |
| `403` | Authenticated but not permitted, e.g. a member attempting an admin action. |
| `404` | Not found **or** not visible to this user. Deliberate — don't tell the user which. |
| `409` | Conflict, e.g. already a member. Usually means refetch and re-render. |
| `422` | Semantically invalid, e.g. splits that don't sum. Show it on the form. |
| `429` | Rate limited. Respect `Retry-After`; don't retry immediately in a loop. |
