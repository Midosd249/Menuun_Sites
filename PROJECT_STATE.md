# Project State — Menuun

## Latest verified update — 2026-10-14 (signature salon template redesign)
- **Active branch:** `feat/salon-templates-owner-media-editor`; **draft PR:** [#13](https://github.com/Midosd249/Menuun_Sites/pull/13).
- **Verified head:** `e4cd44bee6a44d713b03f8da9d90415da098af13`.
- **Three templates redesigned:** Atelier is a dark, high-contrast editorial layout with service rows; Oasis uses warm botanical surfaces, an arched hero and photo-led service cards; Rose Studio uses a blush/rose editorial palette, arched imagery and boutique two-column service cards.
- **Imagery:** fallback images remain category-aligned with the barber-salon demo and are served from verified Unsplash image URLs; owner-uploaded salon/gallery/service media still takes precedence. Broken remote images are handled by a dedicated client-side `SalonImage` component.
- **Runtime issue found and fixed:** a server component initially passed image `onError` handlers directly to HTML images, which produced HTTP 500 on `/s/[slug]`. Moved the handler into `app/s/[slug]/salon-image.tsx`. On the current preview, the root and all three template routes return HTTP 200; Playwright checks at 390, 768 and 1440 px show no horizontal overflow, all 9/9 page images load after scrolling, and no page/console errors were recorded.
- **Vercel preview:** deployment `dpl_36cBmox5KXRNeP95YzY5xpWM6y9N` is READY for this head. Preview: `https://menuun-sites-is5x7jltc-midosd2s-projects.vercel.app`; public demo: `https://menuun-sites-is5x7jltc-midosd2s-projects.vercel.app/s/atelier-09`. Template previews use `?template=atelier`, `?template=oasis`, and `?template=rose`.
- **CI:** Static Quality PASS, run [38624960584](https://github.com/Midosd249/Menuun_Sites/actions/runs/38624960584); Supabase RLS/pgTAP PASS, run [38624960495](https://github.com/Midosd249/Menuun_Sites/actions/runs/38624960495).
- **Repository research applied:** reviewed `ai-agent-foundation`, `Menu_V3`, `Demo_Site`, and `Menu-V2-Sandbox`; transferred workflow, RTL, visual-QA, preview/data-truth and image-management principles without copying incompatible restaurant schemas or auth/booking stacks. Exa research was used for salon template references. Refero remains unavailable (`NO_SUBSCRIPTION`).
- **Remaining release gates:** the Supabase migration is committed but not applied; therefore saved template selection, uploaded media persistence and social-link persistence still require migration and owner-path testing. PR remains draft and unmerged; no production deployment or database mutation was performed.


---

## Latest verified update — 2026-10-14 (salon media and discovery links)
- **Active branch:** `feat/salon-templates-owner-media-editor`; **draft PR:** [#13](https://github.com/Midosd249/Menuun_Sites/pull/13).
- **Implemented in source:** service image URLs with fallback photography; barber portraits with explicitly labeled illustrative fallback photos; owner uploads for service photos and barber portraits; owner-managed Instagram, TikTok, Snapchat, Facebook, Google Maps and website links; public map directions and social links; empty-state sample imagery that tells owners to replace it with real salon content.
- **Schema migration is staged, not applied:** `supabase/migrations/20261014120000_salon_templates_public_media.sql` now adds service image metadata and social/location URL fields, in addition to template selection and public-media storage policies. Owner upload/persistent links require the migration.
- **Open-source review:** inspected the MIT-licensed Opencals Frisor Next.js barbershop template and MIT-licensed ShearCraft booking project as reference candidates. Their booking/backend/auth implementations are not copied because they would duplicate or conflict with Menuun's existing Supabase/RPC architecture. The private `Midosd249/ai-agent-foundation` was used as the workflow/security contract; no AI runtime or provider integration was added because the feature is deterministic UI/data management.
- **Refero status:** searches returned `NO_SUBSCRIPTION`; no Refero styles/screens were retrieved. Exa research and repository evidence informed the feature scope. See `docs/design-research-log.md`.
- **Verification:** **PASS** on branch head `6c285d239c22cd818256c72500dc6c9ca28fbddb`: Static Quality run `38578266951` (tests, typecheck, build and inline asset checks) and Supabase RLS/pgTAP run `38578266910` both succeeded.
- **Release blockers:** Vercel rejected a fresh preview deployment with HTTP 402 `api-deployments-free-per-day` and `retryAfter: 86400`. The current shareable preview is an earlier READY build and does not include the latest media/social changes. Do not claim these new features are live until a fresh preview is READY and checked.
- **Not done:** no Supabase migration applied; no production merge/deployment; no actual owner-upload test, social-link click test, visual browser QA or mobile screenshot review yet.
- **Next task:** confirm latest Static Quality and Supabase RLS workflow results; fix any regressions; secure a fresh preview build and verify public/owner paths; then request approval before applying the migration.


**Updated:** 2026-10-13  
**Implementation status:** IMPLEMENTATION_IN_PROGRESS — full Arabic/English SVG brand assets restored, landing page curated to three templates, restrained CSS motion added; CI and preview HTTP checks pass; browser visual QA pending  
**Active branch:** `feat/public-platform-foundation`  
**Open PR:** [#5](https://github.com/Midosd249/Menuun_Sites/pull/5) (draft)

## Latest verified update — 2026-10-13
- Imported the original Arabic and English Menuun SVG wordmarks from `Midosd249/Menu_V3` into `assets/brand/menuun/final/`; the build-copy script publishes them under `/assets/brand/menuun/final/`.
- Public template showcase now contains exactly three options: Essential, Editorial, and Atelier.
- Added restrained CSS entrance/hover motion with explicit `prefers-reduced-motion` handling; no animation dependency was added.
- **PASS:** GitHub Actions run `38324828524` on commit `27155a392d568813fc58c0882497f52b89f93a50` passed contract tests, typecheck, production build and static checks.
- **PASS:** Vercel preview `https://menuun-sites-2jnihdgt8-midosd2s-projects.vercel.app/` is READY for the code commit. HTTP 200 confirmed for `/`, `/login/`, `/signup/`, `/owner/`, `/templates/atelier-09/`, `/robots.txt`, and `/sitemap.xml`; both imported SVG logo assets return HTTP 200. The root HTML contains exactly three template cards and no Vite entry.
- **NOT VERIFIED:** no actual browser screenshots, responsive layout inspection, keyboard-interaction checks, or client-side language/FAQ/mobile-menu interaction tests were available. Keep browser visual QA as the next task.

## Active milestone
Phase 1 — Next.js public-platform foundation.

## VERIFIED repository facts
- The active source branch previously used React + TypeScript + Vite for the public marketing site.
- The existing Atelier 09 page is preserved at `templates/atelier-09/index.html`; the owner workspace lives under `owner/`.
- The marketing UI supports Arabic RTL by default and English LTR; login/signup are staged screens, not real auth.
- Relevant references inspected: `Midosd249/ai-agent-foundation`, `Midosd249/Menu_V3`, `Midosd249/Demo_Site`, and `Midosd249/Menu-V2-Sandbox`. Findings are in `docs/repository-audit.md`.
- The current Vercel configuration previously targeted Vite's `dist/`; Next.js requires framework-native build output.
- The Refero connector returned `NO_SUBSCRIPTION`; no visual references were retrieved.
- **VERIFIED:** Vercel deployment `dpl_2gHCZQNGUqyxKvDxwnp8FDmsVYGV` reached READY for commit `e9d97f4`, but HTTP checks returned the old Vite `index.html` at `/` and 404 for `/login/`, `/signup/`, `/robots.txt`, and `/sitemap.xml`. Deployment metadata reported project framework `null`; build logs showed Next.js compilation succeeded. The root cause was framework routing/preset mismatch, not a Next.js compile failure.
- **VERIFIED:** The follow-up deployment for `d6e3aa2` compiled Next.js and generated routes, but Vercel failed after build because the Project Settings Output Directory still pointed at the old Vite output; logs reported missing `/vercel/path0/routes-manifest.json`.
- **FIX APPLIED:** `vercel.json` now sets `framework: "nextjs"` and `outputDirectory: ".next"`, using Vercel's documented file-based overrides. No dashboard/project setting or production domain was changed. A fresh preview must prove the override is honored.
- **VERIFIED:** GitHub Actions run `38322300996` passed tests, typecheck, build and static checks for commit `d6e3aa2`; the new output-directory override is pending CI.

## Migration scope
- Next.js App Router, metadata, robots and sitemap.
- Preserve static owner/template assets through build-time copying and explicit rewrites.
- Keep the marketing page's language toggle, mobile menu and FAQ behavior.
- Add tests for Next routing/configuration and CI typecheck.
- Keep the migration reversible; leave the old `src/` and `index.html` source intact as rollback/reference material.

## UNKNOWN / BLOCKED
- **VERIFIED:** GitHub Actions run `38322471413` passed tests, typecheck, build and static checks for `25d06d6`.
- **VERIFIED:** Vercel preview `dpl_464sbkcgdRteY7wyJoFXjppGLu81` reached READY for `25d06d6`; HTTP smoke checks returned 200 for `/`, `/login`, `/login/`, `/signup`, `/signup/`, `/owner/`, `/templates/atelier-09/`, `/robots.txt`, and `/sitemap.xml`. Root HTML contains Next.js output, not the legacy Vite entry.
- **PENDING:** CI for the latest account metadata and audit-document refinement commit.
- **BLOCKED:** Vercel preview deployment until the quota is rechecked.
- **UNKNOWN:** Whether `www.menuun.com` is configured and verified in the Vercel project. The Vercel project domain list showed only `menuun-sites.vercel.app`.
- **UNKNOWN:** Exact live Supabase migration history across the legacy and active branches. Older continuity documents conflict about applied migrations; do not change schema/Auth/Storage until reconciled.
- **NOT IMPLEMENTED:** Production authentication, protected business workspace, tenant provisioning, live booking, five production-ready templates, AI provider integration and platform admin.

## Current quality evidence
- The previous Vite baseline passed `npm test` and `npm run build` in GitHub Actions run 38305351474.
- This baseline does **not** prove the Next.js migration passes. New CI evidence is required.
- HTTP route smoke checks are verified for the Next.js preview; no browser screenshots, real interaction tests, or responsive visual review have been verified.

## Single next task
Inspect GitHub Actions for the current HEAD, then run browser-based visual QA at mobile/tablet/desktop for Arabic RTL and English LTR, including keyboard focus, reduced motion, console/network errors and actual language/FAQ/mobile-menu interactions. HTTP routing is verified, but HTTP 200 is not visual QA. Do not merge PR #5 until current-head CI and browser QA are evidenced.
