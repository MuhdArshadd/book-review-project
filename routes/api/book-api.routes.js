const { Router } = require("express");
const {
  getBooks,
  getBook,
  postBook,
  postRating,
  postReview,
  deleteBook,
} = require("../../controllers/api/book-api.controller");
const { validateRequest } = require("../../middleware/validation.middleware");
const { mutationLimiter, deleteLimiter } = require("../../middleware/rate-limit.middleware");
const {
  positiveBookId,
  listBookValidators,
  createApiBookValidators,
  createApiRatingValidators,
  createApiReviewValidators,
} = require("../../validators/api.validators");

const router = Router();

router
  .route("/")
  .get(listBookValidators, validateRequest, getBooks)
  .post(mutationLimiter, createApiBookValidators, validateRequest, postBook);

router
  .route("/:id")
  .get(positiveBookId, validateRequest, getBook)
  .delete(deleteLimiter, positiveBookId, validateRequest, deleteBook);

router.post(
  "/:id/ratings",
  mutationLimiter,
  createApiRatingValidators,
  validateRequest,
  postRating,
);

router.post(
  "/:id/reviews",
  mutationLimiter,
  createApiReviewValidators,
  validateRequest,
  postReview,
);

module.exports = router;
