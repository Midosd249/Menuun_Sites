# Menuun — Next.js Migration & Delivery Plan

**Status:** Native owner workspace implemented in source; build, integration tests, and preview acceptance pending  
**Repository:** Midosd249/Menuun_Sites  
**Working branch:** feat/tenant-authorization-rls-tests  
**Last updated:** 2026-10-14

## Baseline inspected before changes
- Latest pre-change branch deployment was READY for commit 587f029cccf84f0b5c5223b18b47fd60749353ed; preview https://menuun-sites-2ttv73psi-midosd2s-projects.vercel.app. This is the previous build, not the new code.
- The prior Next config rewrote /owner to legacy owner/index.html; middleware excluded owner routes from private prefixes.
- Traced legacy sign-in/sign-up, active salon_members membership lookup, create_salon_with_owner RPC, salon switching, appointments, services, barbers, and settings.
- Existing workflow references salon_members(user_id, salon_id, role, is_active), plus salons, appointments, services, and barbers. This is source-code inventory, not a fresh database/RLS audit.
- npm run build performs static copying, TypeScript, and Next build; npm run typecheck runs TypeScript; npm test uses Node's built-in test runner.

## Phase 0 — Baseline and inventory: PARTIAL
- [x] Read plan, package scripts, middleware, Supabase helpers, legacy owner workflows, and latest Vercel deployment metadata.
- [x] Identify legacy route rewrite and primary data/workflow contracts.
- [ ] Independently inspect every production RLS policy, migration, storage path, and database constraint. No production schema changes were made.

## Phase 1 — Auth foundation: IMPLEMENTED IN SOURCE; END-TO-END PENDING
- [x] Reuse shared @supabase/ssr browser/server helpers and existing publishable-key configuration.
- [x] Verify identity with server-side supabase.auth.getUser() in owner layout; redirect missing/invalid sessions to /login/?next=%2Fowner%2F.
- [x] Add /owner to private middleware prefixes for SSR session refresh and unauthenticated redirects.
- [x] Scope active tenant memberships to current verified user and expose owner/admin/manager memberships in workspace.
- [ ] Verify existing account login, confirmation callback, refresh, and logout end-to-end on preview.

## Phase 2 — Native owner shell: IMPLEMENTED IN SOURCE; BUILD/DEVICE CHECKS PENDING
- [x] Add app/owner/layout.tsx and app/owner/page.tsx.
- [x] Remove /owner legacy rewrite; legacy assets remain available as rollback/reference.
- [x] Add responsive desktop navigation/mobile bottom navigation, loading/error/empty states, Arabic RTL/English switching, and narrow-screen styles.
- [ ] Build and visually verify 320, 375, 390, 768, 1024, and 1440px widths.

## Phase 3 — Workflow parity: IMPLEMENTED IN SOURCE; INTEGRATION CHECKS PENDING
- [x] Membership-based salon loading, onboarding RPC, salon selection, dashboard stats, appointment search/filter/status updates, service creation/listing, team creation/listing, and salon settings updates.
- [x] Scope tenant queries/mutations by salon_id; retain existing RLS as database authorization boundary. No privileged key or replacement database introduced.
- [ ] Verify live schema constraints, status transition rules, and all mutations.
- [ ] Verify real-session success, empty, failure, and unauthorized states.

## Phase 4 — Security and quality: IN PROGRESS
- [x] Add Node tests for server identity verification, active membership scoping, core workflow presence, and responsive/RTL source requirements.
- [ ] Execute npm run build, npm run typecheck, and npm test in a real checkout/CI.
- [ ] Inspect Supabase RLS policies and security/performance advisors; run cross-tenant read/write tests using two authorized test identities.
- [ ] Verify auth callback URL allowlist and environment variable names without exposing values.

## Phase 5 — Preview, acceptance, cutover: PENDING
- [ ] Verify a new Vercel preview is READY for the resulting commit.
- [ ] Smoke-test authenticated/unauthenticated routes, refresh, logout, all mutations, and Arabic/English mobile layout.
- [ ] Keep legacy page and production untouched until acceptance; rollback by restoring previous deployment/route rewrite.

## Known limitations
Files were committed through the GitHub repository API; this environment does not provide a local checkout/test runner. Tests have NOT been executed here. Vercel READY alone cannot prove authenticated database workflows or cross-tenant isolation. Reads and mutations use the shared browser Supabase client and depend on existing database RLS; server identity verification is implemented, but each live policy/role boundary still needs verification. Do not mark migration complete until unchecked acceptance items pass.

## Manual acceptance checklist
- [ ] Existing account signs in without a second account.
- [ ] Confirmation links return to correct route.
- [ ] Refreshing /owner retains session.
- [ ] Missing/expired session redirects to login with a local next path.
- [ ] Non-members and wrong-role users cannot read or mutate tenant data.
- [ ] Sign-out clears session.
- [ ] Widths 320/375/390px have no document-level horizontal overflow.
- [ ] Appointments, service/team forms, and settings work on mobile.
- [ ] Arabic RTL and English render correctly.
- [ ] Build, typecheck, automated tests, and cross-tenant RLS tests pass.
- [ ] New Vercel preview is READY and smoke tests pass.
