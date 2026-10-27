import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const route = await readFile(new URL("../app/api/public-salon-assistant/route.ts", import.meta.url), "utf8");
const widget = await readFile(new URL("../app/s/[slug]/ai-assistant.tsx", import.meta.url), "utf8");
const page = await readFile(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");
const docs = await readFile(new URL("../docs/ai/public-salon-assistant.md", import.meta.url), "utf8");

test("AI provider credentials and upstream requests remain server-side", () => {
  assert.match(route, /env\.CODE_CRAFT_API/);
  assert.match(route, /env\.ITERACOMPUTE_API/);
  assert.match(route, /env\.INCEPTION_API_KEY/);
  assert.match(route, /env\.CEREBRAS_API/);
  assert.match(route, /env\.GROK_API/);
  assert.match(route, /env\.NVIDIA_NIM_API/);
  assert.match(route, /JEF_TYPE_SAFE/);
  assert.doesNotMatch(widget, /CODE_CRAFT_API|ITERACOMPUTE_API|INCEPTION_API_KEY|CEREBRAS_API|GROK_API|NVIDIA_NIM_API|JEF_TYPE_SAFE/);
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

test("CodeCraft and IteraCompute use documented chat endpoints and model identifiers", () => {
  assert.match(route, /www\.codecraftapi\.com\/v1\/chat\/completions/);
  assert.match(route, /model: "qwen3\.8-27b"/);
  assert.match(route, /https:\/\/api\.iteracompute\.com\/v1\/chat\/completions/);
  assert.match(route, /model: "qwen\/qwen3\.8-27b"/);
});

test("TypeSafe Jev is used strictly as a Choice decision/routing model, not as chat completions", () => {
  assert.match(route, /JEF_TYPE_SAFE/);
  assert.match(route, /api\.typesafe\.ai\/v1\/systemone/);
  assert.match(route, /model:\s*"jev-latest"/);
  assert.match(route, /type:\s*"choice"/);
  assert.match(route, /selectProviderWithJev/);
  assert.doesNotMatch(route, /typesafe\.ai\/v1\/chat\/completions/);
});

test("TypeSafe request never receives credentials or full secret material", () => {
  assert.match(route, /selectProviderWithJev/);
  assert.doesNotMatch(route, /criteria:[\s\S]{0,400}key:/);
  assert.match(route, /Never sends credentials|never sends credentials|capability description/i);
});

test("Jev selection validates choice against allowlisted candidate IDs and rejects unknown/malformed responses", () => {
  assert.match(route, /unknown_choice/);
  assert.match(route, /invalid_response/);
  assert.match(route, /eligibleIds\.includes/);
  assert.match(route, /typed\.type !== "choice"/);
});

test("provider registry ignores missing or whitespace-only credentials", () => {
  assert.ok(route.includes("env.CODE_CRAFT_API?.trim()"));
  assert.ok(route.includes("env.ITERACOMPUTE_API?.trim()"));
  assert.ok(route.includes("env.CEREBRAS_API?.trim()"));
  assert.ok(route.includes("env.GROK_API?.trim()"));
  assert.ok(route.includes("env.NVIDIA_NIM_API?.trim()"));
  assert.ok(route.includes("map((k) => k?.trim())"));
});

test("request JSON rejects null, arrays, and primitives before reading fields", () => {
  assert.match(
    route,
    /if\s*\(\s*!parsed\s*\|\|\s*typeof parsed !== ["']object["']\s*\|\|\s*Array\.isArray\(parsed\)\s*\)\s*\{\s*return jsonError/,
  );
});

test("provider keys are trimmed and IteraCompute uses its documented request option", () => {
  assert.ok(route.includes('env.CODE_CRAFT_API?.trim()'));
  assert.ok(route.includes('env.ITERACOMPUTE_API?.trim()'));
  assert.ok(route.includes('model: "qwen/qwen3.8-27b"'));
  assert.ok(route.includes("reasoning: false"));
  assert.ok(route.includes("provider.reasoning === false ? { reasoning: false }"));
});

test("timeout budget accounts for Jev selection plus provider attempts inside the shared deadline", () => {
  assert.ok(route.includes("TOTAL_BUDGET_MS = 11_000") || route.includes("11_000"));
  assert.ok(route.includes("PROVIDER_TIMEOUT_MS = 4_500") || route.includes("4_500"));
  assert.ok(route.includes("JEV_TIMEOUT_MS"));
  assert.ok(route.includes("remainingMs"));
});

test("controlled fallback tries other eligible providers then grounded deterministic answer", () => {
  assert.match(route, /function groundedSalonFallback/);
  assert.match(route, /groundedSalonFallback\(messages\[messages\.length - 1\]\.content, salon, language\)/);
  assert.match(route, /fallback: true/);
  assert.match(route, /defaultFallbackOrder/);
  assert.match(route, /asksHours/);
  assert.match(route, /asksTeam/);
  assert.match(route, /asksContact/);
  assert.match(route, /asksBooking/);
  assert.match(route, /asksService/);
  assert.match(route, /can’t create or confirm an appointment/);
  assert.match(route, /لا أستطيع إنشاء موعد أو تأكيده/);
  assert.match(route, /AI service is temporarily unavailable/);
  assert.match(route, /خدمة المساعد الذكي غير متاحة مؤقتًا/);
});

test("Inception multi-key is treated as credential failover for the same model family", () => {
  assert.match(route, /INCEPTION_API_KEY2/);
  assert.match(route, /INCEPTION_API_KEY3/);
  assert.match(route, /id: "inception"/);
  assert.ok(route.includes('id: "inception"'));
});

test("grounded price fallback handles missing prices and honors the salon currency", () => {
  assert.match(route, /function formatServicePrice\(price: unknown, currencyCode: unknown/);
  assert.match(route, /typeof price !== "number" \|\| !Number\.isFinite\(price\)/);
  assert.match(route, /Price not listed/);
  assert.match(route, /السعر غير محدد/);
  assert.match(route, /new Intl\.NumberFormat\(language === "en" \? "en-SA" : "ar-SA"/);
});

test("documentation describes TypeSafe Jev as the routing layer", () => {
  assert.match(docs, /TypeSafe|Jev|JEF_TYPE_SAFE/);
  assert.match(docs, /systemone|Choice|routing/i);
});
