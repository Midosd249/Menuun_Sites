import { test, expect } from "@playwright/test";

test("fixture owner can switch language, save business names and social links, and test sound", async ({page}) => {
  const consoleErrors:string[]=[];
  page.on("console",message=>{if(message.type()==="error")consoleErrors.push(message.text())});
  await page.goto("/login?next=%2Fowner");
  await page.getByLabel("البريد الإلكتروني").fill("fixture-owner@menuun.test");
  await page.getByLabel("كلمة المرور").fill("FixturePass123!");
  await page.getByRole("button",{name:"تسجيل الدخول"}).click();
  await expect(page).toHaveURL(/\/owner/);
  await expect(page.locator("body")).toContainText(/نظرة عامة|Overview/);

  const languageToggle=page.getByRole("button",{name:/English|العربية/}).first();
  const switchStarted=Date.now();
  await languageToggle.click();
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(page.locator("body")).toContainText("Overview");
  console.log("[locale-switch] ar-to-en visible text ms:",Date.now()-switchStarted);

  await page.getByRole("button",{name:"Business settings"}).click();
  await page.locator('input[name="name_ar"]').fill("صالون الاختبار");
  await page.locator('input[name="name_en"]').fill("Test Salon");
  await page.locator('input[name="instagram_url"]').fill("@fixture-salon");
  await page.locator('input[name="website_url"]').fill("https://fixture.example");
  await page.getByRole("button",{name:"Save changes"}).click();
  await page.reload();
  await page.getByRole("button",{name:"Business settings"}).click();
  await expect(page.locator('input[name="name_en"]')).toHaveValue("Test Salon");
  await expect(page.locator('input[name="instagram_url"]')).toHaveValue("https://instagram.com/fixture-salon");

  await page.getByRole("button",{name:"Overview"}).click();
  for (const templateName of [/Atelier/,/Oasis/,/Forge Men/]) {
    await page.getByRole("button",{name:templateName}).first().click();
    await page.getByRole("button",{name:"حفظ القالب"}).click();
    await expect(page.getByRole("status")).toContainText(/Template saved|تم حفظ القالب/);
  }
  await page.getByRole("button",{name:"Test sound"}).click();
  await expect(page.locator('small[role="status"]')).toContainText(/Sound|played|blocked/i);
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  expect(consoleErrors).toEqual([]);
});
