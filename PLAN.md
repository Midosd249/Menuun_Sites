# Menuun Sites — Product & Delivery Plan

## Objective
Deliver a high-quality website builder as an independently deployed Menuun product. Customers can create, edit, preview, and publish professional sites; the initial vertical is salons and beauty businesses.

## Architecture principles
1. Separate repository, app runtime, CI, and deployment from Menu V3.
2. Integrate through a versioned server-side API; never couple by reading Menu V3's database directly.
3. Keep tenant, site, domain, page, asset, and publication models explicit.
4. Resolve public domains to sites server-side and authorize every management action independently.
5. Store drafts and published versions separately or use immutable publication snapshots.
6. Render published websites from structured, validated page schemas; never execute tenant-provided code.
7. Keep templates and design-system components differentiated by business context.
8. Treat AI as an optional authoring assistant, never as the source of authorization or truth.
9. Build accessibility, SEO, responsive behavior, RTL/LTR, performance, and observability into acceptance criteria.
10. Prefer managed services and the simplest architecture that meets reliability and isolation requirements.

## Milestones

### M0 — Foundation
- [x] Create repository operating contract and continuity documents.
- [x] Document product boundary and integration principles.
- [x] Select and bootstrap a minimal Next.js/React/TypeScript runtime (database, auth, object storage, and hosting remain undecided).
- [x] Add package scripts, lint/type checks, unit test runner, secret scan, and CI workflow.
- [x] Add Playwright desktop/mobile smoke coverage for core prototype behavior.
- [ ] Verify clean install/build and all CI jobs; document environment variables.

### M1 — Salon site vertical slice
- [x] Build a distinctive Arabic-first barbershop prototype with services, team, gallery, location, FAQ, and booking CTA.
- [ ] Convert static prototype sections into tenant-editable structured content.
- [x] Add Arabic RTL and English LTR switching and Playwright acceptance coverage.
- [ ] Replace remote demo images with approved optimized local assets and record provenance/licenses.
- [ ] Verify 360px, 390px, 768px, 1024px, 1280px and wide desktop layouts in browser runs.
- [x] Add a focused SIMT visual-polish pass for Arabic typography, motion, interaction feedback, and form semantics; see [SIMT polish review](docs/design-references/SIMT-POLISH-REVIEW.md).
- [ ] Validate the polish branch through CI and browser-based responsive/accessibility checks before merge.

M1 asset follow-up:
- [x] Wire the supplied MP4 into the desktop hero with a local poster and reduced-motion/mobile fallback.
- [x] Integrate owner-supplied media across hero, services, gallery, location, and one barber profile; document the mapping.
- [x] Review the nine supplied MAREA screenshots and document a SIMT-specific visual direction; move reference screenshots outside `public/`.
- [ ] Verify usage rights and media dimensions/codec, optimize responsive image/video variants, and compare browser renders with the reference screenshots.
- [ ] Complete responsive and accessibility browser QA after the media change.

### M2 — Site management
- [ ] Authentication and tenant-scoped dashboard.
- [ ] Create site, choose template, edit content, upload assets, preview draft.
- [ ] Schema validation, safe rich text, image validation, size limits, and rate limits.
- [ ] Autosave/version history with explicit publish action.

### M3 — Publishing and subdomains
- [ ] Domain/subdomain reservation and collision handling.
- [ ] Server-side hostname normalization and site resolution.
- [ ] Preview isolation and no draft leakage.
- [ ] Publish snapshots, cache invalidation, rollback, 404 and error states.
- [ ] Configure wildcard DNS/TLS only after hosting and DNS ownership are verified.

### M4 — Menuun integration
- [ ] Agree on identity and tenant mapping.
- [ ] Define versioned service-to-service API and auth (short-lived signed tokens or equivalent).
- [ ] Add entitlement/plan mapping without duplicating billing truth.
- [ ] Add optional menu embed/link/API integration with graceful degradation.
- [ ] Contract tests and integration observability.

### M5 — Custom domains and commercial readiness
- [ ] Domain ownership verification and automated certificate lifecycle.
- [ ] Canonical URLs, redirects, sitemap, robots, metadata and social previews.
- [ ] Backup/restore, monitoring, alerts, abuse controls and incident runbook.
- [ ] Performance, accessibility, security, privacy and release review.

## Release gates
No production release until required CI, critical Playwright journeys, tenant-isolation tests, secret scan, migration review, accessibility smoke checks, and deployment SHA verification pass.
