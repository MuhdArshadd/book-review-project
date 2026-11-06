# Security

The portfolio deployment uses defense in depth appropriate to a public demonstration:

- Helmet headers and a restrictive Content Security Policy
- Verified TLS to the hosted database
- Double-submit signed CSRF tokens on HTML forms
- Exact-origin CORS for browser API clients
- Global, mutation, and deletion rate limits
- 50 KB request limits
- Server-side input validation and escaped EJS output
- Generic internal errors with request IDs
- Database constraints and transactional cascading deletion
- Environment-only secrets
- Structured logs without database credentials
- Graceful shutdown and connection cleanup

The API intentionally has no user authentication because it is an interactive shared demonstration. Record caps and periodic reset limit abuse. A commercial deployment would add identity, ownership, authorization, and persistent audit records.

## Dependency audit note

The production audit currently reports two moderate findings for Sequelize's transitive `uuid` dependency. There are no high or critical production findings. npm's automated remediation would replace Sequelize 6 with Sequelize 3, which is a breaking downgrade, so the project keeps the maintained Sequelize 6 release and records the residual advisory here instead of applying an unsafe forced fix. CI continues to fail on any high or critical production advisory.
