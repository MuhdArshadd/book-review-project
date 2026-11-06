# Database

The application uses the original `books`, `rating`, and `review` tables. Ratings and reviews reference `books.id` through `bookId` and cascade when a book is removed.

## Schema management

Versioned migrations in `migrations/` replace runtime `sequelize.sync()`. The application runs pending migrations before listening, which is appropriate for the single-instance portfolio deployment.

The book title and author have a composite unique index. Application validation provides friendly errors, while the database constraint protects against concurrent duplicate requests.

## Connections

- Local development can use individual `DB_*` variables.
- Cloud deployment uses `DATABASE_URL` and `DB_SSL=true`.
- TLS requires version 1.2 or newer and verifies the database certificate.
- The pool is limited to five connections for free-tier compatibility.
