import { expect, test } from "@playwright/test";

test("Arabic RTL landing page presents services, team, and booking action", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/سِمت|SIMT/i);
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { name: /حلاقة على مهل/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /خدمات مختارة/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /أصحاب الأيادي الماهرة/i })).toBeVisible();
});

test("language switch changes content and document direction", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /English/i }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { name: /A better kind of cut/i })).toBeVisible();
  await page.getByRole("button", { name: /العربية/i }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("booking journey selects a service, barber, and demo time without claiming a real booking", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /احجز موعدًا/i }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: /قص كلاسيكي/i }).click();
  await dialog.getByRole("button", { name: /التالي/i }).click();
  await dialog.getByRole("button", { name: /عمر/i }).click();
  await dialog.getByRole("button", { name: /التالي/i }).click();
  await dialog.getByRole("button", { name: /غدًا/i }).click();
  await dialog.getByRole("button", { name: /10:00 ص/i }).click();
  await dialog.getByRole("button", { name: /متابعة/i }).click();
  await expect(dialog.getByText(/لا يتم إرسال حجز حقيقي/i)).toBeVisible();
  await dialog.getByLabel("الاسم").fill("عميل تجريبي");
  await dialog.getByLabel("رقم الجوال").fill("0551234567");
  await dialog.getByRole("button", { name: /تأكيد تجريبي/i }).click();
  await expect(dialog.getByRole("heading", { name: /وصلت لنهاية التجربة/i })).toBeVisible();
  await expect(dialog.getByText(/لم يتم إنشاء أي حجز/i)).toBeVisible();
});

test("mobile navigation opens and exposes section links", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Mobile navigation behavior is specific to mobile layout");
  await page.goto("/");
  await page.getByRole("button", { name: /فتح القائمة/i }).click();
  await expect(page.getByRole("navigation", { name: /التنقل الرئيسي/i }).getByRole("link", { name: /الخدمات/i })).toBeVisible();
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
