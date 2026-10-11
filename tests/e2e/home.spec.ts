import { expect, test } from "@playwright/test";

test("salon landing page presents core sections and booking action", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Luma Studio/);
  await expect(page.getByRole("heading", { name: /Your moment/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Your time/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Let’s make it happen/i })).toHaveAttribute("href", /wa\.me/);
});

test("mobile navigation opens and exposes section links", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation behavior is specific to mobile layout");
  await page.goto("/");
  await page.getByRole("button", { name: "Navigation menu" }).click();
  await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Treatments" })).toBeVisible();
});

test("page has no horizontal overflow on mobile viewport", async ({ page, isMobile }) => {
  test.skip(!isMobile, "This assertion targets the mobile viewport");
  await page.goto("/");
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    page: document.documentElement.scrollWidth,
  }));
  expect(dimensions.page).toBeLessThanOrEqual(dimensions.viewport);
});
