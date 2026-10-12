# Tasks

## Active task
**Verify the Next.js public-platform migration** — IN_PROGRESS.

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
- [ ] Inspect CI for the current documentation-only evidence refresh commit before merge.
- [ ] Real-browser QA confirms `/`, `/login`, `/signup`, `/owner/`, and `/templates/atelier-09/`.
- [ ] RTL/LTR visual QA at mobile, tablet and desktop.
- [ ] Vercel preview is inspected after quota availability is verified. The first READY preview still served Vite HTML and returned 404 for Next.js routes; verify the new `framework: nextjs` configuration before calling routing complete.

## Backlog
- [ ] Audit Supabase live migration history and reconcile branch-specific continuity records.
- [ ] Select and implement server-side authentication with official Next.js/Supabase SSR guidance.
- [ ] Add deterministic authorization, tenant memberships and RLS tests.
- [ ] Design and migrate the salon scheduling data model.
- [ ] Add public tenant routes and QR link contract.
- [ ] Build business workspace, template registry and publication lifecycle.
- [ ] Add E2E, accessibility, performance and SEO quality gates.
- [ ] Restore Refero access and create a source-backed visual reference lock before major redesign.

## Guardrails
No production deploy, domain mutation, paid resource, auth enablement, schema migration, data migration or PR merge without explicit authorization and evidence.
