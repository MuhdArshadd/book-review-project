const asyncHandler = require("express-async-handler");
const {
  findAllBooks,
  findBookDetails,
  createBook,
  createRating,
  createReview,
  deleteBookById,
} = require("../services/book.service");

const getBooksHandler = asyncHandler(async (req, res) => {
  const sort = req.query.sort === "desc" ? "desc" : "asc";
  const books = await findAllBooks(sort.toUpperCase());

  res.status(200).render("index", {
    pageTitle: "Book Collection",
    books,
    sort,
    message: req.query.message || "",
  });
});

const getAddBookHandler = (req, res) => {
  res.status(200).render("add-book", {
    pageTitle: "Add a Book",
    values: {},
    errors: [],
  });
};

const createBookHandler = asyncHandler(async (req, res) => {
  const book = await createBook({
    BookName: req.body.BookName.trim(),
    BookAuthor: req.body.BookAuthor.trim(),
    BookImage: req.body.BookImage.trim(),
    Description: req.body.Description.trim(),
  });

  res.redirect(`/books/${book.id}?message=${encodeURIComponent("Book added successfully")}`);
});

const getBookHandler = asyncHandler(async (req, res) => {
  const details = await findBookDetails(req.params.id);

  res.status(200).render("book-details", {
    pageTitle: details.book.BookName,
    ...details,
    message: req.query.message || "",
  });
});

const createRatingHandler = asyncHandler(async (req, res) => {
  await createRating(req.params.id, Number(req.body.rating));
  res.redirect(
    `/books/${req.params.id}?message=${encodeURIComponent("Rating added successfully")}`,
  );
});

const createReviewHandler = asyncHandler(async (req, res) => {
  await createReview(req.params.id, req.body.review.trim());
  res.redirect(
    `/books/${req.params.id}?message=${encodeURIComponent("Review added successfully")}`,
  );
});

const deleteBookHandler = asyncHandler(async (req, res) => {
  await deleteBookById(req.params.id);
  res.redirect(`/books?message=${encodeURIComponent("Book deleted successfully")}`);
});

module.exports = {
  getBooksHandler,
  getAddBookHandler,
  createBookHandler,
  getBookHandler,
  createRatingHandler,
  createReviewHandler,
  deleteBookHandler,
};
