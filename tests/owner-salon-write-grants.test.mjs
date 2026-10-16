import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const owner = readFileSync(new URL("../app/owner/page.tsx", import.meta.url), "utf8");
const baseGrants = readFileSync(new URL("../supabase/migrations/20261015231139_salons_column_update_grants.sql", import.meta.url), "utf8");
const socialGrants = readFileSync(new URL("../supabase/migrations/20261016040234_owner_social_link_grants_and_appointment_realtime.sql", import.meta.url), "utf8");

test("every owner salon-update field is covered by the narrow grant union", () => {
  const allowed = new Set([...baseGrants, ...socialGrants].join("\n").match(/\b(?:name_ar|name_en|phone|whatsapp|address_ar|city|timezone|template_key|hero_mode|logo_url|instagram_url|tiktok_url|snapchat_url|facebook_url|google_maps_url|website_url)\b/g) || []);
  for (const key of ["name_ar","name_en","phone","whatsapp","address_ar","city","timezone","template_key","logo_url","instagram_url","tiktok_url","snapchat_url","facebook_url","google_maps_url","website_url"]) {
    assert.ok(allowed.has(key), "missing salon UPDATE grant for owner field: " + key);
  }
  assert.match(owner, /from\("salons"\)\.update\(p\)/);
});

test("sensitive salon identity and publication columns are never granted by the new migration", () => {
  assert.doesNotMatch(socialGrants, /GRANT UPDATE[\s\S]*?\b(?:id|slug|created_at|created_by|is_active|is_published|currency_code|primary_color|accent_color)\b[\s\S]*?TO authenticated/i);
  assert.match(socialGrants, /ALTER PUBLICATION supabase_realtime ADD TABLE public\.appointments/);
});
