# Project State — Menuun Sites

## Purpose
Standalone, production-grade multi-tenant website platform for Menuun customers, initially focused on salons and beauty businesses, designed to integrate safely with Menu V3 without coupling applications or sharing a database directly.

## Verified repository state
- Repository: `Midosd249/Menuun_Sites`
- Active feature branch: `feature/salon-vertical-slice`
- Current PR: [#2 — Build the first salon website vertical slice](https://github.com/Midosd249/Menuun_Sites/pull/2)
- Current head: recorded from GitHub at the end of this session; re-check before merge.
- Framework in code: Next.js App Router, React, TypeScript.
- Demo: fictional SIMT Barber House site with Arabic RTL / English LTR, responsive service/team/gallery/location sections, and a simulated booking wizard.
- Booking behavior: UI-only simulation; it does not create appointments, send messages, or persist submitted details.
- Production deployment: NOT VERIFIED.
- Domain/DNS setup: NOT VERIFIED.
- Authentication, database, object storage, and hosting provider: NOT DECIDED.
- Menu V3 integration: NOT IMPLEMENTED.

## Product decisions
- Sites is a separate application and deployment lifecycle from Menu V3.
- Menu V3 remains the source of truth for its existing menu product and production data.
- Integration starts with an explicit server-to-server API contract; no direct database sharing.
- Initial product vertical: salon / beauty websites; the current design slice uses a barbershop concept to test a full booking journey.
- Initial publishing target: customer subdomains under a Menuun-controlled domain, after DNS/hosting setup is verified.
- Custom customer domains are a later milestone, requiring domain ownership verification and lifecycle management.
- AI-assisted design/content is optional and bounded; generated output must be validated and editable.
- Prefer structured section-based editing over arbitrary code execution in customer sites.

## Current milestone
M1 — Salon/barbershop design vertical slice (prototype only).

## Completed in code (not yet release-verified)
- [x] Bootstrap Next.js App Router, TypeScript, lint and test scripts.
- [x] Create distinctive Arabic-first, RTL/LTR barber-site prototype.
- [x] Add service menu, barber profiles, gallery, location/hours, FAQ, and mobile navigation.
- [x] Add guided demo booking steps and explicit no-real-booking disclosure.
- [x] Add Playwright acceptance coverage for locale direction, mobile navigation, booking path, and horizontal overflow.
- [x] Fix CI secret-scan permission configuration and add application/browser quality jobs.
- [ ] Verify all CI jobs pass on the current PR head.
- [ ] Verify visual/browser behavior at 360px, 390px, 768px, 1024px, 1280px and wide desktop.
- [ ] Replace remote placeholder images with approved optimized local assets and record provenance.
- [ ] Implement authentication, persistence, editor, preview, and publishing.

## Active risks / unknowns
- All current business details, prices, team identities, photos, address, and opening hours are illustrative; replace with client-approved content before production.
- Images are currently remote Unsplash-hosted URLs; local optimization and an asset manifest are still required.
- Demo booking inputs are intentionally not persisted. Real booking requires a provider contract, consent/privacy design, error handling, and verified business contact details.
- Confirm repository permissions, branch protection, and default branch settings.
- Confirm Vercel project/team and DNS ownership before domain implementation.
- Decide auth and data ownership for shared Menuun identity.
- Decide storage provider and image processing pipeline.
- Define API ownership, authentication, versioning, rate limits, and failure behavior between Menu V3 and Sites.
- Review the Ritunio source/license before reusing any code or assets. The current implementation uses a separate visual direction and does not copy the demo's source code.

## Verification evidence
- GitHub Actions run `38168946607` for the initial PR head failed in the Secret scan job because the workflow token lacked permission to list pull-request commits (HTTP 403, `Resource not accessible by integration`); the Foundation completeness job passed.
- Workflow permissions were updated to include `pull-requests: read`, and lint/typecheck/unit-test/build/browser-smoke jobs were added. Awaiting a new run on the latest head before marking checks passed.
- No local install, build, unit test, or browser run has been performed in this session.
- Production deployment is NOT VERIFIED.

## Handoff
After CI completes, inspect each failed step's logs, fix confirmed issues, rerun affected checks, and update this file with the exact latest SHA and run URL. Do not merge until required checks pass. Continue next with accessibility/responsive visual review, approved assets, then the tenant-scoped editor/publishing architecture.
