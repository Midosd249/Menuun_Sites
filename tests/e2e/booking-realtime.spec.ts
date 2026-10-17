import { test, expect } from "@playwright/test";

test("a real local public booking INSERT reaches the owner via Realtime and chimes once", async ({page}) => {
  await page.addInitScript(() => {
    const Original = window.AudioContext;
    (window as any).__soundStarts = 0;
    (window as any).AudioContext = class extends Original {
      createOscillator() {
        const oscillator = super.createOscillator();
        const originalStart = oscillator.start.bind(oscillator);
        oscillator.start = (...args: any[]) => {
          (window as any).__soundStarts = ((window as any).__soundStarts || 0) + 1;
          return originalStart(...args);
        };
        return oscillator;
      }
    };
  });
  await page.goto("/login?next=%2Fowner");
  await page.getByLabel("البريد الإلكتروني").fill("fixture-owner@menuun.test");
  await page.getByLabel("كلمة المرور").fill("FixturePass123!");
  await page.getByRole("button",{name:"تسجيل الدخول"}).click();
  await expect(page).toHaveURL(/\/owner/);
  await page.locator('select[aria-label="Business"]').selectOption("60000000-0000-4000-8000-000000000002");
  await expect(page.locator("body")).toContainText("صالون الاختبار");
  await page.getByRole("button",{name:/English|العربية/}).first().click();
  await expect(page.locator("html")).toHaveAttribute("lang","en");
  await expect(page.getByRole("heading",{level:1})).toHaveText("Test Salon");
  await page.getByRole("button",{name:"Test sound"}).click();
  await expect.poll(()=>page.evaluate(()=>(window as any).__soundStarts||0)).toBeGreaterThanOrEqual(2);
  await expect(page.getByRole("button",{name:"Disable sound"})).toBeVisible();

  const bookingPage=await page.context().newPage();
  await bookingPage.goto("/s/fixture-atelier?lang=en");
  const dateInput=bookingPage.getByLabel("Date");
  const nextDate=new Date((await dateInput.inputValue())+"T12:00:00Z");
  nextDate.setUTCDate(nextDate.getUTCDate()+1);
  await dateInput.fill(nextDate.toISOString().slice(0,10));
  const slot=bookingPage.locator('section[id="booking"] button[aria-pressed]').first();
  await expect(slot).toBeVisible({timeout:20000});
  await slot.click();
  await bookingPage.locator('input[name="customer_name"]').fill("Realtime Fixture Customer");
  await bookingPage.locator('input[name="customer_phone"]').fill("+966555500123");
  await bookingPage.getByRole("button",{name:/Submit booking request/}).click();
  await expect(bookingPage.getByRole("status")).toContainText("Booking request sent",{timeout:20000});
  await expect(page.getByText("New booking",{exact:false})).toBeVisible({timeout:20000});
  await expect.poll(()=>page.evaluate(()=>(window as any).__soundStarts||0),{timeout:20000}).toBe(4);
  await page.waitForTimeout(1000);
  expect(await page.evaluate(()=>(window as any).__soundStarts||0)).toBe(4);
  await bookingPage.close();
});
