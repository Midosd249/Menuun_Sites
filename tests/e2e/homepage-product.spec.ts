import { test, expect } from "@playwright/test";

const widths = [320, 360, 390, 768, 1024, 1440];

for (const width of widths) {
  test("homepage product story is responsive at " + width + "px", async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "ar");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("أدر صالونك");
    await expect(page.locator(".owner-workspace")).toBeVisible();
    await expect(page.locator(".public-salon-preview")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      viewport: window.innerWidth,
      document: document.documentElement.scrollWidth,
      body: document.body.scrollWidth
    }));
    expect(Math.max(dimensions.document, dimensions.body), JSON.stringify(dimensions))
      .toBeLessThanOrEqual(dimensions.viewport);

    await page.screenshot({
      path: testInfo.outputPath("homepage-ar-" + width + ".png"),
      fullPage: true
    });
  });
}

test("homepage language switch updates content and document direction", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to English" }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Run your salon");
  await expect(page.getByRole("link", { name: "Owner sign in" })).toHaveAttribute("href", "/login/");
  await expect(page.getByRole("link", { name: "Explore a salon page" })).toHaveAttribute("href", "/s/atelier-09");
});

test("mobile navigation supports open, selection and Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "فتح القائمة" });
  const navigation = page.locator("#homepage-navigation");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await expect(navigation).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".mobile-menu")).toHaveAttribute("aria-expanded", "false");
  await page.locator(".mobile-menu").click();
  await navigation.getByRole("link", { name: "كيف يعمل" }).click();
  await expect(page.locator(".mobile-menu")).toHaveAttribute("aria-expanded", "false");
  await expect(page).toHaveURL(/#how-it-works$/);
});

test("homepage FAQ exposes its controlled answer and primary CTAs use real routes", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");
  const firstQuestion = page.locator(".homepage-faq-item").first().getByRole("button");
  const answerId = await firstQuestion.getAttribute("aria-controls");
  expect(answerId).toBeTruthy();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#" + answerId)).toBeVisible();
  await firstQuestion.click();
  await expect(firstQuestion).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#" + answerId)).toBeHidden();
  await expect(page.getByRole("link", { name: "دخول المالك" }).first()).toHaveAttribute("href", "/login/");
  await expect(page.getByRole("link", { name: "استكشف صفحة صالون" }).first()).toHaveAttribute("href", "/s/atelier-09");
});

test("homepage respects reduced-motion preferences", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const duration = await page.locator(".homepage-feature-card").first().evaluate(element =>
    getComputedStyle(element).transitionDuration
  );
  expect(duration).toMatch(/0\.01ms|0s/);
});
