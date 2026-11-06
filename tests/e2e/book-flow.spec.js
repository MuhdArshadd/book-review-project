const { test, expect } = require("@playwright/test");

test("visitor can add, rate, review, sort, and delete a book", async ({ page }) => {
  const title = `Playwright Book ${Date.now()}`;

  await page.goto("/books/new");
  await page.getByLabel("Book Title").fill(title);
  await page.getByLabel("Book Author").fill("Browser Tester");
  await page.getByLabel("Book Image URL").fill("https://example.com/playwright-cover.jpg");
  await page.getByLabel("Book Description").fill("A disposable browser test record.");
  await page.getByRole("button", { name: "Add Book" }).click();

  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await page.getByLabel("5 ★").check();
  await page.getByRole("button", { name: "Submit Rating" }).click();
  await expect(page.getByText(/5\.0 \/ 5/)).toBeVisible();

  await page.getByLabel("Your review").fill("Created by the Playwright end-to-end test.");
  await page.getByRole("button", { name: "Post Review" }).click();
  await expect(page.getByText("Created by the Playwright end-to-end test.")).toBeVisible();

  await page.getByRole("link", { name: "All Books" }).click();
  await page.getByLabel("Sort by title").selectOption("desc");
  await expect(page.getByText(title, { exact: true })).toBeVisible();
  await page.getByText(title, { exact: true }).click();

  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete Book" }).click();
  await expect(page.getByText(title, { exact: true })).toHaveCount(0);
});
