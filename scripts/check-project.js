const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");

const requiredFiles = [
  "index.js",
  "app.js",
  ".env.example",
  "render.yaml",
  "config/env.config.js",
  "config/openapi.config.js",
  "controllers/book.controller.js",
  "controllers/api/book-api.controller.js",
  "controllers/health.controller.js",
  "middleware/error.middleware.js",
  "middleware/validation.middleware.js",
  "middleware/csrf.middleware.js",
  "middleware/rate-limit.middleware.js",
  "models/book.model.js",
  "models/rating.model.js",
  "models/review.model.js",
  "routes/book.routes.js",
  "routes/api/book-api.routes.js",
  "routes/health.routes.js",
  "services/book.service.js",
  "validators/book.validators.js",
  "validators/api.validators.js",
  "views/index.ejs",
  "views/add-book.ejs",
  "views/book-details.ejs",
  "database/schema.sql",
  "migrations/001-create-book-review-schema.js",
  "docs/api/openapi.yaml",
  ".github/workflows/ci.yml",
  ".github/workflows/docs.yml",
  ".github/workflows/reset-demo.yml",
];

const missingFiles = requiredFiles.filter((file) => {
  return !fs.existsSync(path.join(projectRoot, file));
});

if (missingFiles.length > 0) {
  console.error(`Missing required files: ${missingFiles.join(", ")}`);
  process.exitCode = 1;
  return;
}

const javascriptFiles = [];
const ignoredDirectories = new Set([
  "node_modules",
  ".git",
  "coverage",
  "reports",
  "playwright-report",
  "test-results",
  "dist",
  "cache",
]);

const findJavascriptFiles = (folder) => {
  fs.readdirSync(folder, { withFileTypes: true }).forEach((entry) => {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) return;

    const fullPath = path.join(folder, entry.name);
    if (entry.isDirectory()) findJavascriptFiles(fullPath);
    if (entry.isFile() && entry.name.endsWith(".js")) javascriptFiles.push(fullPath);
  });
};

findJavascriptFiles(projectRoot);

javascriptFiles.forEach((file) => {
  execFileSync(process.execPath, ["--check", file], { stdio: "pipe" });
});

console.log(`Project check passed (${javascriptFiles.length} JavaScript files checked).`);
