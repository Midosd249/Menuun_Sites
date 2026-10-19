import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const owner = readFileSync(new URL("../app/owner/page.tsx", import.meta.url), "utf8");
const mediaEditor = readFileSync(new URL("../app/owner/media-editor.tsx", import.meta.url), "utf8");
const baseGrants = readFileSync(new URL("../supabase/migrations/20261015231139_salons_column_update_grants.sql", import.meta.url), "utf8");
const socialGrants = readFileSync(new URL("../supabase/migrations/20261016040234_owner_social_link_grants_and_appointment_realtime.sql", import.meta.url), "utf8");
const grantColumns = source => [...source.matchAll(/GRANT UPDATE \(([\s\S]*?)\) ON TABLE public\.salons TO authenticated;/g)].flatMap(match => match[1].split(",").map(x => x.trim()).filter(Boolean));

test("every owner salon-update field is covered by the narrow grant union", () => {
  const allowed = new Set([...grantColumns(baseGrants), ...grantColumns(socialGrants)]);
  for (const key of ["name_ar","name_en","phone","whatsapp","address_ar","city","timezone","template_key","hero_mode","logo_url","instagram_url","tiktok_url","snapchat_url","facebook_url","google_maps_url","website_url"]) {
    assert.ok(allowed.has(key), "missing salon UPDATE grant for owner field: " + key);
  }
  assert.match(owner, /from\("salons"\)\.update\(p\)/);
  assert.doesNotMatch(owner, /instagram_url|tiktok_url|snapchat_url|facebook_url|google_maps_url|website_url/);
  assert.match(mediaEditor, /from\("salons"\)\.update\(payload\)/);
  for (const key of ["instagram_url","tiktok_url","snapchat_url","facebook_url","google_maps_url","website_url"]) {
    assert.ok(mediaEditor.includes(key), "the Website & social media form must write " + key);
  }
});

test("sensitive salon identity and publication columns are never granted by the new migration", () => {
  const socialColumns = grantColumns(socialGrants);
  for (const key of ["id","slug","created_at","created_by","is_active","is_published","currency_code","primary_color","accent_color"]) {
    assert.ok(!socialColumns.includes(key), "sensitive column must stay blocked: " + key);
  }
  assert.match(socialGrants, /ALTER PUBLICATION supabase_realtime ADD TABLE public\.appointments/);
});
