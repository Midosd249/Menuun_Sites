import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("homepage explains the real owner-workspace to public-salon workflow", () => {
  for (const phrase of ["owner-workspace", "public-salon-preview", "appointments", "services", "team", "opening-hours", "QR"]) {
    assert.ok(app.includes(phrase), "homepage is missing product evidence: " + phrase);
  }
  assert.match(app, /\/s\/atelier-09/);
  assert.match(app, /\/login\//);
});

test("homepage presents only the three live salon templates", () => {
  for (const name of ["Atelier", "Oasis", "Forge Men"]) assert.ok(app.includes(name));
  assert.doesNotMatch(app, /Essential|Editorial/);
});

test("homepage has Arabic and English product copy and accessible responsive navigation", () => {
  assert.match(app, /dir = lang === "ar" \? "rtl" : "ltr"/);
  assert.match(app, /معاينة توضيحية/);
  assert.match(app, /Illustrative preview/);
  assert.match(app, /aria-expanded=\{menuOpen\}/);
  assert.match(app, /aria-controls="homepage-navigation"/);
  assert.match(app, /aria-controls=\{"homepage-faq-answer-" \+ index\}/);
  assert.match(styles, /homepage-product/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /:focus-visible/);
});

test("homepage marketing claims avoid invented commercial capabilities", () => {
  assert.doesNotMatch(app, /offer (?:a )?(?:free trial|free plan|payment gateway)|multi-branch|payroll|loyalty program|we offer online payments/i);
  assert.doesNotMatch(app, /نوفر (?:تجربة مجانية|بوابة دفع)|ندعم بوابة دفع|إدارة الرواتب|برنامج ولاء/);
  assert.match(app, /There is no online payment gateway at present/);
  assert.match(app, /لا تعرض المنصة حاليًا بوابة دفع إلكتروني/);
});
