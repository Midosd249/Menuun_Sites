import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const route = await readFile(new URL("../app/api/public-salon-assistant/route.ts", import.meta.url), "utf8");
const widget = await readFile(new URL("../app/s/[slug]/ai-assistant.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");

test("AI provider credentials and upstream requests remain server-side", () => {
  assert.match(route, /env\.INCEPTION_API_KEY/);
  assert.match(route, /env\.CEREBRAS_API/);
  assert.match(route, /env\.GROK_API/);
  assert.match(route, /env\.NVIDIA_NIM_API/);
  assert.doesNotMatch(widget, /INCEPTION_API_KEY|CEREBRAS_API|GROK_API|NVIDIA_NIM_API/);
  assert.match(route, /Authorization:\s*\`Bearer/);
});

test("endpoint validates request size, history, message roles and per-instance rate limit", () => {
  assert.match(route, /raw\.length > 12_000/);
  assert.match(route, /MAX_REQUESTS = 8/);
  assert.match(route, /input\.messages\.length > 8/);
  assert.match(route, /content\.length > 700/);
  assert.match(route, /messages\[messages\.length - 1\]\?\.role !== "user"/);
});

test("assistant context is loaded server-side from active published salon data", () => {
  assert.match(route, /\.eq\("is_active", true\)/);
  assert.match(route, /\.eq\("is_published", true\)/);
  assert.match(route, /loadPublicSalonContext\(slug\)/);
});

test("assistant explicitly cannot create or confirm bookings and never claims booking success", () => {
  assert.match(route, /cannot create, modify, confirm or cancel bookings/);
  assert.match(route, /لا يمكنك إنشاء الحجوزات أو تعديلها أو تأكيدها أو إلغاؤها/);
  assert.match(route, /Cache-Control.*no-store/);
});

test("public salon page mounts the floating assistant without changing booking form contracts", () => {
  assert.match(page, /SalonAiAssistant/);
  assert.match(page, /<SalonAiAssistant\s+slug=\{salon\.slug\}/);
  assert.match(page, /<PublicBookingForm slug=\{salon\.slug\}/);
});
