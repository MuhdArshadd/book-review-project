# Testing

## Layers

- Jest unit tests verify pure response mapping and shared errors.
- Supertest integration tests exercise the JSON API against an isolated MySQL test database.
- OpenAPI validation catches broken references and invalid contract syntax.
- Playwright covers the rendered browser workflow and responsive UI.
- `npm audit --omit=dev --audit-level=high` blocks high or critical production findings.

The current production audit has zero high or critical findings. Two moderate findings remain in Sequelize's transitive `uuid` package; the reason for retaining the dependency is documented in [Security decisions](./security.md#dependency-audit-note).

## Commands

```bash
npm run test:ci
npm run test:e2e
npm run openapi:validate
npm run security:audit
```

Jest and Playwright produce JUnit XML in `reports/`. These machine-readable files are deliberately suitable for the future QA dashboard.

Integration and browser tests must use a disposable database. Never point automated tests at the public demonstration database.
