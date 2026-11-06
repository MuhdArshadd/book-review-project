const express = require("express");
const path = require("path");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");
const swaggerUi = require("swagger-ui-express");
const router = require("./routes");
const { errorHandler } = require("./middleware/error.middleware");
const { requestLogger } = require("./middleware/request.middleware");
const { issueCsrfToken } = require("./middleware/csrf.middleware");
const { globalLimiter } = require("./middleware/rate-limit.middleware");
const { AppError } = require("./utils/app-error");
const {
  APP_ORIGIN,
  QA_DASHBOARD_ORIGIN,
  DEMO_MODE,
  IS_PRODUCTION,
} = require("./config/env.config");
const { openApiDocument, openApiPath } = require("./config/openapi.config");

const app = express();

app.disable("x-powered-by");
if (IS_PRODUCTION) app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const standardHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    },
  },
});

const documentationHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
});

app.use(requestLogger);
app.use((req, res, next) => {
  const securityMiddleware = req.path.startsWith("/api-docs")
    ? documentationHelmet
    : standardHelmet;
  securityMiddleware(req, res, next);
});
app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: "50kb" }));
app.use(express.urlencoded({ extended: false, limit: "50kb" }));
app.use(globalLimiter);

const allowedOrigins = [APP_ORIGIN, QA_DASHBOARD_ORIGIN].filter(Boolean);
app.use(
  "/api/v1",
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new AppError("Origin is not allowed", 403, "CORS_ORIGIN_DENIED"));
    },
    methods: ["GET", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Request-ID"],
    exposedHeaders: ["X-Request-ID", "RateLimit"],
  }),
);

app.use(
  express.static(path.join(__dirname, "public"), {
    maxAge: IS_PRODUCTION ? "1d" : 0,
    etag: true,
  }),
);

app.use(issueCsrfToken);
app.use((req, res, next) => {
  res.locals.demoMode = DEMO_MODE;
  next();
});

app.get("/openapi.yaml", (req, res) => res.type("yaml").sendFile(openApiPath));
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(openApiDocument, {
    customSiteTitle: "Book Review API Documentation",
    swaggerOptions: { displayRequestDuration: true },
  }),
);
app.use(router);

app.use((req, res, next) => {
  next(new AppError(`Page not found: ${req.originalUrl}`, 404, "ROUTE_NOT_FOUND"));
});

app.use(errorHandler);

module.exports = app;
