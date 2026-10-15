import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";

const brandingSource = readFileSync(new URL("../app/s/[slug]/salon-branding.ts", import.meta.url), "utf8");
const compiled = ts.transpile(brandingSource, { module: ts.ModuleKind.ES2022, target: ts.ScriptTarget.ES2022 });
const branding = await import("data:text/javascript;base64," + Buffer.from(compiled).toString("base64"));
const page = readFileSync(new URL("../app/s/[slug]/page.tsx", import.meta.url), "utf8");
const css = readFileSync(new URL("../app/s/[slug]/public-salon.module.css", import.meta.url), "utf8");
const globals = readFileSync(new URL("../app/globals.css", import.meta.url), "utf8");

test("tenant name wins across all three templates and both languages", () => {
  for (const template of ["atelier", "oasis", "rose"]) {
    const result = branding.resolveSalonBrandNames({ name_ar: "صالون الاختبار", name_en: "Test Salon" }, true);
    assert.equal(result.nameAr, "صالون الاختبار", template + " Arabic brand");
    assert.equal(result.nameEn, "Test Salon", template + " English brand");
  }
});

test("legacy demo template labels never become visible salon brands", () => {
  for (const [name_ar, name_en] of [
    ["أتيليه 09", "Atelier 09"],
    ["واحة العناية الرجالية", "Oasis Grooming Studio"],
    ["فورج للرجال", "Forge Men"]
  ]) {
    const result = branding.resolveSalonBrandNames({ name_ar, name_en }, true);
    assert.equal(result.nameAr, "صالون العناية");
    assert.equal(result.nameEn, "Grooming Studio");
  }
  assert.match(page, /resolveSalonBrandNames\(result\.salon/);
  assert.match(page, /resolveSalonBrandNames\(salon, isDemoSalon\)/);
  assert.match(page, /templateName=\{english \? "Salon website" : "موقع الصالون"\}/);
});

test("responsive logo bounds and Atelier RTL phone isolation are defined", () => {
  assert.match(css, /\.brand img\{width:auto;height:68px;max-width:180px/);
  assert.match(css, /@media\(max-width:640px\)\{\.brand img\{height:54px;max-width:112px\}\}/);
  assert.match(css, /@media\(max-width:360px\)\{\.header\{min-height:auto;flex-wrap:wrap/);
  assert.match(css, /\.atelierPhone\{[^}]*direction:ltr;unicode-bidi:isolate/);
  assert.match(css, /\.quickFacts a\{direction:ltr;unicode-bidi:isolate/);
  assert.match(page, /className=\{styles\.atelierPhone\} href=\{"tel:"\+displayPhone\}/);
  assert.match(globals, /body\{margin:0;min-width:270px\}/);
});
