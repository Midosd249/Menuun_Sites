# Active Plan

## IN_PROGRESS — Phase 1: Next.js public-platform foundation
- [x] Read active repository contracts, continuity docs, and source.
- [x] Audit AI Agent Foundation and relevant adjacent repositories; record reuse boundaries.
- [x] Choose Next.js App Router as the target before implementing auth or tenant data behavior.
- [x] Preserve the existing marketing UI and its Arabic RTL / English LTR behavior.
- [x] Add Next.js root layout, metadata, robots and sitemap.
- [x] Preserve owner/template assets through a build-time copy script and compatibility rewrites.
- [x] Add architecture, repository audit, design research and new-session handoff documentation.
- [x] Add Next.js contract tests and a CI typecheck step.
- [x] Verify `npm test`, `npm run typecheck`, and `npm run build` on implementation commit `e9d97f4` (GitHub Actions run 38321925258 passed).
- [x] Re-run CI after setting the Vercel framework preset to Next.js (run 38322300996 passed).
- [x] Verify the explicit `.next` output-directory override: GitHub Actions run 38322471413 passed and the preview HTTP smoke checks returned 200 for all nine target paths.
- [x] Re-run CI after account-route metadata refinement (GitHub Actions run 38322706018 passed).
- [x] Import the full Arabic/English SVG brand assets from Menu V3 and wire the correct logo by selected language.
- [x] Curate the homepage template showcase to exactly three: Essential, Editorial, Atelier.
- [x] Add restrained CSS motion and explicit reduced-motion handling without adding a new dependency.
- [x] GitHub Actions run 38324828524 passed tests, typecheck, build and static checks for commit 27155a3.
- [x] Latest preview is READY; all seven key routes and both new logo asset URLs returned HTTP 200.
- [ ] Verify root, login, signup, owner and Atelier 09 template routes in a real browser; HTTP routing has been verified, but no browser session/screenshots have been captured.
- [ ] Verify desktop/tablet/mobile rendering, Arabic RTL, English LTR, keyboard focus and reduced motion.
- [ ] Record browser screenshots and interaction QA evidence before merge.

## Later phases — not started
1. Reconcile the actual Supabase project schema/migration history and choose the auth provider from official current documentation.
2. Implement server-side identity, secure cookies, account lifecycle and tenant provisioning.
3. Implement business membership/roles and database-enforced RLS/tenant isolation.
4. Define the salon scheduling schema, availability rules, transaction/idempotency and booking lifecycle.
5. Define a typed/versioned template contract and convert Atelier 09 into a data-driven template.
6. Build the protected business workspace and public tenant sites with QR-safe stable slugs.
7. Add media management, preview/publish workflow, platform operations and audit logs.
8. Add browser E2E, accessibility, performance, SEO and security release gates.
9. Production launch and custom-domain verification after explicit approval.

Only Phase 1 is authorized by the current task. Do not start database/auth/production changes without a reviewed scope and rollback plan.
