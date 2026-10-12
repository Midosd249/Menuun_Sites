# Database Foundation Verification — 2026-10-12

## Applied migrations

Project: `Menuun_Site` / `kphypflbkbcvgcaupxxm`

- `20261012181200 salon_foundation` — applied; 12 core tables, tenant membership, service/barber data, business hours, appointments, event log, media metadata, draft/published site content, revisions and notifications.
- `20261012181421 security_hardening` — applied; private authorization helpers, public RPC wrappers with invoker privileges, explicit public-vs-authenticated read policies, foreign-key indexes.
- `20261012181456 policy_cleanup` — applied; split manager write policies from public read policies to avoid redundant permissive SELECT policies.
- `20261012184720 booking_and_media` — applied; creates a private `salon-media` Storage bucket (100 MiB max; JPEG/PNG/WebP/AVIF/MP4/WebM allowlist), manager/member policies scoped to the first salon-id folder, and the `public.request_salon_appointment` invoker-security RPC. Privileged booking logic lives in `private.request_salon_appointment_internal`.

Source migration files are stored in `supabase/migrations/` with filenames aligned to the migration versions returned by Supabase. The SQL was first executed inside a transaction followed by ROLLBACK to check syntax/DDL viability, then applied using the Supabase migration operation.

## Database structure

All 12 application tables are in `public`, and RLS is enabled on every one:
`salons`, `salon_members`, `services`, `barbers`, `barber_services`, `business_hours`, `appointments`, `appointment_events`, `media_assets`, `site_settings`, `site_revisions`, `notifications`.

Internal authorization and privileged routines are in `private`; public RPC wrappers for owner onboarding and publish remain invoker-security functions. The overlap exclusion constraint `appointments_no_active_overlap` prevents overlapping pending/confirmed/reschedule-requested appointments for the same barber within a salon. Appointment status transitions are constrained in a trigger, and status changes are written to `appointment_events`.

## Verification results

- VERIFIED: Supabase migration history reports all four migrations applied in order.
- VERIFIED: table listing reports all 12 tables and `rls_enabled: true`; all are empty (zero rows).
- VERIFIED: security advisor returned no lint findings after hardening.
- VERIFIED: performance advisor no longer reports unindexed foreign keys, auth initplan warnings, or multiple permissive SELECT policies. It still reports 20 informational unused-index notices because the application tables are empty and have not served real workloads; retain/reevaluate indexes after realistic usage rather than deleting them blindly.
- VERIFIED: transactional SQL smoke test passed for the owner-onboarding RPC, service/barber creation, active-appointment overlap rejection, status transition rules and appointment event log. The test ran inside a transaction and rolled back.
- VERIFIED: booking/media smoke test passed in a rollback-only transaction: private bucket configuration and upload policy exist; the public booking RPC creates a pending appointment with database-derived price/duration snapshots, logs the creation event and owner notification, rejects overlapping requests and rejects an unknown service. All test rows/users were rolled back.
- VERIFIED: security advisor returned zero findings after migration 004. Performance advisor reports 16 informational unused-index notices while tables remain empty.
- VERIFIED: transactional RLS isolation test passed using two temporary Auth users under the `authenticated` role; each user could read its own salon but could not read the other salon or its services. Temporary users/data were rolled back; post-test checks returned zero test rows.
- NOT RUN: real GoTrue signup/email-confirmation/session flow, actual Storage upload attempts under authenticated salon memberships, browser-based owner interactions, and mobile browser QA.
- NOT DONE: wiring the public website booking wizard to the RPC/live availability, signed-media URL delivery, media editor, published-template data binding, QR flow, platform admin UI. The initial owner workspace UI exists and is preview-deployed; its browser/auth interactions are not yet verified.

## Important schema naming clarification

The Menu V3 repository migration runner uses `menu_v3` (lowercase with underscore), not `schema_V3`. The new Menuun Site project currently uses the default `public` schema for its API-facing domain tables and a non-exposed `private` schema for authorization helpers. This is intentional and independent; do not create a `schema_V3` schema or reuse Menu V3 tables unless a future reviewed decision requires it.
