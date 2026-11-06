const { rateLimit } = require("express-rate-limit");
const { AppError } = require("../utils/app-error");

const rateLimitHandler = (req, res, next) => {
  next(new AppError("Too many requests. Please wait and try again.", 429, "RATE_LIMIT_EXCEEDED"));
};

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  skip: (req) => req.path.startsWith("/health"),
  handler: rateLimitHandler,
});

const mutationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});

const deleteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  handler: rateLimitHandler,
});

module.exports = { globalLimiter, mutationLimiter, deleteLimiter };
