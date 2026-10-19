import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const qr = readFileSync(new URL("../app/owner/qr-card.tsx", import.meta.url), "utf8");
const owner = readFileSync(new URL("../app/owner/page.tsx", import.meta.url), "utf8");
const mediaEditor = readFileSync(new URL("../app/owner/media-editor.tsx", import.meta.url), "utf8");

test("owner QR card contains no internal preview or saved-template wording", () => {
  const internalCopy = /vercel|القالب\s+المحفوظ|saved[- ]template|preview[- ]address|preview[- ]url|preview deployment|عنوان\s+معاينة|رابط\s+المعاينة|معاينة\s+vercel/i;
  assert.doesNotMatch(qr, internalCopy);
  assert.doesNotMatch(qr, /فتح الصفحة|شارك رابط صالونك|لم يتم نشر الصفحة بعد/i);
  assert.match(qr, /salonName/);
  assert.match(qr, /publicOrigin/);
  assert.match(qr, /navigator\.clipboard\.writeText/);
  assert.match(qr, /navigator\.share/);
  assert.match(qr, /Download/);
});

test("the social, map and website columns have one owner form writer", () => {
  for (const key of ["instagram_url", "tiktok_url", "snapchat_url", "facebook_url", "google_maps_url", "website_url"]) {
    assert.doesNotMatch(owner, new RegExp(key), "duplicate Settings form should not reference " + key);
    assert.ok(mediaEditor.includes(key), "Website & social media form should own " + key);
  }
  assert.match(mediaEditor, /async function saveSocialLinks/);
  assert.match(mediaEditor, /from\("salons"\)\.update\(payload\)/);
  assert.match(mediaEditor, /الموقع ووسائل التواصل الاجتماعي/);
  assert.match(mediaEditor, /Website & social media/);
});
