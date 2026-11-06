# Local development

1. Install Node.js 20–24 and MySQL 8.
2. Copy `.env.example` to `.env`.
3. Create the configured database, such as `booksdb`.
4. Install and migrate:

```bash
npm ci
npm run db:migrate
npm run dev
```

## Important environment variables

| Variable              | Use                                        |
| --------------------- | ------------------------------------------ |
| `DATABASE_URL`        | Hosted MySQL/TiDB connection string        |
| `DB_SSL`              | Enables verified TLS for cloud databases   |
| `APP_ORIGIN`          | Allowed deployed website origin            |
| `QA_DASHBOARD_ORIGIN` | Optional future QA dashboard origin        |
| `CSRF_SECRET`         | Signs form CSRF tokens                     |
| `DEMO_MODE`           | Enables public-demo record caps and notice |

Do not commit `.env`. Only `.env.example` belongs in source control.
