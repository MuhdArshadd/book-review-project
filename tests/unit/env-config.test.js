const originalEnvironment = { ...process.env };

const loadConfig = (overrides = {}) => {
  process.env = {
    ...originalEnvironment,
    NODE_ENV: "production",
    DATABASE_URL: "mysql://user:password@example.com:4000/books",
    CSRF_SECRET: "a-production-csrf-secret-with-32-characters",
    ...overrides,
  };

  jest.resetModules();
  return require("../../config/env.config");
};

afterEach(() => {
  process.env = { ...originalEnvironment };
  jest.resetModules();
});

test("enables database TLS by default in production", () => {
  const config = loadConfig({ DB_SSL: undefined });

  expect(config.DB_SSL).toBe(true);
});

test("parses explicit boolean environment values", () => {
  const config = loadConfig({ DB_SSL: "true", DEMO_MODE: "false" });

  expect(config.DB_SSL).toBe(true);
  expect(config.DEMO_MODE).toBe(false);
});

test("rejects disabled database TLS in production", () => {
  expect(() => loadConfig({ DB_SSL: "false" })).toThrow("DB_SSL must be true in production");
});
