# CI/CD

Pull requests and pushes run the same quality gates:

1. Deterministic `npm ci`
2. Formatting and ESLint
3. JavaScript syntax/project structure check
4. MySQL migrations
5. Jest/Supertest tests and coverage
6. OpenAPI validation
7. Production dependency audit
8. Playwright browser tests
9. VitePress documentation build

On `main`, a successful workflow calls Render's protected deploy hook. It then polls `/health/ready` and runs a production smoke test when `PRODUCTION_URL` is configured.

Documentation is built separately and deployed to GitHub Pages. Generated output is never committed.

Dependabot maintains npm and GitHub Actions dependencies, while CodeQL analyzes JavaScript changes.
