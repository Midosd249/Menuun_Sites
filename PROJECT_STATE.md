# Project State — Menuun Sites

## Purpose
Standalone, production-grade multi-tenant website platform for Menuun customers, initially focused on salons and beauty businesses, designed to integrate safely with Menu V3 without coupling applications or sharing a database directly.

## Verified repository state
- Repository: `Midosd249/Menuun_Sites`
- Active feature branch: `feature/salon-vertical-slice`
- Current PR: [#2 — Build the first salon website vertical slice](https://github.com/Midosd249/Menuun_Sites/pull/2)
- Code/test head verified: `ea0280099eaddf8be5aa3ec0e3d195a1d2226988`; re-check the latest PR head before merge.
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
- [x] Verify all CI jobs pass on code/test head `ea0280099eaddf8be5aa3ec0e3d195a1d2226988`.
- [ ] Verify visual/browser behavior at 360px, 390px, 768px, 1024px, 1280px and wide desktop.
- [ ] Replace remote placeholder images with approved optimized local assets and record provenance.
- [ ] Implement authentication, persistence, editor, preview, and publishing.

## Latest asset integration — 2026-10-12
- Confirmed and visually reviewed seven owner-uploaded JPG photos and one MP4 originally uploaded to `public/assets/incoming/`, then moved with original names into `public/assets/simt/` for site use.
- Wired `6686907_1791754412449871.mp4` into the desktop hero with muted looping playback, a pause/play control, and a still-first fallback for mobile and reduced-motion visitors.
- Local photos now appear in the hero poster, image-led service rows, gallery, location/space section, and one illustrative barber profile.
- Reviewed all nine MAREA mobile reference screenshots and moved them, preserving filenames, from `public/assets/` to `docs/design-references/` so they are not served as customer-facing media. The design synthesis is recorded in `docs/design-references/README.md`.
- Added `public/assets/simt/ASSET_MANIFEST.md` with media mapping, rights notes, and remaining release gates.
- Design direction now adapts the references' forest-green contrast, warm ivory canvas, teal booking action, restrained gold details, and photo-led service discovery while keeping SIMT's own identity.
- Image/video rights, technical metadata, modern-format optimization, and browser visual QA are not verified. Production deployment is not verified.
- Latest media code and responsive behavior are on commit `7af6f26bf0794125774b7ea899d6981eda9f24c4`; the media acceptance tests were added in `43f4ec94cb4da91ca81ebdafc01855bed1ca1c9d` and cover desktop video, pause/play, mobile still fallback, and reduced motion. GitHub Actions run `38179926660` passed all jobs (secret scan, foundation completeness, lint, typecheck, unit tests, production build, and desktop/mobile Playwright smoke tests) for code/test head `7af6f26bf0794125774b7ea899d6981eda9f24c4`. Review in [PR #2](https://github.com/Midosd249/Menuun_Sites/pull/2). This does not verify a Vercel preview or production deployment.
## Active risks / unknowns
- All current business details, prices, team identities, photos, address, and opening hours are illustrative; replace with client-approved content before production.
- The demo now uses owner-supplied local media for the hero, service rows, gallery, location, and one barber profile. Other illustrative barber portraits remain remote placeholders; image optimization, rights confirmation, and browser visual QA are still required.
- Demo booking inputs are intentionally not persisted. Real booking requires a provider contract, consent/privacy design, error handling, and verified business contact details.
- Confirm repository permissions, branch protection, and default branch settings.
- Confirm Vercel project/team and DNS ownership before domain implementation.
- Decide auth and data ownership for shared Menuun identity.
- Decide storage provider and image processing pipeline.
- Define API ownership, authentication, versioning, rate limits, and failure behavior between Menu V3 and Sites.
- Review the Ritunio source/license before reusing any code or assets. The current implementation uses a separate visual direction and does not copy the demo's source code.

## Verification evidence
- GitHub Actions run `38168946607` initially failed because the secret scanner lacked pull-request read permission (HTTP 403). Adding `pull-requests: read` fixed this: the Secret scan now passes.
- GitHub Actions run `38170308565` completed successfully for code/test head `ea0280099eaddf8be5aa3ec0e3d195a1d2226988`: Secret scan, foundation completeness, application lint/typecheck/unit tests/production build, and Playwright desktop + mobile smoke tests all passed.
- The first browser run found two real issues (ambiguous booking locator and iPhone device defaulting to WebKit when only Chromium was installed); both were fixed and the later browser run passed.
- No local install/build/browser run was performed; verification was through GitHub Actions.
- Production deployment is NOT VERIFIED.

## Handoff
The code/test head above passed all configured CI checks. Re-check the latest PR head and required checks before merge, because this continuity-file update creates a documentation-only commit. Do not merge until the latest head's required checks pass. Continue next with accessibility/responsive visual review, approved assets, then the tenant-scoped editor/publishing architecture.
