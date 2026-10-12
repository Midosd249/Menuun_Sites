import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const plan = readFileSync(new URL("../docs/roadmap/public-platform-foundation.md", import.meta.url), "utf8");

test("public homepage includes core sections and clear platform positioning", () => {
  for (const phrase of ["hero", "benefits", "how-it-works", "templates", "faq", "final-cta"]) {
    assert.ok(app.includes(phrase), `missing public site section: ${phrase}`);
  }
  assert.match(app, /appointment-led businesses|أعمال الخدمات/);
});

test("account entry points are honest and do not fake account creation", () => {
  assert.match(app, /\/login\//);
  assert.match(app, /\/signup\//);
  assert.match(app, /No account has been created|لم يتم إنشاء حساب/);
  assert.doesNotMatch(app, /passwordHash|service_role|SUPABASE_SERVICE_ROLE_KEY/);
});

test("Arabic RTL and English LTR are both explicit", () => {
  assert.match(app, /dir = lang === "ar" \? "rtl" : "ltr"/);
  assert.match(app, /^  ar:/m);
  assert.match(app, /^  en:/m);
  assert.match(html, /lang="ar" dir="rtl"/);
});

test("responsive and reduced-motion styles exist", () => {
  assert.match(styles, /@media\(max-width:780px\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /:focus-visible/);
});

test("the implementation boundary and phased roadmap are documented", () => {
  assert.match(plan, /Phase 2 — Authentication and identity/);
  assert.match(plan, /Only Phase 0 and Phase 1 are authorized/);
});
