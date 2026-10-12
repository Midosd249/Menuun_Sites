# Menuun Public Platform — Product & Delivery Plan

**Status:** IMPLEMENTATION_IN_PROGRESS  
**Date:** 2026-10-12  
**Scope of this milestone:** Public marketing website and application foundation only.  
**Repository:** `Midosd249/Menuun_Sites`  
**Reference implementation:** `Midosd249/Menu_V3` (read-only; do not copy proprietary/product-specific code wholesale).

## 1. Product direction

Menuun becomes a professional, Arabic-first, bilingual SaaS platform for appointment-led businesses, starting with salons and barbershops. The public domain `www.menuun.com` should explain the product, establish trust, and provide clear routes to sign in or create an account. The current Atelier 09 salon page is a template candidate, not the main homepage. It has been preserved at `templates/atelier-09/index.html` while the public entry point is replaced.

The platform should follow Menu V3's engineering patterns where appropriate: React + TypeScript, Vite/TanStack-compatible routing strategy, server-side authentication, durable persistence, deterministic authorization, tenant isolation, tests-first changes, documented release evidence, and a disciplined specialist workflow. This is an architectural reference, not a blind file-for-file copy. Menuun has a different domain model (businesses, services, staff, appointment slots, booking requests, template catalog).

## 2. Verified facts / unknowns

### VERIFIED
- The target repository currently has a static public salon-template entry page and an `owner/` area.
- The existing salon page reads public salon/service/staff data through the browser-facing Supabase REST API.
- Menu V3 uses React 19, TypeScript, Vite, TanStack Start/Router, Better Auth, PostgreSQL/PGLite-related persistence, and automated tests.
- The AI Agent Foundation contract requires repository-first inspection, specialist routing, security boundaries, deterministic authorization, and evidence-based completion.
- The original Atelier 09 page is preserved at `templates/atelier-09/index.html` on the current branch.

### UNKNOWN / NOT YET VERIFIED
- Whether `www.menuun.com` is currently configured as a domain in the Vercel project.
- Whether the current Vercel project has a durable PostgreSQL integration available and configured.
- Whether current production domain traffic should be migrated to the new application immediately.
- Whether the existing Supabase salon data should be migrated, retained temporarily, or imported into the future Menuun schema.
- End-to-end browser behavior, production auth, email delivery, and real deployment status for this milestone.

## 3. Architecture principles

1. **Public site first, app surfaces later.** Deliver the public marketing experience first. Next implement authentication and account onboarding; then the customer workspace; then template catalog/publishing; then business workspace and booking lifecycle.
2. **One coherent web application.** Move away from multiple unrelated hand-authored HTML pages. Use React + TypeScript and a production build. Keep semantic HTML as the rendered output, not as the entire application architecture.
3. **Same-origin auth.** Browser clients call Menuun's own server routes. Password verification, session creation, account provisioning, tenant assignment, and authorization remain server-side.
4. **Durable persistence.** Do not treat Vercel function memory or filesystem as a database. Before auth is enabled, configure a durable database integration and verify its connection/backup/retention expectations.
5. **Copy patterns, not assumptions.** Reuse Menu V3's relevant architecture, route conventions, Better Auth setup, database abstractions, test patterns, security policies, and continuity discipline only after inspecting the exact source files. Do not copy its restaurant-specific domain model into salon scheduling.
6. **Tenant isolation by construction.** A user never gains ownership of a business from client-submitted IDs, slugs, roles, or redirects. Server authorization must resolve membership and business scope.
7. **No false functionality.** Public CTAs must lead to an implemented destination or clearly identify that destination as a next-stage surface. No fake signup success, fake bookings, invented metrics, or fake integrations.
8. **Accessible, Arabic-first product.** RTL Arabic is the primary design path; English LTR is supported. Respect keyboard navigation, visible focus, contrast, reduced motion, and mobile safe areas.
9. **Design from references, not imitation.** Research multiple design directions and synthesize a distinctive Menuun identity. Do not copy competitor assets, text, or exact layouts.
10. **Release evidence.** A Git commit or HTTP 200 alone does not prove the experience works. Use repository tests, build evidence, browser/visual QA, and direct Vercel deployment evidence when available.

## 4. Delivery phases

### Phase 0 — Repository and product foundation
- Inspect current repository, Vercel linkage, Menu V3 auth/data patterns, and AI Agent Foundation instructions.
- Record design research and implementation plan.
- Preserve the current Atelier 09 page as a future template.
- Establish the target stack and quality gates.
**Acceptance:** a documented scope, preserved legacy template, explicit unknowns, and a dedicated implementation branch.

