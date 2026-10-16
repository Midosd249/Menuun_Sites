import test from "node:test";
import assert from "node:assert/strict";
import { normalizeSocialUrl } from "../app/owner/social-links.mjs";

test("social handle inputs normalize to HTTPS platform URLs and clearing is supported", () => {
  assert.equal(normalizeSocialUrl("instagram", "@atelier09"), "https://instagram.com/atelier09");
  assert.equal(normalizeSocialUrl("tiktok", "atelier09"), "https://www.tiktok.com/@atelier09");
  assert.equal(normalizeSocialUrl("snapchat", "@atelier09"), "https://www.snapchat.com/add/atelier09");
  assert.equal(normalizeSocialUrl("facebook", "https://www.facebook.com/atelier09"), "https://www.facebook.com/atelier09");
  assert.equal(normalizeSocialUrl("instagram", ""), null);
});

test("social URLs reject off-platform hosts and website requires a valid HTTPS URL", () => {
  assert.throws(() => normalizeSocialUrl("instagram", "https://evil.example/atelier09"), /Instagram/);
  assert.throws(() => normalizeSocialUrl("tiktok", "https://tiktok.com.evil.example/@a"), /TikTok/);
  assert.throws(() => normalizeSocialUrl("website", "atelier09"), /HTTPS/);
  assert.equal(normalizeSocialUrl("website", "https://atelier09.example"), "https://atelier09.example/");
});
