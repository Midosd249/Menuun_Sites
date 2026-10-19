import { test, expect } from "@playwright/test";

test("anonymous owner access redirects to a clean sign-in page", async ({ page }) => {
  await page.goto("/owner/");
  await expect(page).toHaveURL(/\/login\?next=%2Fowner$/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
  const alerts = await page.getByRole("alert").allTextContents();
  expect(alerts, `unexpected sign-in alert(s): ${alerts.join(" | ")}`).toHaveLength(0);
});
