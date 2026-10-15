import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const owner = readFileSync(new URL("../app/owner/page.tsx", import.meta.url), "utf8");
const publicSalon = readFileSync(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");
const stats = readFileSync(new URL("../app/owner/notifications-stats.tsx", import.meta.url), "utf8");

test("owner workspace uses language-specific Menuun wordmarks and descriptor", () => {
  assert.match(owner, /menuun-logo-ar\.svg/);
  assert.match(owner, /menuun-logo-en\.svg/);
  assert.match(owner, /تصميم المواقع/);
  assert.match(owner, /Website Design/);
});

test("Menuun platform wordmark is not injected into public salon templates", () => {
  assert.doesNotMatch(publicSalon, /menuun-logo-(?:ar|en)\.svg/);
});

test("owner statistics refresh for appointment changes and include collection/sound affordances", () => {
  assert.match(stats, /table:"appointments"/);
  assert.match(stats, /get_salon_revenue_stats/);
  assert.match(stats, /price_sar_snapshot/);
  assert.match(stats, /appointment_created/);
  assert.match(stats, /localStorage/);
  assert.match(stats, /This month/);
  assert.match(stats, /غير معيّن/);
});
