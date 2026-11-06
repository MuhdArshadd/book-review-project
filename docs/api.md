# API

The API base path is `/api/v1`. Interactive Swagger documentation is available at `/api-docs`, and the raw contract is served from `/openapi.yaml`.

## Endpoints

| Method | Path                  | Purpose                               |
| ------ | --------------------- | ------------------------------------- |
| GET    | `/books`              | List and paginate books               |
| POST   | `/books`              | Add a book                            |
| GET    | `/books/{id}`         | Retrieve details, rating, and reviews |
| POST   | `/books/{id}/ratings` | Add a 1–5 rating                      |
| POST   | `/books/{id}/reviews` | Add a review                          |
| DELETE | `/books/{id}`         | Delete a book and related records     |

## Response conventions

Successful responses use `data` and optional `meta` properties. Errors use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "title is required",
    "details": [{ "field": "title", "message": "title is required" }],
    "requestId": "request-correlation-id"
  }
}
```

The `X-Request-ID` response header matches the error's `requestId` and can be used to correlate logs.

## Cross-origin use

Browser calls are accepted only from `APP_ORIGIN` and optional `QA_DASHBOARD_ORIGIN`. Server-to-server clients without an `Origin` header remain supported.
