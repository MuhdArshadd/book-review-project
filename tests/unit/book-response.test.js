const { toBookResponse, toReviewResponse, toRatingResponse } = require("../../utils/book-response");
const { AppError } = require("../../utils/app-error");

describe("response helpers", () => {
  test("maps database book fields to the public API shape", () => {
    const response = toBookResponse({
      id: 7,
      BookName: "Test Book",
      BookAuthor: "Test Author",
      BookImage: "https://example.com/book.jpg",
      Description: "Description",
      dataValues: { averageRating: "4.5" },
    });

    expect(response).toEqual({
      id: 7,
      title: "Test Book",
      author: "Test Author",
      imageUrl: "https://example.com/book.jpg",
      description: "Description",
      averageRating: 4.5,
    });
  });

  test("maps review and rating resources", () => {
    expect(toReviewResponse({ id: 2, bookId: 7, review: "Clear and useful." })).toEqual({
      id: 2,
      bookId: 7,
      review: "Clear and useful.",
    });
    expect(toRatingResponse({ id: 3, bookId: 7, rating: 5 }, 4.25)).toEqual({
      id: 3,
      bookId: 7,
      rating: 5,
      averageRating: 4.25,
    });
  });
});

describe("AppError", () => {
  test("retains a stable code and structured details", () => {
    const details = [{ field: "title", message: "required" }];
    const error = new AppError("Invalid", 400, "VALIDATION_ERROR", details);

    expect(error.statusCode).toBe(400);
    expect(error.code).toBe("VALIDATION_ERROR");
    expect(error.details).toEqual(details);
  });
});
