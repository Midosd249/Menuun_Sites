import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const read = (path) => readFile(new URL(path, import.meta.url), "utf8");

test("login route provides Supabase password auth, recovery, and a validated owner redirect", async () => {
  const page = await read("../app/login/page.tsx");
  const form = await read("../app/login/login-form.tsx");
  const recovery = await read("../app/forgot-password/forgot-password-form.tsx");
  const signup = await read("../app/signup/signup-form.tsx");
  const redirect = await read("../lib/auth/redirect.mjs");
  assert.match(page, /safeRedirect|safe-redirect|safeRedirectPath/);
  assert.match(form, /signInWithPassword/);
  assert.match(recovery, /resetPasswordForEmail/);
  assert.match(signup, /signUp/);
  assert.match(signup, /emailRedirectTo/);
  assert.match(form, /signUp|signup|\/signup/);
  assert.match(form, /العربية|English|lang|dir/);
  assert.match(page, /safeRedirectPath\(candidate, "\/owner\/"\)/);
  assert.match(redirect, /candidate\.startsWith/);
  assert.doesNotMatch(form, /window\.location\.origin/);
});

test("salon QR uses a canonical origin and public previews require verified salon membership", async () => {
  const qr = await read("../app/owner/qr-card.tsx");
  const workspace = await read("../app/owner/page.tsx");
  const publicPage = await read("../app/s/[slug]/page.tsx");
  assert.match(qr, /MENUUN_PUBLIC_ORIGIN|publicOrigin/);
  assert.doesNotMatch(qr, /window\.location\.origin/);
  assert.match(qr, /templateName|templateLabel/);
  assert.match(workspace, /template_key/);
  assert.match(publicPage, /authDb\.auth\.getClaims\(\)/);
  assert.match(publicPage, /from\("salon_members"\)/);
  assert.match(publicPage, /previewTemplate \|\| salon\.template_key/);
});


test("local Supabase owner fixture uses the canonical UUID email identity contract", async () => {
  const seed = await read("../supabase/seed.sql");
  assert.ok(seed.includes("'50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001'"));
  assert.ok(seed.includes("'email','50000000-0000-4000-8000-000000000001',now()"));
});


test("browser CI applies local migrations and seed fixtures before authenticated tests", async () => {
  const workflow = await read("../.github/workflows/browser-qa.yml");
  assert.match(workflow, /supabase start[\s\S]*?supabase db reset[\s\S]*?npm run build/);
});


test("browser CI uses the seeded password fixture without mutating Auth through the admin API", async () => {
  const workflow = await read("../.github/workflows/browser-qa.yml");
  const seed = await read("../supabase/seed.sql");
  assert.ok(seed.includes("FixturePass123!"));
  assert.ok(workflow.includes("supabase db reset"));
  assert.ok(!workflow.includes("/auth/v1/admin/users/"));
});


test("local Supabase fixture user belongs to the active Auth instance", async () => {
  const seed = await read("../supabase/seed.sql");
  assert.match(seed, /INSERT INTO auth\.users\s*\(instance_id,id,aud,role,email/);
  assert.match(seed, /'00000000-0000-0000-0000-000000000000','50000000-0000-4000-8000-000000000001'/);
});


test("local Auth fixture has a confirmed user and canonical email identity", async () => {
  const seed = await read("../supabase/seed.sql");
  assert.ok(seed.includes("email_confirmed_at"));
  assert.ok(seed.includes("'50000000-0000-4000-8000-000000000001','50000000-0000-4000-8000-000000000001'"));
});


test("browser CI verifies the seeded Auth fixture can password-sign-in before Playwright", async () => {
  const workflow = await read("../.github/workflows/browser-qa.yml");
  assert.ok(workflow.includes("Verify seeded local Auth fixture can sign in"));
  assert.ok(workflow.includes("/auth/v1/token?grant_type=password"));
  assert.ok(workflow.includes("curl --fail-with-body"));
});


test("local Auth fixture explicitly seeds empty Auth token strings required by GoTrue", async () => {
  const seed = await read("../supabase/seed.sql");
  for (const column of ["confirmation_token", "email_change", "email_change_token_new", "recovery_token", "email_change_token_current"]) {
    assert.match(seed, new RegExp(column), column + " must be explicitly seeded");
  }
  assert.match(seed, /confirmation_token[\s\S]*?email_change[\s\S]*?email_change_token_new[\s\S]*?recovery_token/);
  assert.match(seed, /SET[\s\S]*?confirmation_token=''/);
});


test("anonymous owner redirect shows a clean sign-in form instead of a false authentication failure", async () => {
  const middleware = await read("../middleware.ts");
  const loginForm = await read("../app/login/login-form.tsx");
  assert.match(middleware, /if \(privateRoute && !hasVerifiedIdentity\)[\s\S]*?return loginRedirect\(request, response\);/);
  assert.match(middleware, /loginRedirect\(request, response, "auth_unavailable"\)/);
  assert.doesNotMatch(middleware, /loginRedirect\(request, response, "login_required"\)/);
  assert.match(loginForm, /initialError \? messageFor\(new Error\(initialError\), "ar"\) : ""/);
});
