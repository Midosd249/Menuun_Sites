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
