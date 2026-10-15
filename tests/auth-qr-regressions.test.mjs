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

test("salon QR uses a server-provided canonical origin and shows the saved template", async () => {
  const qr = await read("../app/owner/qr-card.tsx");
  const workspace = await read("../app/owner/page.tsx");
  const publicPage = await read("../app/s/[slug]/page.tsx");
  assert.match(qr, /MENUUN_PUBLIC_ORIGIN|publicOrigin/);
  assert.doesNotMatch(qr, /window\.location\.origin/);
  assert.match(qr, /templateName|templateLabel|Atelier 09/);
  assert.match(workspace, /template_key/);
  assert.doesNotMatch(publicPage, /requestedTemplate|templateKey|params\.set\(["']template["']|\?template=/);
});
