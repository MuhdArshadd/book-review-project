const { validationResult } = require("express-validator");
const { AppError } = require("../utils/app-error");

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const details = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));
    const message = details.map((error) => error.message).join(". ");
    return next(new AppError(message, 400, "VALIDATION_ERROR", details));
  }

  next();
};

const validateBookForm = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).render("add-book", {
      pageTitle: "Add a Book",
      values: req.body,
      errors: errors.array().map((error) => error.msg),
    });
  }

  next();
};

module.exports = { validateRequest, validateBookForm };
