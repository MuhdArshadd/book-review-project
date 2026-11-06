# Public demo behavior

The hosted website is a shared sandbox:

- Anyone can add books, ratings, and reviews or delete a book.
- Requests are rate-limited per observed client IP.
- Record counts are capped to protect the free database quota.
- Seed data is restored every six hours by GitHub Actions.
- The reset can also be triggered manually from the Actions page.

The reset workflow connects directly to the database through a GitHub secret. There is no public reset endpoint to discover or attack.

Seed cover artwork is stored with the application, so the initial portfolio presentation does not depend on third-party image hosting.
