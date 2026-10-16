import { test, expect } from "@playwright/test";

test("owner tabs fit the complete viewport matrix in Arabic and English", async ({page}) => {
  await page.goto("/login?next=%2Fowner");
  await page.getByLabel("البريد الإلكتروني").fill("fixture-owner@menuun.test");
  await page.getByLabel("كلمة المرور").fill("FixturePass123!");
  await page.getByRole("button",{name:"تسجيل الدخول"}).click();
  await expect(page).toHaveURL(/\/owner/);
  const widths=[270,320,360,390,430,768,1440];
  for(const locale of ["ar","en"] as const){
    const current=await page.locator("html").getAttribute("lang");
    if(current!==locale){
      await page.getByRole("button",{name:/English|العربية/}).first().click();
      await expect(page.locator("html")).toHaveAttribute("lang",locale);
    }
    const tabs=locale==="ar"?["نظرة عامة","المواعيد","الخدمات والأسعار","فريق العمل","الإعدادات"]:["Overview","Appointments","Services & pricing","Team","Business settings"];
    for(const width of widths){
      await page.setViewportSize({width,height:900});
      for(const tab of tabs){
        await page.getByRole("button",{name:tab}).click();
        const result=await page.evaluate(()=>({
          viewport:innerWidth,
          scroll:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth),
          perCharacter:[...document.querySelectorAll("*")].some(el=>getComputedStyle(el).wordBreak==="break-all"),
          textBlocks:[...document.querySelectorAll('[class*="owner-panel"],[class*="owner-stat"],[class*="owner-notice"]')]
            .filter(el=>(el.textContent||"").trim().length>0)
            .map(el=>({width:(el as HTMLElement).getBoundingClientRect().width,text:(el.textContent||"").trim().slice(0,80)}))
        }));
        expect(result.scroll,locale+" "+width+" "+tab).toBeLessThanOrEqual(result.viewport);
        expect(result.perCharacter,locale+" "+width+" "+tab).toBe(false);
        for(const block of result.textBlocks)expect(block.width,JSON.stringify(block)).toBeGreaterThanOrEqual(120);
      }
    }
  }
});
