import { test, expect } from "@playwright/test";

const widths = [270, 320, 360, 390, 430, 768, 1440];
const salons = [
  {slug:"fixture-atelier",template:"atelier",ar:"صالون الاختبار",en:"Test Salon"},
  {slug:"fixture-oasis",template:"oasis",ar:"صالون الاختبار",en:"Test Salon"},
  {slug:"fixture-rose",template:"rose",ar:"صالون الاختبار",en:"Test Salon"}
];

for (const salon of salons) {
  for (const lang of ["ar","en"] as const) {
    for (const width of widths) {
      test(`public ${salon.template} ${lang} at ${width}px`, async ({page}, testInfo) => {
        await page.setViewportSize({width,height:900});
        const response = await page.goto(`/s/${salon.slug}?lang=${lang}`);
        expect(response?.status()).toBe(200);
        await expect(page.locator("body")).toContainText(lang==="ar"?salon.ar:salon.en);
        await expect(page.locator("body")).not.toContainText(/صالون العناية|Grooming Studio/);
        const layout = await page.evaluate(() => {
          const body = document.body;
          const root = document.documentElement;
          const visible = [...document.querySelectorAll("header, main, footer, .brand, .heroCopy, .owner-panel, .owner-stat")]
            .filter(el => (el as HTMLElement).getClientRects().length > 0)
            .map(el => ({tag:el.tagName,className:(el as HTMLElement).className,width:(el as HTMLElement).getBoundingClientRect().width,text:(el.textContent||"").trim()}));
          const broken = [...document.querySelectorAll("*")].some(el => {
            const style=getComputedStyle(el);
            return style.wordBreak==="break-all" || style.overflowWrap==="anywhere" && style.wordBreak==="break-all";
          });
          return {scrollWidth:Math.max(body.scrollWidth,root.scrollWidth),viewport:innerWidth,lang:root.lang,dir:root.dir,visible,broken};
        });
        expect(layout.scrollWidth,JSON.stringify(layout.visible)).toBeLessThanOrEqual(layout.viewport);
        expect(layout.broken).toBe(false);
        expect(layout.lang).toBe(lang);
        expect(layout.dir).toBe(lang==="ar"?"rtl":"ltr");
        for (const el of layout.visible.filter(x=>x.text && /owner-panel|owner-stat|brand|heroCopy/.test(x.className))) {
          expect(el.width,JSON.stringify(el)).toBeGreaterThanOrEqual(120);
        }
        const logo=page.locator("header .brand img").first();
        if(await logo.count()) {
          const box=await logo.boundingBox();
          expect(box).not.toBeNull();
          expect(box!.height).toBeGreaterThanOrEqual(width<=360?64:width<=640?68:84);
          expect(box!.height).toBeLessThanOrEqual(width<=640?72:96);
        }
        if(salon.slug==="fixture-atelier"&&lang==="ar") {
          const phone=page.locator(".atelierPhone");
          if(await phone.count()) await expect(phone).toBeVisible();
        }
        const errors:string[]=[];
        page.on("console",message=>{if(message.type()==="error")errors.push(message.text())});
        await page.screenshot({path:testInfo.outputPath(`${salon.template}-${lang}-${width}.png`),fullPage:true});
        expect(errors).toEqual([]);
      });
    }
  }
}
