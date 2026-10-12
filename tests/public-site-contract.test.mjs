import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const app = readFileSync(new URL("../app/page.tsx", import.meta.url), "utf8");
const styles = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");
const layout = readFileSync(new URL("../app/layout.tsx", import.meta.url), "utf8");
const plan = readFileSync(new URL("../docs/roadmap/public-platform-foundation.md", import.meta.url), "utf8");
const staticCopy = readFileSync(new URL("../scripts/copy-static.mjs", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const nextConfig = readFileSync(new URL("../next.config.ts", import.meta.url), "utf8");

test("public homepage includes the main product story and core sections", () => {
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

test("the Next.js page is safe to render on the server", () => {
  assert.match(app, /^"use client";/);
  assert.match(app, /usePathname\(\)/);
  assert.doesNotMatch(app, /window\.location\.pathname/);
  assert.match(layout, /metadataBase/);
  assert.match(layout, /lang="ar" dir="rtl"/);
});

test("Arabic RTL and English LTR are explicit in the client experience", () => {
  assert.match(app, /dir = lang === "ar" \? "rtl" : "ltr"/);
  assert.match(app, /^  ar:/m);
  assert.match(app, /^  en:/m);
});

test("responsive, focus-visible, and reduced-motion styles exist", () => {
  assert.match(styles, /@media\(max-width:780px\)/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /:focus-visible/);
});

test("Next.js is the build framework and legacy static routes are preserved", () => {
  assert.ok(pkg.dependencies.next, "Next.js dependency is required");
  assert.equal("vite" in pkg.dependencies, false, "Vite must not remain the active build framework");
  assert.match(pkg.scripts.build, /next build/);
  assert.match(staticCopy, /"owner", "public\/owner"/);
  assert.match(staticCopy, /"templates", "public\/templates"/);
  assert.match(staticCopy, /assets\/brand\/menuun/);
  assert.match(nextConfig, /owner\/index\.html/);
  assert.match(nextConfig, /templates\/atelier-09\/index\.html/);
});

test("SEO discovery endpoints are implemented", () => {
  assert.ok(readFileSync(new URL("../app/robots.ts", import.meta.url), "utf8").includes("MetadataRoute.Robots"));
  assert.ok(readFileSync(new URL("../app/sitemap.ts", import.meta.url), "utf8").includes("MetadataRoute.Sitemap"));
});

test("the documented product boundary keeps authentication and booking honest", () => {
  assert.match(plan, /Phase 2 — Authentication and identity/);
  assert.match(plan, /Only Phase 1 is authorized/);
});
