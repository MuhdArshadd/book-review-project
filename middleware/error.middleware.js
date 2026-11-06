const errorHandler = (error, req, res, next) => {
  if (res.headersSent) return next(error);

  let statusCode = error.statusCode || error.status || 500;
  let message = error.message;
  let code = error.code || "INTERNAL_SERVER_ERROR";
  let details = error.details;

  if (error.name === "SequelizeValidationError") {
    statusCode = 400;
    code = "DATABASE_VALIDATION_ERROR";
  }
  if (error.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    code = "BOOK_ALREADY_EXISTS";
    message = "This book has already been added";
  }
  if (error.name === "SequelizeForeignKeyConstraintError") {
    statusCode = 409;
    code = "DATABASE_RELATION_CONFLICT";
  }
  if (error.type === "entity.too.large") {
    statusCode = 413;
    code = "PAYLOAD_TOO_LARGE";
    message = "The request body is too large";
  }
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    statusCode = 400;
    code = "INVALID_JSON";
    message = "The request body contains invalid JSON";
  }
  if (statusCode === 500) {
    message = "Something went wrong. Please try again.";
    details = undefined;
  }

  if (statusCode >= 500) {
    req.log?.error({ error, requestId: req.id }, "Request failed");
  }

  if (
    req.originalUrl.startsWith("/api/") ||
    req.originalUrl.startsWith("/health/") ||
    req.accepts(["html", "json"]) === "json"
  ) {
    return res.status(statusCode).json({
      error: {
        code,
        message,
        ...(details ? { details } : {}),
        requestId: req.id,
      },
    });
  }

  res.status(statusCode).render("error", {
    pageTitle: `Error ${statusCode}`,
    statusCode,
    message,
  });
};

module.exports = { errorHandler };
