## Current verified handoff — 2026-10-15

- Repository: Midosd249/Menuun_Sites; main is at fe24e9052cda5dfdc3b8c239fcb44a7cd8fe7195 after squash-merging PR #17.
- Production deployment READY: dpl_FLKMF3NwUcNg2e18ZWNMhokrGqjB, commit fe24e9052cda5dfdc3b8c239fcb44a7cd8fe7195, URL https://menuun-sites-pmi87b0jr-midosd2s-projects.vercel.app, alias https://menuun-sites.vercel.app.
- Rollback point: pre-merge main 6e7c22996448bccc7f77189837ace8c898fcb238, READY deployment dpl_5cHA72s7xNuPiJjMxUiRgnLzsSRR at https://menuun-sites-n4zmgf71t-midosd2s-projects.vercel.app.
- Final PR head CI: Static Quality 38678593699 PASS; Supabase RLS/pgTAP 38678593706 PASS. Merged SHA Vercel check SUCCESS.
- Production env: Supabase URL correct, publishable key verified with sb_publishable_ prefix, and MENUUN_PUBLIC_ORIGIN=https://menuun-sites.vercel.app now targets Production.
- One password-recovery request was accepted with redirect_to=https://menuun-sites.vercel.app/reset-password; the mailbox/link and actual callback exchange remain UNKNOWN. No sign-in password was provided to the test, so successful authenticated login is UNKNOWN.
- Public /s/atelier-09 visibly renders Atelier Arabic RTL. Anonymous ?template=oasis is ignored, as intended. /login is HTTP 200 and anonymous /owner redirects to login.
- Production browser QA found no JS console errors; no horizontal overflow at 320/360/390/430/768/1440px. A 270px overflow was identified (body min-width 320px) and this follow-up branch adds a fix. Authenticated owner flows, uploads, QR UI, CTA interaction, Oasis layout and link-click behavior remain UNKNOWN until QA after fix deploy.
- No live DB schema/data changes, no DNS/domain changes, and no real booking submitted.

### Switch to site.menuun.com later
1. Add site.menuun.com in the Vercel project and complete Vercel verification.
2. At the DNS provider, add only the CNAME Vercel specifies for site.menuun.com; preserve unrelated records.
3. Set Production MENUUN_PUBLIC_ORIGIN=https://site.menuun.com, then redeploy.
4. Supabase Auth URL Configuration: Site URL https://site.menuun.com; Redirect URLs https://site.menuun.com/owner/ and https://site.menuun.com/**.
5. Test production login, recovery, callback, /s/atelier-09, and QR destination. Automation has not touched DNS or domains.

---

# Menuun — Session Handoff

**Updated:** 2026-10-13  
**Purpose:** Resume work accurately from any new chat. Repository state is authoritative; chat history is not.

## Canonical context

- Repository: `Midosd249/Menuun_Sites`
- Active branch: `feat/public-platform-foundation`
- Open draft PR: [#5](https://github.com/Midosd249/Menuun_Sites/pull/5)
- Product: Arabic-first, bilingual SaaS for salons, barbershops, and appointment-led service businesses.
- Desired public domain: `www.menuun.com` (domain linkage remains unverified). Tenant sites should use subdomains such as `site.menuun.com`; do not change DNS or Vercel domain settings without explicit authorization.
- Reference repositories: `Midosd249/ai-agent-foundation` and `Midosd249/Menu_V3`; read-only references, do not modify them.
- Supabase project ref known from prior repository context: `kphypflbkbcvgcaupxxm`. Do not apply migrations or change Auth/Storage settings without a separately reviewed migration plan.
- Vercel project: `menuun-sites`. Latest code commit `27155a392d568813fc58c0882497f52b89f93a50` has READY preview `https://menuun-sites-2jnihdgt8-midosd2s-projects.vercel.app/`. Do not deploy to production or change domains without explicit authorization.

## Latest verified state — 2026-10-13

- GitHub Actions run `38324828524` passed tests, typecheck, production build, and static checks for commit `27155a392d568813fc58c0882497f52b89f93a50`.
- Preview HTTP 200 checks passed for `/`, `/login/`, `/signup/`, `/owner/`, `/templates/atelier-09/`, `/robots.txt`, `/sitemap.xml`, and both new SVG logo assets.
- This is HTTP-level verification only. Browser screenshots, responsive visual review, keyboard testing and client-side interaction QA remain outstanding.
- Design research recorded in `docs/design-research-log.md`: Motion accessibility guidance and public animated UI repositories were reviewed; no third-party code was copied wholesale.

## Required startup sequence

1. Read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`.
2. Read this file, `docs/architecture/nextjs-platform-architecture.md`, `docs/repository-audit.md`, `docs/roadmap/public-platform-foundation.md`, and `docs/design-research-log.md`.
3. Check the current branch head and PR #5 before editing; this handoff may lag the actual repository.
4. Inspect the current GitHub Actions run for the latest commit. Never infer build success from a commit alone.
5. Verify Vercel deployment quota/status before considering preview work. No production deploy, domain mutation, paid resource creation, or database migration without explicit authorization.

## Current implementation boundary

- The active code path is Next.js App Router with React and TypeScript.
- The public marketing page remains Arabic RTL by default and supports English LTR. It now uses full Arabic/English SVG wordmarks imported from Menu V3 and presents exactly three template options: Essential, Editorial, Atelier.
- `/login` and `/signup` are intentionally staged screens. No real authentication is implemented by this migration.
- The existing `owner/` and `templates/atelier-09/` HTML experiences must remain reachable through Next.js public assets and rewrites.
- SEO metadata, robots, and sitemap are foundational; the custom domain itself is not verified.
- No tenant booking API, protected workspace, production auth, or live AI gateway is claimed by this milestone.

## Immediate next task

Run and inspect GitHub Actions for the current branch. Fix any typecheck/build/test failures in a focused commit. Once CI passes, verify the Vercel quota and preview routing (root, login, signup, owner, template) and run browser QA at mobile/tablet/desktop for Arabic RTL and English LTR. Do not merge PR #5 until these acceptance checks are evidenced.

## Decision discipline

- Facts use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, or `BLOCKED`.
- Preserve `templates/atelier-09/index.html`, owner workspace, media assets, and legacy context.
- Never copy Menu V3's restaurant order/cart/payment schema into salon scheduling.
- Before real authentication, reconcile the existing Supabase migration history across branches; choose Supabase SSR or another server-side auth stack only after reviewing the current project's state and official docs.
- Every behavior change gets tests; all external AI output is untrusted data; deterministic code enforces permissions.
