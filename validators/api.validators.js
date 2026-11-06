const { body, param, query } = require("express-validator");

const positiveBookId = param("id")
  .isInt({ min: 1 })
  .withMessage("Book ID must be a positive integer");

const listBookValidators = [
  query("sort").optional().isIn(["asc", "desc"]).withMessage("sort must be asc or desc"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("limit must be between 1 and 50"),
  query("offset").optional().isInt({ min: 0 }).withMessage("offset must be zero or greater"),
];

const createApiBookValidators = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("title is required and cannot exceed 45 characters"),
  body("author")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("author is required and cannot exceed 45 characters"),
  body("imageUrl")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("imageUrl is required and cannot exceed 255 characters")
    .bail()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("imageUrl must be a valid http or https URL"),
  body("description")
    .trim()
    .isLength({ min: 1, max: 12000 })
    .withMessage("description is required and cannot exceed 12000 characters"),
];

const createApiRatingValidators = [
  positiveBookId,
  body("rating").isInt({ min: 1, max: 5 }).withMessage("rating must be a whole number from 1 to 5"),
];

const createApiReviewValidators = [
  positiveBookId,
  body("review")
    .trim()
    .isLength({ min: 1, max: 12000 })
    .withMessage("review is required and cannot exceed 12000 characters"),
];

module.exports = {
  positiveBookId,
  listBookValidators,
  createApiBookValidators,
  createApiRatingValidators,
  createApiReviewValidators,
};
