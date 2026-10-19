import { test, expect } from "@playwright/test";

test("anonymous owner access redirects to a clean sign-in page", async ({ page }) => {
  await page.goto("/owner/");
  await expect(page).toHaveURL(/\/login\?next=%2Fowner$/);
  await expect(page.getByRole("heading", { name: "تسجيل الدخول" })).toBeVisible();
  const alerts = await page.getByRole("alert").allTextContents();
  const visibleAlerts = alerts.filter((message) => message.trim().length > 0);
  expect(visibleAlerts, `unexpected sign-in alert(s): ${visibleAlerts.join(" | ")}`).toHaveLength(0);
});
