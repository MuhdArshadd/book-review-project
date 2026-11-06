const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["junit", { outputFile: "reports/playwright-junit.xml" }],
  ],
  use: {
    baseURL: process.env.E2E_BASE_URL || "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: "npm start",
        url: "http://127.0.0.1:3000/health/ready",
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
