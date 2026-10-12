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
- [ ] Verify `npm test`, `npm run typecheck`, and `npm run build` on the migration commit.
- [ ] Verify root, login, signup, owner and Atelier 09 template routes in a real browser.
- [ ] Verify desktop/tablet/mobile rendering, Arabic RTL, English LTR, keyboard focus and reduced motion.
- [ ] Recheck Vercel quota and record direct preview deployment evidence.

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
