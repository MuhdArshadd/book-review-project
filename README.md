# Book Collection

A portfolio-grade book review website and JSON API built with Express, EJS, Sequelize, and a MySQL-compatible database.

The project demonstrates server-rendered UI development, REST API design, relational data, validation, security controls, automated testing, API documentation, CI/CD, and zero-cost cloud deployment.

## Project links

- **Live demo:** add the assigned `onrender.com` URL after the first Render deployment
- **Interactive API:** `/api-docs` on the running application
- **OpenAPI file:** [`docs/api/openapi.yaml`](docs/api/openapi.yaml)
- **Full documentation:** published to GitHub Pages by the documentation workflow

## Architecture

```text
Browser UI (EJS) ─┐
                  ├─ Express controllers ─ service layer ─ Sequelize ─ MySQL/TiDB
JSON API /api/v1 ─┘
```

Both interfaces share the same validation and business rules. The public demo is rate-limited and restored to a known eight-book dataset every six hours.

## Local quick start

Requirements: Node.js 20–24 and MySQL 8 or a MySQL-compatible database.

```bash
cp .env.example .env
npm ci
npm run db:migrate
npm start
```

Open:

- Website: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`
- Readiness: `http://localhost:3000/health/ready`

To intentionally restore the demo dataset:

```bash
CONFIRM_DEMO_RESET=RESET_PUBLIC_DEMO npm run db:seed
```

On PowerShell, set `$env:CONFIRM_DEMO_RESET = "RESET_PUBLIC_DEMO"` first.

## Quality checks

```bash
npm run check
npm run lint
npm run format:check
npm run openapi:validate
npm test
npm run test:e2e
npm run docs:build
npm run security:audit
```

See [`docs/`](docs/) for architecture, API, security, testing, CI/CD, deployment, and future QA-dashboard integration.
