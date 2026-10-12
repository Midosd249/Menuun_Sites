# Menuun Site — Active Plan

> Updated: 2026-10-12  
> Full scope and decisions: `docs/MASTER_PLAN_MENUUN_SITE.md`  
> Handoff for a new chat: `docs/SESSION_CONTINUITY.md`

## Current objective

Prepare the first production-capable slice of an independent salon website SaaS. ATELIER 09 remains the first visual template. Keep the user's preferred preview intact while creating a separate owner operations area and a dedicated Supabase backend.

## Verified baseline

- Current salon page is HTML/CSS/JS, with Arabic RTL and English LTR, video/images, and a multi-step booking demo.
- The booking demo does not persist or transmit requests.
- Supabase `Menuun_Site` ref `kphypflbkbcvgcaupxxm` is active and showed no app tables, migration records, or Edge Functions at audit time.
- Menu V3 uses its own separate project and `menu_v3` schema; it is reference-only.
- Preferred visual reference: `https://menuun-sites-pybbjgxyb-midosd2s-projects.vercel.app/`.
- Work is on `feat/menuun-site-platform-foundation`, created from `feat/barber-atelier-experience`.

## Work queue

### S0 — Repository and deployment inventory (MOSTLY VERIFIED; browser QA pending)
- [x] Inspect all paths and branch refs; identify build framework, static entry points, assets, media sources, and Vercel settings.
- [x] Confirm the approved preview returns HTTP 200 and video/poster/image URLs return HTTP 200 through the Vercel connector.
- [ ] Browser/video playback QA remains pending; actual autoplay and mobile browser behavior are not verified.
- Inspect current branch diffs and Vercel deployment state.
- Confirm whether the preferred preview is accessible and whether video, poster, and images return usable responses.
- Do not change the existing template or deploy during this inventory.

### S1 — Technical design and data/security contract (FOUNDATION IMPLEMENTED; end-to-end tests pending)
- [x] Define initial salon ERD, roles, allowed appointment transitions, publishing model and RLS policy approach.
- [x] Add database exclusion constraint for overlapping active appointments per barber/salon.
- [x] Apply private authorization helpers, safe invoker RPC wrappers, explicit grants and RLS.
- [x] Verify security advisor reports no lint findings.
- [ ] Test onboarding and tenant isolation using controlled auth users; confirm booking status events and conflict rejection.
- [ ] Design and test Storage upload path/bucket policies.

### S2 — Foundation schema (APPLIED)
- [x] Three versioned migrations are applied and their source files are stored under `supabase/migrations/`.
- [x] Created 12 tables for tenants/memberships, services, barbers, hours, appointments/events, media metadata, site draft/published state/revisions, and notifications.
- [x] Enabled RLS on all 12 tables; security advisor is clean.
- [x] Added FK indexes; remaining unused-index notices are informational until workload exists.
- [x] Confirmed the migration history and zero application rows.
- [ ] Run controlled auth/tenant and booking behavior tests before production use.
- Never target Menu V3 project ref `ublxptcqefujkbeepylc`.

### S3 — Owner authentication and operations shell (NEXT IMPLEMENTATION)
- Add the app build/runtime foundation without discarding the current HTML visual reference.
- Login/session guard; owner workspace responsive shell; tenant selection from server-verified membership.
- Basic inbox list and detail; no demo UI pretending to be connected to live data.

### S4 — Real appointment workflow
- Public submit endpoint validates fields, service, time and business hours.
- Atomic conflict prevention; pending status only after persistence succeeds.
- Owner confirms/rejects/reschedules/completes; append audit events.
- Idempotency and rate limiting; tests for concurrent conflicting requests and tenant isolation.

### S5 — Content and media management
- Services, prices, barbers, opening hours, logo/gallery/video/poster.
- Private upload authorization; explicit preview/publish; public site reads only published version.
- Preserve the current video-first experience with image fallback.

### S6 — First salon pilot
- Configure only owner-confirmed salon information.
- Public slug, QR generation, share metadata and contact actions.
- Full tests at small phone, tablet and desktop widths in Arabic and English.
- Deployment evidence and URL checks before declaring ready.

### S7 — Platformization
- Tenant admin, template registry, plans/usage, support audit trail and later billing.
- Only after first salon lifecycle works reliably.

## Acceptance criteria for S0

- [x] Written inventory of real source files and deployment/deployment-record evidence in `docs/AUDIT_2026-10-12.md`.
- No assumed framework or invented build/test results.
- Verified status for preferred preview, video and poster; limitations recorded if external tools cannot verify them.
- Next task narrowed to one atomic change, with rollback and test strategy.
