import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const read=(p)=>readFile(new URL(p,import.meta.url),"utf8");
test("owner route verifies server identity",async()=>{const s=await read("../app/owner/layout.tsx");assert.match(s,/supabase\.auth\.getUser\(\)/);assert.match(s,/redirect\("\/login\//)});
test("tenant membership is scoped to current user and active membership",async()=>{const s=await read("../app/owner/page.tsx");assert.match(s,/from\("salon_members"\)/);assert.match(s,/\.eq\("user_id",user\.id\)/);assert.match(s,/\.eq\("is_active",true\)/);assert.match(s,/\.eq\("salon_id",active\.id\)/)});
test("owner mutations preserve existing RPC and tenant scope",async()=>{const s=await read("../app/owner/page.tsx");assert.match(s,/create_salon_with_owner/);assert.match(s,/from\("services"\)\.insert/);assert.match(s,/from\("barbers"\)\.insert/);assert.match(s,/from\("salons"\)\.update/);assert.match(s,/from\("appointments"\)\.update/)});
test("workspace supports RTL and narrow mobile layouts",async()=>{const s=await read("../app/owner/page.tsx");const c=await read("../app/globals.css");assert.match(s,/dir=\{lang==="ar"\?"rtl":"ltr"\}/);assert.match(c,/@media\(max-width:360px\)/);assert.match(c,/\.owner-nav/)});

test("login persists Supabase auth through the shared SSR cookie client",async()=>{const s=await read("../app/page.tsx");assert.match(s,/createSupabaseBrowserClient/);assert.doesNotMatch(s,/createClient\(url, key, \{ auth: \{ persistSession: true/)});
test("Supabase public env vars are statically referenced for Next.js browser bundling",async()=>{const s=await read("../lib/supabase/config.ts");assert.ok(s.includes("process.env.NEXT_PUBLIC_SUPABASE_URL"));assert.ok(s.includes("process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"));assert.doesNotMatch(s,/env: NodeJS\.ProcessEnv = process\.env/)});

test("owner QR uses the canonical origin and customer-facing sharing actions",async()=>{
 const qr=await read("../app/owner/qr-card.tsx");
 const layout=await read("../app/owner/layout.tsx");
 const origin=await read("../lib/public-origin.ts");
 const picker=await read("../app/owner/template-picker.tsx");
 const publicPage=await read("../app/s/[slug]/page.tsx");
 const publicQr=await read("../app/s/[slug]/qr-share.tsx");
 assert.match(layout,/getMenuunPublicOrigin/);
 assert.match(origin,/MENUUN_PUBLIC_ORIGIN/);
 assert.match(qr,/usePublicOrigin/);
 assert.doesNotMatch(qr,/TEMPLATE_NAMES|templateKey|Vercel|القالب\s+المحفوظ|saved\s+template|preview\s+address/i);
 assert.match(qr,/navigator\.share/);
 assert.doesNotMatch(qr,/window\.location\.origin/);
 assert.match(publicQr,/publicOrigin/);
 assert.doesNotMatch(publicQr,/window\.location\.origin/);
 assert.match(picker,/\?template=/);
 assert.match(publicPage,/previewTemplate \|\| salon\.template_key/);
 assert.match(publicPage,/authDb\.auth\.getClaims\(\)/); assert.match(publicPage,/from\("salon_members"\)/); assert.match(publicPage,/previewTemplate \|\| salon\.template_key/);
});
