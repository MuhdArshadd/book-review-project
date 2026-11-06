const asyncHandler = require("express-async-handler");
const {
  findBooksPage,
  findBookDetails,
  createBook,
  createRating,
  createReview,
  deleteBookById,
} = require("../../services/book.service");
const { toBookResponse, toReviewResponse, toRatingResponse } = require("../../utils/book-response");

const getBooks = asyncHandler(async (req, res) => {
  const sort = req.query.sort || "asc";
  const limit = Number(req.query.limit || 20);
  const offset = Number(req.query.offset || 0);
  const { books, total } = await findBooksPage(sort.toUpperCase(), limit, offset);

  res.status(200).json({
    data: books.map(toBookResponse),
    meta: {
      total,
      count: books.length,
      sort,
      limit,
      offset,
    },
  });
});

const getBook = asyncHandler(async (req, res) => {
  const details = await findBookDetails(req.params.id);
  const data = toBookResponse(details.book);
  data.averageRating = details.averageRating;
  data.reviews = details.reviews.map(toReviewResponse);

  res.status(200).json({ data });
});

const postBook = asyncHandler(async (req, res) => {
  const book = await createBook({
    BookName: req.body.title,
    BookAuthor: req.body.author,
    BookImage: req.body.imageUrl,
    Description: req.body.description,
  });

  res
    .status(201)
    .location(`/api/v1/books/${book.id}`)
    .json({
      data: toBookResponse(book),
    });
});

const postRating = asyncHandler(async (req, res) => {
  const result = await createRating(req.params.id, Number(req.body.rating));

  res.status(201).json({
    data: toRatingResponse(result.rating, result.averageRating),
  });
});

const postReview = asyncHandler(async (req, res) => {
  const review = await createReview(req.params.id, req.body.review);
  res.status(201).json({ data: toReviewResponse(review) });
});

const deleteBook = asyncHandler(async (req, res) => {
  await deleteBookById(req.params.id);
  res.status(204).send();
});

module.exports = { getBooks, getBook, postBook, postRating, postReview, deleteBook };
