const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env"), quiet: true });

const parseBoolean = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ["true", "1", "yes"].includes(String(value).toLowerCase());
};

const parseNumber = (name, fallback) => {
  const value = process.env[name];
  if (value === undefined || value === "") return fallback;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${name} must be a number`);
  return parsed;
};

const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = NODE_ENV === "production";
const DATABASE_URL = process.env.DATABASE_URL || "";
const CSRF_SECRET = process.env.CSRF_SECRET || "local-development-csrf-secret-change-me";

if (IS_PRODUCTION && !DATABASE_URL) {
  throw new Error("DATABASE_URL is required in production");
}

if (IS_PRODUCTION && CSRF_SECRET.length < 32) {
  throw new Error("CSRF_SECRET must contain at least 32 characters in production");
}

module.exports = {
  NODE_ENV,
  IS_PRODUCTION,
  PORT: parseNumber("PORT", 3000),
  DATABASE_URL,
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_PORT: parseNumber("DB_PORT", 3306),
  DB_NAME: process.env.DB_NAME || "booksdb",
  DB_USERNAME: process.env.DB_USERNAME || "root",
  DB_PASSWORD: process.env.DB_PASSWORD || "",
  DB_SSL: parseBoolean("DB_SSL", IS_PRODUCTION),
  APP_ORIGIN: process.env.APP_ORIGIN || "http://localhost:3000",
  QA_DASHBOARD_ORIGIN: process.env.QA_DASHBOARD_ORIGIN || "",
  CSRF_SECRET,
  DEMO_MODE: parseBoolean("DEMO_MODE", true),
  DEMO_MAX_BOOKS: parseNumber("DEMO_MAX_BOOKS", 200),
  DEMO_MAX_RATINGS: parseNumber("DEMO_MAX_RATINGS", 2000),
  DEMO_MAX_REVIEWS: parseNumber("DEMO_MAX_REVIEWS", 2000),
  LOG_LEVEL: process.env.LOG_LEVEL || (NODE_ENV === "test" ? "silent" : "info"),
};