### Phase 1 — Public marketing website (current)
- Replace the root experience with a polished responsive React/TypeScript landing page.
- Establish a consistent brand system, Arabic/English switch, RTL/LTR behavior, metadata, and accessible navigation.
- Explain product value for appointment-led businesses without promising features that are not yet implemented.
- Add clear sign-in and create-account entry points, with honest staged behavior until auth routes exist.
- Create a scalable app entry and build configuration suitable for Vercel.
**Acceptance:** production build succeeds; public page is responsive and accessible by source-level checks; CTAs have honest destinations; no secrets or client-side auth shortcuts; legacy salon template remains preserved.

### Phase 2 — Authentication and identity
- Port the relevant Better Auth patterns from Menu V3 after auditing the complete auth, database, environment, email, session, and test contracts.
- Add server-side signup/login/logout/session endpoints on the same origin.
- Use a durable database configured through the Vercel project or a connected database provider; do not create paid resources or migrate data without approval.
- Define verification, password reset, rate limiting, session cookie, CSRF/origin, error, and abuse controls.
- Tests first: registration contract, password login, invalid credentials, duplicate email, session lifecycle, and server-side auth configuration.
**Acceptance:** real integration tests and browser flow prove signup/login/logout; no client-side secret; persistent accounts survive function restarts.

### Phase 3 — Customer workspace and onboarding
- Build a protected workspace shell.
- Establish user profile, business creation, business membership, and onboarding state machine.
- Provision tenant records server-side; never accept owner role/membership as trusted signup input.
- Provide clear empty/loading/error states and a guided first-run checklist.
**Acceptance:** tenant ownership and membership are server-verified; unauthenticated requests redirect correctly; cross-tenant access tests pass.

### Phase 4 — Template catalog and publishing
- Introduce a template registry with five initial templates, each with documented purpose, preview, supported features, and version.
- Convert Atelier 09 into the first reusable template without allowing template-specific behavior to leak into platform/business logic.
- Add draft/preview/published lifecycle and per-business template selection.
- Separate template design tokens/content slots from business data and booking capabilities.
**Acceptance:** each template can render the same normalized business data; template switching does not change tenant data; published pages have SEO metadata and reliable fallback states.

### Phase 5 — Scheduling domain and business workspace
- Define canonical schema for businesses, branches (if required), services, staff, business hours, time-off, appointments/booking requests, and audit events.
- Implement slot calculation and appointment creation on the server with concurrency protection.
- Keep availability, time zone, booking status, and pricing authoritative on the server.
- Preserve or migrate existing Supabase data only after a reviewed migration plan and backup.
**Acceptance:** booking integration tests cover overlap/race conditions, time zones, inactive staff/services, business isolation, and cancellation/rescheduling policy.

### Phase 6 — Quality, launch, and growth
- Add CI quality gates, unit/integration tests, Playwright/browser smoke flows, responsive visual QA, performance budgets, and SEO/social previews.
- Verify the custom domain and Vercel project settings before production release.
- Add monitoring and privacy-safe operational diagnostics.
- Release one verified batch at a time with rollback instructions and direct evidence.
**Acceptance:** no critical auth/tenant isolation issues; build/tests pass; mobile and RTL/English flows verified; deployment/domain state confirmed by Vercel evidence.

## 5. Current implementation boundary

Only Phase 0 and Phase 1 are authorized in this batch. Do not implement or imply working authentication, account provisioning, client workspace, template selection, database migration, or real appointment creation as part of the marketing-site milestone. Do not change Vercel project settings, production domain configuration, paid integrations, or existing user data in this phase.

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| Replacing the current root page disrupts the salon demo | Preserve it at `templates/atelier-09/index.html` and keep `owner/` unchanged in this milestone. |
| Copying Menu V3 literally imports the wrong domain model | Port only proven architectural patterns; define a separate scheduling model. |
| Auth is built before durable persistence exists | Treat database availability as a hard Phase 2 gate. |
| UI suggests unfinished features are live | Use truthful copy and non-deceptive staged destinations. |
| Direct commits trigger unexpected Vercel activity | Work on a dedicated feature branch; verify deployments before claiming status. |
| Design reference connector is unavailable | Record that limitation; synthesize from public research and product principles without claiming a Refero audit. |

## 7. Verification plan for Phase 1

- Inspect package scripts and run the repository's actual build/test commands.
- Add a deterministic public-site contract test for key sections, metadata, language toggle, accessibility landmarks, and auth CTA destinations.
- Build the Vite app and check for broken imports or missing assets.
- Review source for secret exposure, unsafe HTML insertion, fake account success, and links to non-existent production routes.
- If browser tooling is available, test desktop/mobile and Arabic RTL/English LTR in a real browser.
- Inspect the resulting Vercel deployment only if a deployment is generated; do not infer deployment from a commit.

