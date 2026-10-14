import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const page = readFileSync(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");
const qr = readFileSync(new URL("../app/s/[slug]/qr-share.tsx", import.meta.url), "utf8");
const booking = readFileSync(new URL("../app/s/[slug]/booking-form.tsx", import.meta.url), "utf8");
const ownerQr = readFileSync(new URL("../app/owner/qr-card.tsx", import.meta.url), "utf8");
const owner = readFileSync(new URL("../app/owner/page.tsx", import.meta.url), "utf8");
const picker = readFileSync(new URL("../app/owner/template-picker.tsx", import.meta.url), "utf8");
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
  assert.match(page, /services\.length \? "#booking"/);
  assert.match(page, /href="#booking">الحجز<\/a>/);
});

test("salon QR controls provide stable page URL, copy and download actions", () => {
  assert.match(qr, /new URL\("\/s\/"\+encodeURIComponent\(slug\),window\.location\.origin\)/);
  assert.match(page, /احجز عبر واتساب/);
  assert.match(page, /طلب حجز خدمة .* عبر واتساب/);
  assert.match(qr, /create-qr-code/);
  assert.match(qr, /navigator\.clipboard\.writeText/);
  assert.match(qr, /download/);
  assert.match(ownerQr, /published/);
  assert.match(owner, /<SalonQrCard/);
});

test("template is Arabic RTL-first, responsive and respects reduced motion", () => {
  assert.match(page, /dir="rtl" lang="ar"/);
  assert.match(css, /@media\(max-width:640px\)/);
  assert.match(css, /@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css, /:hover/);
});

test("public booking uses database RPCs for availability and appointment creation", () => {
  assert.match(page, /<PublicBookingForm slug=\{salon\.slug\}/);
  assert.match(booking, /rpc\("get_public_booking_slots"/);
  assert.match(booking, /rpc\("request_salon_appointment"/);
  for (const arg of ["p_salon_slug", "p_service_id", "p_barber_id", "p_customer_name", "p_customer_phone", "p_starts_at", "p_customer_note"]) {
    assert.ok(booking.includes(arg), "expected booking RPC argument " + arg);
  }
  assert.match(booking, /role="alert"/);
  assert.match(booking, /بانتظار تأكيد الصالون/);
  assert.doesNotMatch(booking, /\.from\(["']appointments["']\)\.insert/);
});

test("salon owner can choose one of three saved visual templates", () => {
  assert.match(page, /template_key/);
  assert.match(page, /fallback=await db\.from\(["']salons["']\)/);
  assert.match(page, /styles\.templateOasis/);
  assert.match(page, /styles\.templateRose/);
  assert.match(page, /searchParams/);
  assert.match(picker, /\?template=/);
  assert.match(owner, /TemplatePicker/);
  assert.match(owner, /template-picker/);
});

test("owner can upload salon branding and public gallery images to the dedicated public-media bucket", () => {
  const mediaEditor = readFileSync(new URL("../app/owner/media-editor.tsx", import.meta.url), "utf8");
  const migration = readFileSync(new URL("../supabase/migrations/20261014120000_salon_templates_public_media.sql", import.meta.url), "utf8");
  assert.match(mediaEditor, /salon-public-media/);
  assert.match(mediaEditor, /BUCKET = "salon-public-media"/);
  assert.match(mediaEditor, /storage\.from\(BUCKET\)\.upload/);
  assert.match(mediaEditor, /media_assets/);
  assert.match(migration, /template_key/);
  assert.match(migration, /salon-public-media/);
});

test("owner can edit existing services, not only add them", () => {
  assert.match(owner, /updateService/);
  assert.match(owner, /name_ar.*price_sar.*duration_minutes/s);
  assert.match(owner, /حفظ/);
});

test("public salon remains available before the optional template migration is applied", () => {
  assert.match(page, /template_key/);
  assert.match(page, /legacySalonColumns/);
  assert.match(page, /template_key\|instagram_url\|tiktok_url/);
  assert.match(page, /fallback\.data \? \{ \.\.\.fallback\.data, template_key: fallback\.data\.template_key \|\| "atelier"/);
});

test("owner preview links can render a template without saving it to the salon", () => {
  assert.match(page, /searchParams/);
  assert.match(page, /requestedTemplate/);
  assert.match(page, /templateKey/);
  assert.match(page, /\["atelier","oasis","rose"\]/);
});

test("public salon always shows real service imagery and barber portraits with useful fallbacks", () => {
  assert.match(page, /service\.image_url/);
  assert.match(page, /SERVICE_IMAGE_FALLBACKS/);
  assert.match(page, /BARBER_IMAGE_FALLBACKS/);
  assert.match(page, /className=\{styles\.serviceImage\}/);
  assert.match(page, /className=\{styles\.personImage\}/);
  assert.match(css, /\.serviceImage img/);
  assert.match(css, /\.personImage img/);
});

test("owner can manage service photos, barber portraits and social/location links", () => {
  const mediaEditor = readFileSync(new URL("../app/owner/media-editor.tsx", import.meta.url), "utf8");
  const migration = readFileSync(new URL("../supabase/migrations/20261014120000_salon_templates_public_media.sql", import.meta.url), "utf8");
  for (const value of ["uploadServiceImage", "uploadBarberImage", "instagram_url", "tiktok_url", "snapchat_url", "facebook_url", "google_maps_url", "website_url"]) {
    assert.ok(mediaEditor.includes(value), "expected owner editor to include " + value);
  }
  assert.match(migration, /alter table public\\.services\\s+add column if not exists image_url/);
  for (const value of ["instagram_url", "tiktok_url", "snapchat_url", "facebook_url", "google_maps_url", "website_url"]) {
    assert.ok(migration.includes(value), "expected migration to add " + value);
  }
});

test("public salon exposes verified social links and map directions", () => {
  for (const value of ["instagram_url", "tiktok_url", "snapchat_url", "facebook_url", "google_maps_url", "website_url", "socialLinks", "href={mapHref}"]) {
    assert.ok(page.includes(value), "expected public page to include " + value);
  }
  assert.match(page, /rel="noopener noreferrer"/);
  assert.match(css, /\.socialLinks/);
});
