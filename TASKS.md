## Current task — PR E auth redirect UX follow-up (2026-10-18)

- [x] Merge PR #29 after all three blocking gates passed on its final head.
- [x] Confirm production Vercel deployment READY for merged SHA `bb30b1ed3162e42a0728ee6b491c50c62793734d`.
- [x] Read-only verify the two PR D migrations are present in live Supabase migration history.
- [x] HTTP-smoke root, public salon Arabic/English, and login routes; check recent production runtime error logs.
- [x] Identify false login failure alert on anonymous `/owner/` redirect.
- [ ] PR #30: pass Static Quality and Browser QA on the same final head; merge only after both are green.
- [ ] After PR #30 merges, confirm the production deployment is READY for its merge SHA and repeat the `/owner/` redirect smoke check.
- [ ] Full authenticated production browser QA remains outstanding; do not claim a real sign-in, upload, or booking was tested.

---

## Current task — production QA follow-up (2026-10-15)

- [x] Squash-merge PR #17 to main: fe24e9052cda5dfdc3b8c239fcb44a7cd8fe7195.
- [x] Confirm Static Quality 38678593699 and Supabase RLS/pgTAP 38678593706 PASS on final PR head.
- [x] Add Production MENUUN_PUBLIC_ORIGIN=https://menuun-sites.vercel.app; verify Supabase URL and publishable-key environment values.
- [x] Deploy merged SHA to Production: dpl_FLKMF3NwUcNg2e18ZWNMhokrGqjB READY.
- [x] Request one password-recovery email with production redirect target (HTTP 200); do not request another.
- [ ] Fix 270px horizontal overflow (this follow-up branch) and re-run production responsive checks after deployment.
- [ ] Verify login with account credentials and confirm recovery email link/callback; mailbox click-through is not available in this run.
- [ ] Authenticated owner-workspace QA: template picker, social/map links, hours editor, salon switcher, media upload persistence, QR label/URL, and CTA behavior. Do not submit a real booking.
- [ ] Inspect Oasis card layout and Atelier image/text overlap in an authenticated/member template preview.
- [ ] After full QA, update this checklist with results and retain production rollback deployment dpl_5cHA72s7xNuPiJjMxUiRgnLzsSRR.

---

# Tasks

## Active task
**Polish and verify the public platform foundation** — IN_PROGRESS.

### Acceptance criteria
- [x] Next.js App Router replaces Vite as the active framework.
- [x] Existing marketing UI remains in the new app entry.
- [x] Arabic RTL and English LTR behavior is retained.
- [x] Root metadata, robots and sitemap are defined.
- [x] Owner and Atelier 09 template sources are preserved; build copies them into `public/`.
- [x] Architecture, repository audit and session handoff are committed with the migration.
- [x] `npm test`, `npm run typecheck` and `npm run build` passed on implementation commit `e9d97f4` (GitHub Actions run 38321925258).
- [x] Re-run all CI checks after setting the Vercel framework preset to Next.js (run 38322300996 passed).
- [x] Verify the `.next` output-directory override on CI run 38322471413 and Vercel preview `dpl_464sbkcgdRteY7wyJoFXjppGLu81`.
- [x] Re-run CI after the latest account-route metadata refinement (run 38322706018 passed).
- [x] Import full Arabic and English Menuun SVG wordmarks from Menu V3 and wire language-specific logo assets into the public header/footer/account pages.
- [x] Reduce the public template showcase to exactly three curated options: Essential, Editorial, and Atelier.
- [x] Add lightweight CSS entrance/hover motion and disable it for reduced-motion preferences.
- [x] GitHub Actions run 38324828524 passed contract tests, TypeScript typecheck, Next.js production build, and static checks for commit 27155a3.
- [x] Latest Vercel preview reached READY; HTTP 200 checks passed for root, account routes, legacy owner/template routes, robots and sitemap; both SVG assets return 200.
- [ ] Real-browser QA confirms `/`, `/login`, `/signup`, `/owner/`, and `/templates/atelier-09/`; HTTP checks are not visual QA.
- [ ] RTL/LTR visual QA at mobile, tablet and desktop.
- [ ] Browser visual QA at desktop/tablet/mobile in Arabic RTL and English LTR, including keyboard focus, language toggle, FAQ, mobile menu, console/network errors and reduced-motion behavior.

## Backlog
- [ ] Audit Supabase live migration history and reconcile branch-specific continuity records.
- [ ] Select and implement server-side authentication with official Next.js/Supabase SSR guidance.
- [ ] Add deterministic authorization, tenant memberships and RLS tests.
- [ ] Design and migrate the salon scheduling data model.
- [ ] Define public tenant routes, QR link contract, and tenant subdomain resolution (for example, `site.menuun.com`).
- [ ] Build business workspace, template registry and publication lifecycle.
- [ ] Add E2E, accessibility, performance and SEO quality gates.
- [ ] Restore Refero access and create a source-backed visual reference lock before major redesign.

## Guardrails
No production deploy, domain mutation, paid resource, auth enablement, schema migration, data migration or PR merge without explicit authorization and evidence.
