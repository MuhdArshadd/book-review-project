# Deployment

## TiDB Cloud Starter

Create a MySQL-compatible Starter instance without enabling paid overage. Copy its public connection string into Render as `DATABASE_URL` and leave `DB_SSL=true`.

## Render

Create a Blueprint from `render.yaml`. During setup, provide:

- `DATABASE_URL`
- `APP_ORIGIN` using the assigned `https://...onrender.com` URL
- An optional `QA_DASHBOARD_ORIGIN`

Render generates `CSRF_SECRET`. The service runs in Singapore on the free plan and uses `/health/ready` as its health check.

## GitHub secrets

| Secret                   | Workflow                     |
| ------------------------ | ---------------------------- |
| `RENDER_DEPLOY_HOOK_URL` | Deploy after CI succeeds     |
| `PRODUCTION_URL`         | Post-deployment smoke checks |
| `DATABASE_URL`           | Scheduled demo reset         |

The free Render service sleeps after inactivity, so the first visit may take about a minute. This limitation is disclosed in the project landing page rather than hidden.
