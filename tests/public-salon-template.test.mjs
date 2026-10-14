import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");
const qr = readFileSync(new URL("../app/s/[slug]/qr-share.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/s/[slug]/public-salon.module.css", import.meta.url), "utf8");

test("public salon template resolves only active, published tenants by stable slug", () => {
  assert.match(page, /\.eq\("slug",slug\)\.eq\("is_active",true\)\.eq\("is_published",true\)/);
  assert.match(page, /if \(!result\) notFound\(\)/);
  assert.match(page, /export const dynamic = "force-dynamic"/);
});

test("public page displays service, team, hours, contact and public media data", () => {
  for (const value of ["services", "barbers", "business_hours", "media_assets", "whatsapp", "phone", "address_ar", "price_sar", "duration_minutes"]) {
    assert.ok(page.includes(value), "expected template to include " + value);
  }
  assert.match(page, /generateMetadata/);
  assert.match(page, /target=\{wa \? "_blank" : undefined\}/);
});

test("QR sharing includes a stable public URL, copy action and QR download link", () => {
  assert.match(page, /new URL\("\/s\/"/);
  assert.match(qr, /create-qr-code/);
  assert.match(qr, /navigator\.clipboard\.writeText/);
  assert.match(qr, /download/);
});

test("template is Arabic RTL-first, responsive and respects reduced motion", () => {
  assert.match(page, /dir="rtl" lang="ar"/);
  assert.match(css, /@media\(max-width:640px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /:hover/);
});
