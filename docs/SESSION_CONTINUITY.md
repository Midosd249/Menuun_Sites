# Menuun Site — Session Continuity

> Updated: 2026-10-12  
> Read this first in every new conversation, then read `docs/MASTER_PLAN_MENUUN_SITE.md`.

## Canonical project identity

- Product: Menuun Site — independent SaaS to build and operate websites for local businesses, starting with barbershops/salons.
- GitHub repository: `Midosd249/Menuun_Sites`
- Current site/template branch: `feat/barber-atelier-experience`
- Documentation/platform foundation branch: `feat/menuun-site-platform-foundation`
- Supabase project: `Menuun_Site`, ref `kphypflbkbcvgcaupxxm`, URL `https://kphypflbkbcvgcaupxxm.supabase.co`
- Reference product repository (read-only for this project): `Midosd249/Menu_V3`
- Menu V3 production Supabase ref: `ublxptcqefujkbeepylc`, app schema `menu_v3`.

## User-approved preview and media constraint

Use this as the currently preferred reference because the user explicitly confirmed it displays the video and images:

`https://menuun-sites-pybbjgxyb-midosd2s-projects.vercel.app/`

Do not silently switch to `https://menuun-sites.vercel.app/`; the user reported its hero video was missing. Previous Vercel MCP URL fetch returned 404 despite an earlier deployment listing READY, so deployment/browser state needs direct re-verification before making claims.

## Current development preview

- Latest stable branch preview for `feat/menuun-site-platform-foundation`: `https://menuun-sites-git-feat-menuun-site-plat-982423-midosd2s-projects.vercel.app/`
- Owner workspace: append `/owner/` to that preview URL.
- Verified HTTP 200 for `/`, `/owner/`, and `/owner/config.js`; SQL migration and internal docs paths return 404 after `.vercelignore`.
- Latest GitHub Actions Static Quality run for the current commit completed with `success`.

## What has been verified

1. `Menuun_Site` Supabase project exists and reports `ACTIVE_HEALTHY`, region `ap-northeast-2`.
2. The new Supabase project showed no tables in `public` / `menuun_site`, no migration history, and no Edge Functions at audit time.
3. Menu V3 is a separate, populated Supabase project. Its migration runner hard-codes `POSTGRES_SCHEMA = "menu_v3"`; never run its migrations or data operations against the new project without a deliberate porting plan, and never modify the reference project's live data.
4. The salon template in `Menuun_Sites` branch `feat/barber-atelier-experience` is an HTML/CSS/JS page with Arabic RTL and English LTR support, a hero/media experience, services, gallery, salon info and a booking wizard.
5. The booking wizard is explicitly a demo. It uses hard-coded services/barbers/times and tells the user no information is transmitted or stored. It is not a live booking service.
6. Video and images have relied on external Vercel asset URLs. Confirm asset availability, ownership/licensing, poster fallback, MIME type and playback after every media-related deployment.
7. A dedicated branch `feat/menuun-site-platform-foundation` was created from `feat/barber-atelier-experience` and documentation was started there to avoid disrupting the user's preferred preview branch.
8. The first three database migrations have now been applied to `Menuun_Site`: salon foundation, security hardening, and policy cleanup. Details are in `docs/DATABASE_FOUNDATION_VERIFICATION.md`.
9. Full Git tree inventory is recorded in `docs/AUDIT_2026-10-12.md`: 24 tree entries, 13 file blobs, core `index.html`, no `package.json` or `vercel.json` in the inspected branch.
10. Vercel connector verified HTTP 200 for the approved preview, MP4 hero video, JPEG poster, and a booking image. This is HTTP-level proof only; no browser autoplay/device QA was run.
11. The master plan, active plan, and audit report are committed on `feat/menuun-site-platform-foundation`.
12. Migration `20261012184720 booking_and_media` is now applied to the new Menuun Site Supabase project: private `salon-media` bucket (100 MiB cap and allowlisted image/video MIME types), tenant-scoped Storage policies, and a public booking RPC with server-side salon/service/barber/hour/time validation, database-enforced overlap protection, appointment event logging and owner notifications. The privileged implementation function lives in `private`; the public RPC wrapper uses invoker security.

## Product architecture agreed in principle

Three surfaces:
- Public salon website, reachable via slug/link and QR.
- Owner workspace to manage appointments, services, barbers, hours, photos/video, site settings, preview and publish.
- Platform admin workspace for tenant lifecycle, plans, template management and support operations.

