const request = require("supertest");
const app = require("../app");
const { db, Book, Rating, Review } = require("../models");
const { migrator } = require("../database/migrator");
const { resetDemoData } = require("../database/reset-demo");

beforeAll(async () => {
  if (process.env.NODE_ENV !== "test" || !process.env.DB_NAME.endsWith("_test")) {
    throw new Error("Integration tests require an isolated database ending in _test");
  }

  await db.authenticate();
  await migrator.up();
});

beforeEach(async () => {
  await resetDemoData();
});

afterAll(async () => {
  await db.close();
});

test("health endpoints report liveness and database readiness", async () => {
  const live = await request(app).get("/health/live").expect(200);
  const ready = await request(app).get("/health/ready").expect(200);

  expect(live.body.data.status).toBe("ok");
  expect(ready.body.data.database).toBe("connected");
});

test("lists books with pagination and descending title order", async () => {
  const response = await request(app).get("/api/v1/books?sort=desc&limit=3&offset=0").expect(200);

  expect(response.body.data).toHaveLength(3);
  expect(response.body.meta).toMatchObject({ total: 8, count: 3, sort: "desc" });
  expect(response.body.data[0].title.localeCompare(response.body.data[1].title)).toBeGreaterThan(0);
});

test("creates a book and rejects a duplicate title and author", async () => {
  const payload = {
    title: "Integration Test Book",
    author: "QA Engineer",
    imageUrl: "https://example.com/integration-cover.jpg",
    description: "Created by the automated API integration suite.",
  };

  const created = await request(app).post("/api/v1/books").send(payload).expect(201);
  const duplicate = await request(app).post("/api/v1/books").send(payload).expect(409);

  expect(created.body.data).toMatchObject(payload);
  expect(created.headers.location).toBe(`/api/v1/books/${created.body.data.id}`);
  expect(duplicate.body.error.code).toBe("BOOK_ALREADY_EXISTS");
  expect(await Book.count({ where: { BookName: payload.title } })).toBe(1);
});

test("adds ratings and reviews, then returns them in book details", async () => {
  const book = await Book.findOne({ order: [["id", "ASC"]] });

  const rating = await request(app)
    .post(`/api/v1/books/${book.id}/ratings`)
    .send({ rating: 5 })
    .expect(201);
  const review = await request(app)
    .post(`/api/v1/books/${book.id}/reviews`)
    .send({ review: "Verified through Supertest." })
    .expect(201);
  const details = await request(app).get(`/api/v1/books/${book.id}`).expect(200);

  expect(rating.body.data.rating).toBe(5);
  expect(rating.body.data.averageRating).toBeGreaterThanOrEqual(1);
  expect(review.body.data.review).toBe("Verified through Supertest.");
  expect(details.body.data.reviews[0].review).toBe("Verified through Supertest.");
});

test("rejects invalid input with structured details and a request ID", async () => {
  const book = await Book.findOne();
  const response = await request(app)
    .post(`/api/v1/books/${book.id}/ratings`)
    .send({ rating: 9 })
    .expect(400);

  expect(response.body.error.code).toBe("VALIDATION_ERROR");
  expect(response.body.error.details[0].field).toBe("rating");
  expect(response.body.error.requestId).toBe(response.headers["x-request-id"]);
});

test("deletes a book and all associated ratings and reviews", async () => {
  const book = await Book.findOne();
  await request(app).delete(`/api/v1/books/${book.id}`).expect(204);

  expect(await Book.count({ where: { id: book.id } })).toBe(0);
  expect(await Rating.count({ where: { bookId: book.id } })).toBe(0);
  expect(await Review.count({ where: { bookId: book.id } })).toBe(0);
  await request(app).get(`/api/v1/books/${book.id}`).expect(404);
});

test("blocks unapproved browser origins and form posts without a CSRF token", async () => {
  const book = await Book.findOne();

  const corsResponse = await request(app)
    .get("/api/v1/books")
    .set("Origin", "https://untrusted.example")
    .expect(403);
  const csrfResponse = await request(app)
    .post(`/books/${book.id}/reviews`)
    .type("form")
    .send({ review: "Missing token" })
    .expect(403);

  expect(corsResponse.body.error.code).toBe("CORS_ORIGIN_DENIED");
  expect(csrfResponse.text).toContain("form session expired");
});
