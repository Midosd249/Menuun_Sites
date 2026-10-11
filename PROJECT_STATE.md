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
- Confirmed owner-uploaded media in `public/assets/incoming/`: seven JPG files and one MP4.
- Wired `6686907_1791754412449871.mp4` into the hero as a muted, looping desktop enhancement; the local poster remains visible on mobile and when reduced motion is requested.
- Replaced the hero poster, three gallery images, and location image with local uploaded JPGs.
- Added `public/assets/simt/ASSET_MANIFEST.md` documenting the applied media roles and held files.
- Two JPGs remain unused because their visual content could not be reliably classified from filenames through the text-only repository connector.
- No claim is made that the media is licensed, visually approved, optimized into WebP/AVIF, or browser-verified. Current branch CI must be checked after these commits; production deployment is not verified.

## Active risks / unknowns
- All current business details, prices, team identities, photos, address, and opening hours are illustrative; replace with client-approved content before production.
- The demo now uses owner-supplied local media for the hero, gallery, and location sections. Some barber portraits remain remote placeholders; image optimization, rights confirmation, and visual/browser QA are still required.
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