Multi-tenant rules:
- Derive tenant/salon scope server-side from the verified session and membership; never trust client-supplied `salon_id`.
- Keep drafts separate from published state.
- Enforce row and storage isolation and test cross-tenant access explicitly.
- Validate booking time, service price/duration and conflicts server-side/database-side.
- Appointment states proposed: pending, confirmed, reschedule_requested, completed, cancelled, no_show.
- Keep an audit trail for appointment status and publish actions.
- Store media bytes in object storage, not database rows; database keeps metadata.
- Publish a consistent version and preserve a rollback path.

Proposed initial data domains (not yet implemented): salons, profiles, salon_members, services, barbers, barber_services, business_hours, barber_schedules, time_off, appointments, appointment_events, media_assets, site_settings, site_revisions, notifications, later subscriptions.

See the master plan for the complete feature scope, architecture, security rules, staged roadmap and acceptance gates.

## Critical security note

The user supplied a Supabase publishable key in chat. Treat it as a public-client key only; it is not a database password and must never be confused with a service-role/secret key. Do not copy secrets into GitHub. Configure runtime values through deployment environment variables. No service-role key or database connection string has been supplied for this task.

## Exact next actions

1. Continue on `feat/menuun-site-platform-foundation`.
2. Inspect the full repository tree, current branch and history, media assets, deployment config, existing booking code, and current Vercel deployment records.
3. [x] Record the actual runtime/build baseline: one HTML/CSS/JS page; no package.json or vercel.json in the inspected branch.
4. [x] Verify the preferred preview, hero MP4, poster JPEG and one booking image return HTTP 200 through Vercel integration.
5. [x] Draft initial tenant/data/security design and apply the first three schema migrations to `kphypflbkbcvgcaupxxm` only; all 12 app tables have RLS.
6. [x] Add a responsive static owner workspace at `owner/index.html` and public browser config at `owner/config.js`; root salon `index.html` is unchanged. Preview route verified HTTP 200, but interactive browser QA remains pending.
7. [x] SQL transaction tests passed for cross-tenant RLS, onboarding RPC, appointment overlap exclusion, status transition guard and event log.
8. [x] Apply `booking_and_media`: private Storage bucket and salon-scoped policies; public booking RPC validates published salon, active service/barber, business hours, time horizon and overlap, and writes appointment event + owner notifications.
9. [x] Run a rollback-only transactional smoke test for a successful booking, snapshot values, event/notification creation, overlap rejection and invalid service rejection; security advisor remains clean.
10. [ ] Wire the public ATELIER 09 booking wizard to this RPC and live availability; implement signed media URLs and owner upload/editor UI.
11. [ ] Test real Supabase Auth signup/login, Storage upload permissions, and responsive Arabic/English browser journeys.
12. Keep the current Vercel deployment as Preview only. Do not promote to production until browser QA, Auth redirect settings, public booking UI and media management are complete.

## Status vocabulary

- `DISCOVERY_VERIFIED`: source inspection or tool output proves the fact.
- `IMPLEMENTATION_IN_PROGRESS`: code/schema changes are underway.
- `VERIFIED_LOCALLY`: actual local checks passed and are recorded.
- `PUSHED`: changes are in GitHub.
- `DEPLOYED`: direct Vercel evidence plus URL verification exists.
- `BLOCKED`: dependency/permission/runtime limitation is named explicitly.

Current overall state: `PUBLIC_BOOKING_WIZARD_WIRED_TO_LIVE_APIS / DATABASE_FOUNDATION_IMPLEMENTED / BROWSER_QA_PENDING`. Five migrations are applied to the dedicated Menuun Site Supabase project. The public site now loads published salon services and barbers, requests date-specific availability from `get_public_booking_slots`, submits only through `request_salon_appointment`, and shows success only after the database returns an appointment ID. Availability SQL smoke checks passed in a rollback-only transaction; security advisor returned no findings. No published salon rows currently exist, so the ATELIER 09 preview reports that it must be linked to a published salon (`?salon=your-slug`) rather than pretending to accept bookings. Official Menuun logo SVG variants were copied from Menu V3 into this repository; Menu V3 was read-only and its code/data were not modified. No browser E2E or deployment of these latest commits has been verified.
