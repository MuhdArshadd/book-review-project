const crypto = require("crypto");
const { AppError } = require("../utils/app-error");
const { CSRF_SECRET, IS_PRODUCTION } = require("../config/env.config");

const COOKIE_NAME = "book_review_csrf";

const signToken = (token) => {
  return crypto.createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
};

const createSignedToken = () => {
  const token = crypto.randomBytes(32).toString("hex");
  return `${token}.${signToken(token)}`;
};

const readValidToken = (signedToken) => {
  if (!signedToken || typeof signedToken !== "string") return null;

  const [token, signature] = signedToken.split(".");
  if (!token || !signature) return null;

  const expected = Buffer.from(signToken(token));
  const provided = Buffer.from(signature);
  if (expected.length !== provided.length) return null;

  return crypto.timingSafeEqual(expected, provided) ? token : null;
};

const issueCsrfToken = (req, res, next) => {
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) return next();

  let signedToken = req.cookies[COOKIE_NAME];
  let token = readValidToken(signedToken);

  if (!token) {
    signedToken = createSignedToken();
    token = readValidToken(signedToken);
    res.cookie(COOKIE_NAME, signedToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: IS_PRODUCTION,
      path: "/",
    });
  }

  req.csrfToken = token;
  res.locals.csrfToken = token;
  next();
};

const protectWebForm = (req, res, next) => {
  const cookieToken = readValidToken(req.cookies[COOKIE_NAME]);
  const formToken = req.body?._csrf;

  if (!cookieToken || !formToken || cookieToken !== formToken) {
    return next(
      new AppError(
        "The form session expired. Refresh the page and try again.",
        403,
        "CSRF_TOKEN_INVALID",
      ),
    );
  }

  next();
};

module.exports = { issueCsrfToken, protectWebForm };
