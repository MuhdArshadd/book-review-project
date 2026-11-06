const { body, param } = require("express-validator");

const bookIdValidator = param("id")
  .isInt({ min: 1 })
  .withMessage("Book ID must be a positive number");

const createBookValidators = [
  body("BookName")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("Book title is required and cannot exceed 45 characters"),
  body("BookAuthor")
    .trim()
    .isLength({ min: 1, max: 45 })
    .withMessage("Book author is required and cannot exceed 45 characters"),
  body("BookImage")
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage("Book image URL is required and cannot exceed 255 characters")
    .bail()
    .isURL({ protocols: ["http", "https"], require_protocol: true })
    .withMessage("Book image must be a valid http or https URL"),
  body("Description")
    .trim()
    .isLength({ min: 1, max: 12000 })
    .withMessage("Book description is required and cannot exceed 12000 characters"),
];

const ratingValidators = [
  bookIdValidator,
  body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be a whole number from 1 to 5"),
];

const reviewValidators = [
  bookIdValidator,
  body("review")
    .trim()
    .isLength({ min: 1, max: 12000 })
    .withMessage("Review is required and cannot exceed 12000 characters"),
];

module.exports = {
  bookIdValidator,
  createBookValidators,
  ratingValidators,
  reviewValidators,
};
