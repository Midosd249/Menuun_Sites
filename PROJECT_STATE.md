# Project State — Menuun

**Updated:** 2026-10-13  
**Implementation status:** IMPLEMENTATION_IN_PROGRESS — Next.js CI passed on `e9d97f4`; Vercel preview build exposed an Output Directory override that is being corrected in repository config  
**Active branch:** `feat/public-platform-foundation`  
**Open PR:** [#5](https://github.com/Midosd249/Menuun_Sites/pull/5) (draft)

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
- **PENDING:** GitHub Actions results for the output-directory override; inspect the exact current-head workflow.
- **BLOCKED:** Vercel preview deployment until the quota is rechecked.
- **UNKNOWN:** Whether `www.menuun.com` is configured and verified in the Vercel project.
- **UNKNOWN:** Exact live Supabase migration history across the legacy and active branches. Older continuity documents conflict about applied migrations; do not change schema/Auth/Storage until reconciled.
- **NOT IMPLEMENTED:** Production authentication, protected business workspace, tenant provisioning, live booking, five production-ready templates, AI provider integration and platform admin.

## Current quality evidence
- The previous Vite baseline passed `npm test` and `npm run build` in GitHub Actions run 38305351474.
- This baseline does **not** prove the Next.js migration passes. New CI evidence is required.
- No browser screenshots or end-to-end route checks have been verified for the Next.js version.

## Single next task
Inspect GitHub Actions for the current branch head; fix typecheck/build/test failures. Once CI passes, recheck Vercel quota and perform preview/browser QA for `/`, `/login`, `/signup`, `/owner/`, and `/templates/atelier-09/`. Do not merge or deploy production until evidence is recorded.
