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

## What has been verified

1. `Menuun_Site` Supabase project exists and reports `ACTIVE_HEALTHY`, region `ap-northeast-2`.
2. The new Supabase project showed no tables in `public` / `menuun_site`, no migration history, and no Edge Functions at audit time.
3. Menu V3 is a separate, populated Supabase project. Its migration runner hard-codes `POSTGRES_SCHEMA = "menu_v3"`; never run its migrations or data operations against the new project without a deliberate porting plan, and never modify the reference project's live data.
4. The salon template in `Menuun_Sites` branch `feat/barber-atelier-experience` is an HTML/CSS/JS page with Arabic RTL and English LTR support, a hero/media experience, services, gallery, salon info and a booking wizard.
5. The booking wizard is explicitly a demo. It uses hard-coded services/barbers/times and tells the user no information is transmitted or stored. It is not a live booking service.
6. Video and images have relied on external Vercel asset URLs. Confirm asset availability, ownership/licensing, poster fallback, MIME type and playback after every media-related deployment.
7. A dedicated branch `feat/menuun-site-platform-foundation` was created from `feat/barber-atelier-experience` and documentation was started there to avoid disrupting the user's preferred preview branch.
8. No new database schema, auth integration, storage bucket, Edge Function, real booking workflow, or deployment was implemented during this audit.

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
3. Record which runtime/build stack is actually present before choosing an app architecture.
4. Audit the preferred preview's video/image URLs and establish a stable media strategy without breaking the current site.
5. Draft the salon domain ERD, RLS/Storage policies and booking concurrency contract.
6. Implement the first schema migration in the new `Menuun_Site` project only, after reviewing exact SQL and grants. Do not touch `ublxptcqefujkbeepylc`.
7. Add automated tests and responsive Arabic/English browser checks before declaring a phase complete.
8. Do not deploy until the code and configuration are verified; report the real URL/state and evidence.

## Status vocabulary

- `DISCOVERY_VERIFIED`: source inspection or tool output proves the fact.
- `IMPLEMENTATION_IN_PROGRESS`: code/schema changes are underway.
- `VERIFIED_LOCALLY`: actual local checks passed and are recorded.
- `PUSHED`: changes are in GitHub.
- `DEPLOYED`: direct Vercel evidence plus URL verification exists.
- `BLOCKED`: dependency/permission/runtime limitation is named explicitly.

Current overall state: `DISCOVERY_VERIFIED / IMPLEMENTATION_NOT_STARTED`.
