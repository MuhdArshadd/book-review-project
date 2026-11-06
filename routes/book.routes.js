const { Router } = require("express");
const {
  getBooksHandler,
  getAddBookHandler,
  createBookHandler,
  getBookHandler,
  createRatingHandler,
  createReviewHandler,
  deleteBookHandler,
} = require("../controllers/book.controller");
const { validateRequest, validateBookForm } = require("../middleware/validation.middleware");
const { protectWebForm } = require("../middleware/csrf.middleware");
const { mutationLimiter, deleteLimiter } = require("../middleware/rate-limit.middleware");
const {
  bookIdValidator,
  createBookValidators,
  ratingValidators,
  reviewValidators,
} = require("../validators/book.validators");

const router = Router();

router
  .route("/")
  .get(getBooksHandler)
  .post(mutationLimiter, protectWebForm, createBookValidators, validateBookForm, createBookHandler);

router.get("/new", getAddBookHandler);

router.get("/:id", bookIdValidator, validateRequest, getBookHandler);
router.post(
  "/:id/ratings",
  mutationLimiter,
  protectWebForm,
  ratingValidators,
  validateRequest,
  createRatingHandler,
);
router.post(
  "/:id/reviews",
  mutationLimiter,
  protectWebForm,
  reviewValidators,
  validateRequest,
  createReviewHandler,
);
router.post(
  "/:id/delete",
  deleteLimiter,
  protectWebForm,
  bookIdValidator,
  validateRequest,
  deleteBookHandler,
);

module.exports = router;
