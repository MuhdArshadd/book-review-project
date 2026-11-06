const { Op, fn, col } = require("sequelize");
const { db, Book, Rating, Review } = require("../models");
const { AppError } = require("../utils/app-error");
const {
  DEMO_MODE,
  DEMO_MAX_BOOKS,
  DEMO_MAX_RATINGS,
  DEMO_MAX_REVIEWS,
} = require("../config/env.config");

const bookListQuery = (sortOrder, pagination = {}) => ({
  attributes: {
    include: [[fn("AVG", col("Ratings.rating")), "averageRating"]],
  },
  include: [
    {
      model: Rating,
      attributes: [],
      required: false,
    },
  ],
  group: ["Book.id"],
  order: [["BookName", sortOrder]],
  subQuery: false,
  ...pagination,
});

const findAllBooks = (sortOrder = "ASC") => {
  return Book.findAll(bookListQuery(sortOrder));
};

const findBooksPage = async (sortOrder = "ASC", limit = 20, offset = 0) => {
  const [books, total] = await Promise.all([
    Book.findAll(bookListQuery(sortOrder, { limit, offset })),
    Book.count(),
  ]);

  return { books, total };
};

const getAverageRating = async (bookId, options = {}) => {
  const result = await Rating.findOne({
    attributes: [[fn("AVG", col("rating")), "averageRating"]],
    where: { bookId },
    raw: true,
    ...options,
  });

  return result.averageRating === null ? null : Number(result.averageRating);
};

const ensureDemoCapacity = async (Model, maximum, resourceName) => {
  if (!DEMO_MODE) return;

  const count = await Model.count();
  if (count >= maximum) {
    throw new AppError(
      `The public demo has reached its ${resourceName} limit. It resets every six hours.`,
      409,
      "DEMO_CAPACITY_REACHED",
    );
  }
};

const findBookById = async (id, options = {}) => {
  const book = await Book.findByPk(id, options);
  if (!book) throw new AppError("Book not found", 404, "BOOK_NOT_FOUND");
  return book;
};

const findBookDetails = async (id) => {
  const book = await findBookById(id);
  const [averageRating, reviews] = await Promise.all([
    getAverageRating(id),
    Review.findAll({
      where: { bookId: id },
      order: [["id", "DESC"]],
    }),
  ]);

  return { book, averageRating, reviews };
};

const createBook = async (bookData) => {
  await ensureDemoCapacity(Book, DEMO_MAX_BOOKS, "book");

  const existingBook = await Book.findOne({
    where: {
      BookName: { [Op.eq]: bookData.BookName },
      BookAuthor: { [Op.eq]: bookData.BookAuthor },
    },
  });

  if (existingBook) {
    throw new AppError("This book has already been added", 409, "BOOK_ALREADY_EXISTS");
  }

  return Book.create(bookData);
};

const createRating = async (bookId, rating) => {
  await findBookById(bookId);
  await ensureDemoCapacity(Rating, DEMO_MAX_RATINGS, "rating");
  const createdRating = await Rating.create({ bookId, rating });
  const averageRating = await getAverageRating(bookId);
  return { rating: createdRating, averageRating };
};

const createReview = async (bookId, review) => {
  await findBookById(bookId);
  await ensureDemoCapacity(Review, DEMO_MAX_REVIEWS, "review");
  return Review.create({ bookId, review });
};

const deleteBookById = async (id) => {
  return db.transaction(async (transaction) => {
    const book = await findBookById(id, { transaction });

    // Explicit child deletes also support evaluator databases that were
    // created without ON DELETE CASCADE.
    await Rating.destroy({ where: { bookId: id }, transaction });
    await Review.destroy({ where: { bookId: id }, transaction });
    await book.destroy({ transaction });
  });
};

module.exports = {
  findAllBooks,
  findBooksPage,
  findBookDetails,
  createBook,
  createRating,
  createReview,
  deleteBookById,
};