## 8. Session log

### 2026-10-12
- Inspected Menu V3 operating contract, package manifest, auth architecture references, and AI Agent Foundation's operating/security contracts.
- Inspected the current Menuun_Sites root and confirmed it is currently a static salon-template page.
- Created branch `feat/public-platform-foundation`.
- Preserved the existing root page at `templates/atelier-09/index.html`.
- Next task: replace the root experience with the React/TypeScript public marketing application and establish its build/test contract.


## 11. Next.js migration update — 2026-10-13

### Decision
The application foundation is moving from Vite to **Next.js App Router** before authentication and the tenant data model are implemented. This avoids designing future public tenant pages and metadata around a client-only root entry, while keeping the existing React/TypeScript UI and preserving legacy static experiences.

### Scope of the migration commit
- Move the existing marketing UI into `app/page.tsx` and shared CSS into `app/globals.css`.
- Add the root App Router layout and metadata, robots and sitemap handlers.
- Replace Vite build scripts/configuration with Next.js build scripts/configuration.
- Copy `owner/`, `templates/` and the Menuun brand SVGs into Next.js `public/` at build time without overwriting the existing `public/assets/images/` library.
- Add rewrites for the legacy `/owner/` and `/templates/atelier-09/` directory-index URLs.
- Keep the staged login/signup experience honest.
- Add CI typecheck and Next.js contract checks.
- Document the architecture, repo audit, decisions and handoff.

### Explicitly out of scope
No real authentication, tenant provisioning, booking API, schema changes, Storage policy changes, AI provider, domain change, Vercel project setting change, production deployment or PR merge is part of this migration.

### Acceptance
1. `npm test`, `npm run typecheck` and `npm run build` pass in GitHub Actions.
2. Browser QA confirms the root page and compatibility routes load without console errors.
3. Arabic RTL and English LTR are reviewed at mobile, tablet and desktop sizes.
4. Deployment evidence is recorded from Vercel after the daily deployment limit is confirmed clear.
5. The PR remains unmerged until the above checks are evidenced.

**Only Phase 1 is authorized in this migration.** Authentication and data changes require a separate implementation pass after the existing Supabase migration history is reconciled.


### Deployment configuration finding — 2026-10-13
- The first Vercel deployment for the Next.js implementation reached `READY` and its logs showed a successful Next.js build, but HTTP checks still served the legacy Vite root HTML and returned 404 for the new Next.js routes and SEO endpoints.
- Vercel deployment metadata showed the project framework preset as `null`. This is not sufficient evidence of a working Next.js deployment.
- The repository configuration now explicitly sets `"framework": "nextjs"` in `vercel.json`, using Vercel's documented file-based override for the Framework Preset. The next preview must verify the change; no dashboard setting or production domain was changed.
- CSS build warnings for `align-items: end` were removed by using `flex-end`.


### Output-directory correction — 2026-10-13
- The first `framework: "nextjs"` override made Vercel compile Next.js and generate all App Router pages, but deployment packaging still failed because the project's configured Output Directory remained the Vite-era output.
- Vercel build logs reported `/vercel/path0/routes-manifest.json` missing and explicitly identified an Output Directory mismatch. The repo now sets `outputDirectory: ".next"` alongside `framework: "nextjs"` to override that legacy setting at the deployment-config layer.
- This does not change the Vercel dashboard or production domain. Validate the next preview before marking routing complete.


### Verified preview routing — 2026-10-13
- GitHub Actions run `38322471413` passed on implementation commit `25d06d6`.
- Vercel preview `dpl_464sbkcgdRteY7wyJoFXjppGLu81` reached READY after `vercel.json` explicitly set the Next.js framework and `.next` output directory.
- HTTP smoke checks returned 200 for the root page, both login/signup paths (with and without trailing slash), `/owner/`, `/templates/atelier-09/`, `/robots.txt` and `/sitemap.xml`.
- The homepage response contains Next.js markup and no longer references `/src/main.tsx`.
- Browser-based visual QA is still pending. Do not infer mobile, keyboard or interaction correctness from HTTP responses.


### Final migration checkpoint — 2026-10-13
- GitHub Actions run `38322706018` passed tests, typecheck, build and static checks on commit `1d84263`.
- Vercel preview `dpl_2to2zUtiik8GebE5c3xpWuc13hRB` reached READY; HTTP checks returned 200 for marketing, login, signup, owner, Atelier 09, robots and sitemap paths.
- Account routes have distinct metadata and are excluded from indexing.
- Remaining acceptance gap is real-browser visual and interaction QA; no screenshots or mobile-device behavior are claimed as verified.
