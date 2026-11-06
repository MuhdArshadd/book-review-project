# Architecture

## Request flow

```text
Web route → CSRF/validation → web controller ┐
                                             ├→ service → Sequelize → MySQL/TiDB
API route → validation → API controller ─────┘
```

- EJS renders the browser interface on the server.
- `/api/v1` returns JSON for automation, external clients, and the future QA dashboard.
- Controllers only translate HTTP input and output.
- Services contain duplicate checks, capacity rules, averages, and transactional deletion.
- Models preserve the original assignment table and column names.

## Runtime boundaries

The Express application and static files run on one Render web service. Persistent data is stored in TiDB Cloud through its MySQL-compatible TLS endpoint. Nothing important is written to Render's ephemeral filesystem.

## Design decisions

- A monolith keeps deployment and local learning simple.
- A separate API layer makes testing and future integrations explicit without duplicating business rules.
- Relative URLs allow the same application build to run locally and in the cloud.
- OpenAPI is the API source of truth; manually duplicated Postman collections are avoided.
