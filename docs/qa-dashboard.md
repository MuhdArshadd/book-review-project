# Future QA dashboard

The later QA dashboard should live in its own repository because it will monitor multiple applications and have an independent release cycle.

This project already provides the integration contract it will need:

- Configurable `API_BASE_URL`
- `/health/live` and `/health/ready`
- `/openapi.yaml`
- Stable `/api/v1` resources and error envelopes
- `X-Request-ID` correlation
- Jest and Playwright JUnit XML reports
- GitHub Actions run and deployment status

The dashboard should consume results rather than duplicate test definitions. Application repositories remain responsible for their own tests and publish normalized results for aggregation.
