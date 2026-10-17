import { test, expect } from "@playwright/test";

test("anonymous owner access redirects to a clean sign-in page", async ({ page }) => {
  await page.goto("/owner/");
  await expect(page).toHaveURL(/\/login\/\?next=%2Fowner%2F$/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
  await expect(page.getByRole("alert")).toHaveCount(0);
});
