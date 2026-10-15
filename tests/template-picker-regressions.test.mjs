import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("template picker reports safe codes and rolls back optimistic state on failure", async () => {
  const source = await readFile(new URL("../app/owner/template-picker.tsx", import.meta.url), "utf8");
  assert.match(source, /TPL-403/);
  assert.match(source, /TPL-404/);
  assert.match(source, /TPL-500/);
  assert.match(source, /console\.error\("\[template-picker\] save failed"/);
  assert.match(source, /setChoice\(previous\); setTemplateKey\(previous\); setFailedChoice\(target\)/);
  assert.match(source, /إعادة المحاولة \/ Retry/);
  assert.match(source, /maybeSingle\(\)/);
  assert.match(source, /if \(!data \|\| data\.id !== salonId/);
});

test("public metadata uses salon name and rejects demo/placeholder copy", async () => {
  const source = await readFile(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");
  assert.match(source, /export const dynamic = "force-dynamic"/);
  assert.match(source, /\bdemo\b/);
  assert.match(source, /تجريبي/);
  assert.match(source, /placeholder/);
  assert.match(source, /const title = salonName/);
  assert.match(source, /isUnfinishedCopy\(rawDescription\)/);
  assert.doesNotMatch(source, /const title = demo \?/);
});

test("hero video is isolated in the new public-video bucket", async () => {
  const source = await readFile(new URL("../app/owner/hero-video-editor.tsx", import.meta.url), "utf8");
  assert.match(source, /salon-public-video/);
  assert.match(source, /hero_mode/);
  assert.match(source, /kind:"hero_video"/);
  assert.match(source, /100 \* 1024 \* 1024/);
});
