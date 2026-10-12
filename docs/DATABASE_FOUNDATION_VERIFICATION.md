# Database Foundation Verification — 2026-10-12

## Applied migrations

Project: `Menuun_Site` / `kphypflbkbcvgcaupxxm`

- `20261012181200 salon_foundation` — applied; 12 core tables, tenant membership, service/barber data, business hours, appointments, event log, media metadata, draft/published site content, revisions and notifications.
- `20261012181421 security_hardening` — applied; private authorization helpers, public RPC wrappers with invoker privileges, explicit public-vs-authenticated read policies, foreign-key indexes.
- `20261012181456 policy_cleanup` — applied; split manager write policies from public read policies to avoid redundant permissive SELECT policies.

Source migration files are stored in `supabase/migrations/` with filenames aligned to the migration versions returned by Supabase. The SQL was first executed inside a transaction followed by ROLLBACK to check syntax/DDL viability, then applied using the Supabase migration operation.

## Database structure

All 12 application tables are in `public`, and RLS is enabled on every one:
`salons`, `salon_members`, `services`, `barbers`, `barber_services`, `business_hours`, `appointments`, `appointment_events`, `media_assets`, `site_settings`, `site_revisions`, `notifications`.

Internal authorization and privileged routines are in `private`; public RPC wrappers for owner onboarding and publish remain invoker-security functions. The overlap exclusion constraint `appointments_no_active_overlap` prevents overlapping pending/confirmed/reschedule-requested appointments for the same barber within a salon. Appointment status transitions are constrained in a trigger, and status changes are written to `appointment_events`.

## Verification results

- VERIFIED: Supabase migration history reports all three migrations applied in order.
- VERIFIED: table listing reports all 12 tables and `rls_enabled: true`; all are empty (zero rows).
- VERIFIED: security advisor returned no lint findings after hardening.
- VERIFIED: performance advisor no longer reports unindexed foreign keys, auth initplan warnings, or multiple permissive SELECT policies. It still reports 20 informational unused-index notices because the application tables are empty and have not served real workloads; retain/reevaluate indexes after realistic usage rather than deleting them blindly.
- NOT RUN: live authenticated onboarding, owner/member cross-tenant negative tests, appointment insert/concurrency test, Storage upload tests, and browser tests. These require a controlled test user/data harness and are mandatory before production use.
- NOT DONE: Storage bucket/policies, Auth UI, real public booking RPC, owner dashboard, platform admin UI, site template data binding, QR flow, deployment.

## Important schema naming clarification

The Menu V3 repository migration runner uses `menu_v3` (lowercase with underscore), not `schema_V3`. The new Menuun Site project currently uses the default `public` schema for its API-facing domain tables and a non-exposed `private` schema for authorization helpers. This is intentional and independent; do not create a `schema_V3` schema or reuse Menu V3 tables unless a future reviewed decision requires it.
