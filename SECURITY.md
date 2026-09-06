# Security Policy

## Reporting a vulnerability

**Please don't open a public issue.**

Report privately through GitHub's [Security Advisories](https://github.com/ali-097/zentro-fe/security/advisories/new),
which creates a private thread with the maintainers.

Include what you can: what the issue is, steps to reproduce or a proof of concept, the
affected screens or files, and anything you think a fix should account for.

You'll get an acknowledgement within a few days. This is a personal project without a funded
security team, so please be patient — but it will be taken seriously.

## Scope

This is a browser client. It holds **no secrets** and enforces **no rules** — every
authorization decision lives in the [API](https://github.com/ali-097/zentro-be). A route
guard here stops a logged-out user seeing an empty page; it is not a security boundary, and
bypassing it is expected behaviour rather than a vulnerability.

Findings that do matter here:

- **XSS** — anything that gets script into the page, including unsafe `innerHTML`,
  `bypassSecurityTrust*` misuse, or unsanitized user content rendered as markup.
- **Token exposure** — the access token reaching `localStorage`, `sessionStorage`, a URL, a
  log, or a third-party script. It is held in memory precisely so XSS cannot read it.
- **Leaking another user's data** into the client, e.g. an over-broad cache shared between
  sessions, or data surviving logout.
- A dependency with an exploitable path in shipped code.
- Anything that causes the app to send a user's data somewhere it shouldn't.

**Out of scope:** bypassing a route guard, editing client state in devtools, reading values
in the JS bundle (it is all public), and missing headers with no demonstrated impact. If you
can make the *API* return data you shouldn't have, that's a
[zentro-be](https://github.com/ali-097/zentro-be/security/advisories/new) report and a much
more serious one.

## Supported versions

The project is pre-release. Only `main` is supported.

## Disclosure

Please give us a reasonable window to ship a fix before publishing. Credit is offered in the
advisory unless you'd rather not be named.
