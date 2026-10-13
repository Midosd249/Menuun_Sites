import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");

test("Supabase dependencies and browser/server clients use publishable credentials only", () => {
  const pkg = JSON.parse(read("../package.json"));
  assert.ok(pkg.dependencies["@supabase/ssr"]);
  assert.ok(pkg.dependencies["@supabase/supabase-js"]);
  const browser = read("../lib/supabase/client.ts");
  const server = read("../lib/supabase/server.ts");
  const publicConfig = read("../lib/supabase/config.ts");
  assert.match(browser, /createBrowserClient/);
  assert.match(server, /createServerClient/);
  assert.match(publicConfig, /NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY/);
  assert.match(publicConfig, /if \(!url \|\| !publishableKey\) return null/);
  assert.doesNotMatch(browser + server + publicConfig, /SERVICE_ROLE|sb_secret_/i);
});

test("request middleware refreshes sessions and preserves cookie/cache semantics", () => {
  const middleware = read("../middleware.ts");
  assert.match(middleware, /createServerClient/);
  assert.match(middleware, /request\.cookies\.set/);
  assert.match(middleware, /response\.cookies\.set/);
  assert.match(middleware, /auth\.getClaims\(\)/);
  assert.match(middleware, /Cache-Control|cache-control/);
  assert.match(middleware, /export async function middleware/);
});

test("server identity helper verifies claims instead of trusting a raw session", () => {
  const auth = read("../lib/auth/verified-user.ts");
  assert.match(auth, /auth\.getClaims\(\)/);
  assert.doesNotMatch(auth, /auth\.getSession\(\)/);
});

test("auth callback and sign-out only redirect to safe local paths", () => {
  const redirect = read("../lib/auth/redirect.ts");
  assert.match(redirect, /startsWith\(["']\/\/["']\)/);
  assert.match(redirect, /startsWith\(["']\/["']\)/);
  assert.match(read("../app/auth/callback/route.ts"), /exchangeCodeForSession/);
  assert.match(read("../app/auth/signout/route.ts"), /auth\.signOut\(\)/);
  assert.match(read("../app/auth/callback/route.ts") + read("../app/auth/signout/route.ts"), /safeRedirectPath/);
});

test("marketing and staged account routes remain public while private routes fail closed", () => {
  const middleware = read("../middleware.ts");
  assert.match(middleware, /matcher/);
  assert.match(middleware, /PRIVATE_ROUTE_PREFIXES/);
  assert.match(middleware, /request\.nextUrl\.pathname/);
  assert.match(middleware, /claims\.sub/);
  assert.match(middleware, /\/login\//);
  assert.match(middleware, /export async function middleware/);
  assert.match(read("../app/login/page.tsx"), /export \{ default \} from "\.\.\/page"/);
  assert.match(read("../app/signup/page.tsx"), /export \{ default \} from "\.\.\/page"/);
});
