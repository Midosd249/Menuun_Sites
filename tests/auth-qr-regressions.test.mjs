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


test("local Supabase owner fixture uses the email identity provider ID contract", async () => {
  const seed = await read("../supabase/seed.sql");
  assert.match(seed, /INSERT INTO auth\.identities[\s\S]*?provider_id[\s\S]*?'50000000-0000-4000-8000-000000000001'/);
  assert.doesNotMatch(seed, /'email','fixture-owner@menuun\.test'/);
});


test("browser CI applies local migrations and seed fixtures before authenticated tests", async () => {
  const workflow = await read("../.github/workflows/browser-qa.yml");
  assert.match(workflow, /supabase start[\s\S]*?supabase db reset[\s\S]*?npm run build/);
});


test("browser CI provisions the password through local Supabase Auth before browser sign-in", async () => {
  const workflow = await read("../.github/workflows/browser-qa.yml");
  assert.match(workflow, /auth\/v1\/admin\/users\/50000000-0000-4000-8000-000000000001/);
  assert.match(workflow, /FixturePass123!/);
});


test("local Supabase fixture user belongs to the active Auth instance", async () => {
  const seed = await read("../supabase/seed.sql");
  assert.match(seed, /INSERT INTO auth\.users\s*\(instance_id,id,aud,role,email/);
  assert.match(seed, /'00000000-0000-0000-0000-000000000000','50000000-0000-4000-8000-000000000001'/);
});
