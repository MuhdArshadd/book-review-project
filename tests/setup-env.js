process.env.NODE_ENV = "test";
process.env.DB_NAME = process.env.TEST_DB_NAME || "booksdb_test";
process.env.DB_SSL = "false";
process.env.CSRF_SECRET = "test-csrf-secret-that-is-longer-than-thirty-two-characters";
process.env.APP_ORIGIN = "http://localhost:3000";
process.env.DEMO_MODE = "true";
process.env.LOG_LEVEL = "silent";
