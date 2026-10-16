import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const read = path => readFileSync(new URL(path, import.meta.url), "utf8");
const brandingSource = read("../app/s/[slug]/salon-branding.ts");
const compiled = ts.transpile(brandingSource, { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 });
const branding = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));
const page = read("../app/s/[slug]/page.tsx");
const css = read("../app/s/[slug]/public-salon.module.css");
const owner = read("../app/owner/page.tsx");
const stats = read("../app/owner/notifications-stats.tsx");

test("owner-provided names remain exact even when they resemble legacy template brands", () => {
  for (const [name_ar, name_en] of [
    ["أتيليه 09", "Atelier 09"],
    ["واحة العناية الرجالية", "Oasis Grooming Studio"],
    ["فورج للرجال", "Forge Men"],
    ["صالون الاختبار", "Test Salon"]
  ]) {
    const result = branding.resolveSalonBrandNames({ name_ar, name_en }, true);
    assert.equal(result.nameAr, name_ar);
    assert.equal(result.nameEn, name_en);
  }
});

test("empty active-language name falls back to the other language; generic only when both empty", () => {
  assert.deepEqual(branding.resolveSalonBrandNames({name_ar:"صالون الاختبار",name_en:""}), {nameAr:"صالون الاختبار",nameEn:"صالون الاختبار"});
  assert.deepEqual(branding.resolveSalonBrandNames({name_ar:"",name_en:"Test Salon"}), {nameAr:"Test Salon",nameEn:"Test Salon"});
  assert.deepEqual(branding.resolveSalonBrandNames({name_ar:" ",name_en:null}), {nameAr:"صالون العناية",nameEn:"Grooming Studio"});
});

test("brand is used for metadata and public template content without legacy-name filtering", () => {
  assert.match(page, /resolveSalonBrandNames\(result\.salon/);
  assert.match(page, /resolveSalonBrandNames\(salon, isDemoSalon\)/);
  assert.match(page, /openGraph:/);
  assert.match(page, /displaySalonNameAr|displaySalonNameEn/);
  assert.doesNotMatch(brandingSource, /legacyDemoNames|legacy demo label/i);
});

test("responsive logo bounds and Atelier RTL phone isolation are defined", () => {
  assert.match(css, /\.brand img\{[^}]*height:9[0-6]px[^}]*max-width:26[0-9]px/);
  assert.match(css, /@media\s*\(max-width:\s*640px\)[^{]*\{[^}]*\.brand img\{[^}]*height:6[4-9]px/);
  assert.match(css, /\.brand img\{[^}]*object-fit:contain/);
  assert.match(css, /\.atelierPhone\{[^}]*direction:ltr;unicode-bidi:isolate/);
  assert.match(page, /className=\{styles\.atelierPhone\} href=\{"tel:"\+displayPhone\}/);
});

test("owner settings labels business names and dashboard has a testable sound action", () => {
  assert.match(owner, /Business name \(Arabic\)/);
  assert.match(owner, /Business name \(English\)/);
  assert.match(stats, /Test sound|اختبار الصوت/);
  assert.match(stats, /table:"appointments"/);
});
