import test from "node:test";
import assert from "node:assert/strict";

const pageUrl = process.env.MENUUN_PUBLIC_COPY_URL || "https://menuun-sites.vercel.app/s/atelier-09";
const forbidden = /\bdemo\b|\blorem\b|\bplaceholder\b|تجريبي|تجريبية|نموذج|لوريم/i;
const stripUrls = value => value.replace(/https?:\/\/[^\s"'<>]+/gi, " ");

test("public page excludes demo copy from visible text, alt text, metadata, JSON-LD and comments", async () => {
  const response = await fetch(pageUrl, { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200, "public salon page should return HTTP 200");
  const html = await response.text();
  const comments = [...html.matchAll(/<!--[\s\S]*?-->/g)].map(match => match[0]).join(" ");
  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]).join(" ");
  const metadata = [...html.matchAll(/<title\b[^>]*>[\s\S]*?<\/title>|<meta\b[^>]*>/gi)].map(match => match[0]).join(" ");
  const altText = [...html.matchAll(/\balt\s*=\s*(["'])(.*?)\1/gi)].map(match => match[2]).join(" ");
  const visible = html
    .replace(/<script\b(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(?:amp|lt|gt|quot|#39|nbsp);/g, " ");
  for (const [section, text] of Object.entries({ visible, altText, metadata, jsonLd, comments })) {
    assert.doesNotMatch(stripUrls(text), forbidden, "forbidden copy found in " + section);
  }
});
