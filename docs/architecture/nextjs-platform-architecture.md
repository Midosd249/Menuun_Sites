# Menuun Platform Architecture

**Status:** Proposed target architecture; the current commit migrates the public app to Next.js only.  
**Last reviewed:** 2026-10-13

## 1. Product boundaries

Menuun is an independent multi-tenant SaaS for appointment-led businesses, beginning with salons and barbershops. It is not a restaurant menu/order clone. The product has four surfaces:

1. **Marketing site** — explain the product, demonstrate value, and route users honestly.
2. **Public business site** — tenant-branded service catalogue, team, branch details, and appointment request flow reachable through a stable slug and QR.
3. **Business workspace** — manage branches, services, staff, hours, appointment requests, media, templates, publication and settings.
4. **Platform operations** — support and lifecycle operations with explicit, audited privileged access.

## 2. Current stack and status

- Next.js App Router + React + TypeScript.
- Vercel as application hosting, not durable storage.
- Existing Supabase project is a candidate for Postgres/Auth/Storage, but migration history and branch divergence must be reconciled before any schema or auth changes.
- Existing Atelier 09 HTML and owner area are preserved as static assets during migration.
- AI is not required for core booking, authorization, pricing, scheduling, or tenant access.

## 3. Route map

### Implemented in this milestone
- `/` — public marketing page.
- `/login`, `/signup` — explicitly staged screens; no account is created.
- `/robots.txt`, `/sitemap.xml` — basic search discovery.
- `/owner/` and `/templates/atelier-09/` — compatibility paths intended to serve the preserved HTML assets through Next rewrites.

### Planned; not implemented or claimed
- `/s/[tenantSlug]` — public business website.
- `/s/[tenantSlug]/book` — customer booking journey.
- `/app` — authenticated workspace chooser/onboarding.
- `/app/[businessSlug]/overview`, `/appointments`, `/services`, `/team`, `/branches`, `/site`, `/media`, `/settings`.
- `/platform-admin` — platform operations, separately authorized.
- Same-origin route handlers/server actions for validated mutations.

## 4. Domain model (proposal, not a migration)

- `profiles`: app-level profile keyed to the verified auth user.
- `businesses`: tenant root, unique stable slug, lifecycle state and timezone.
- `business_members`: user-to-business membership and role; unique (business_id, user_id).
- `branches`: business-owned location, timezone/working hours, contact and publication state.
- `services`: business-owned service, duration, buffer, price/currency, visibility and sort order.
- `staff`: business-owned service provider, active state and public profile.
- `staff_services`: explicit staff/service eligibility join.
- `business_hours`, `staff_hours`, `time_off`: normalized availability rules and exceptions.
- `appointments`: branch/service/staff/customer, start/end instants, business timezone context, lifecycle state and idempotency key.
- `business_sites`: published template key, validated settings/content and publication version.
- `media_assets`: tenant-scoped object key, content type, size, ownership and moderation state.
- `audit_events`: append-only security and high-impact administrative events.

Required indexes/constraints include unique normalized business slugs, foreign keys that preserve tenant ownership, positive service duration, valid appointment intervals, idempotency uniqueness, and overlap prevention at the database transaction/constraint layer. Final schema requires a separate reviewed migration.

## 5. Authorization and tenant isolation

- Resolve identity from a server-verified session on every protected request.
- Resolve business access from `business_members`; never trust client-provided user IDs, roles, tenant IDs, branch IDs, slugs, or redirect targets.
- Enforce tenant isolation both in server authorization and database RLS policies.
- Use the public/publishable Supabase key for user-scoped SSR clients. Never expose a service-role key via `NEXT_PUBLIC_*`, client components, logs, screenshots, or repository files.
- If privileged server-only operations genuinely need service-role access, isolate them behind a narrowly scoped module marked `server-only`, validate every input, and audit the action.
- Protect against cross-tenant foreign-key writes using tenant-aware constraints and RLS `WITH CHECK` policies.
- Test direct server action/route invocation, not only whether the UI hides a link.

## 6. Authentication decision gate

Before implementing auth:
1. Inspect the live Supabase project and all migration files across relevant branches.
2. Reconcile the conflicting/legacy project continuity notes and identify which migrations are already applied.
3. Review official Supabase SSR guidance and the selected Next.js version's current server/proxy behavior.
4. Decide the session/auth provider explicitly. Do not blindly port Menu V3's Better Auth implementation into this Next.js application.
5. Configure redirect allowlists, email delivery, cookie security, recovery flows, rate limits, and session revocation.
6. Write tests for anonymous access, invalid/expired sessions, cross-tenant access, role changes and direct endpoint invocation before enabling signup.

## 7. Booking correctness

- Treat browser availability as a hint; re-check at write time on the server/database.
- Compute availability using business timezone, service duration, buffer, staff eligibility, opening hours, time off, existing appointments and booking lead-time rules.
- Store timestamps as timezone-aware instants; store the business IANA timezone separately.
- Use a transaction and database-level overlap protection to prevent double booking under concurrent requests.
- Use explicit states such as requested, confirmed, declined, cancelled, completed and no_show; define allowed transitions in deterministic code.
- Require idempotency for booking submission and never report success before durable commit.
- Avoid exposing customer lists, private appointment data, staff schedules or internal identifiers through public endpoints.

## 8. Template contract

Each template should implement a versioned, typed contract for:
- design tokens and allowed brand overrides;
- public sections and content schema;
- service/staff/media data inputs;
- supported RTL/LTR behavior;
- booking CTA destinations;
- metadata/SEO and accessible image descriptions;
- preview/publish compatibility and a stable template version.

Do not store executable arbitrary HTML from tenant settings. Validate structured content server-side and render through trusted components. Keep Atelier 09 as a reference/template candidate until its data contract and interactions are extracted and tested.

## 9. AI integration boundary

The AI Agent Foundation is an operating contract, not a reason to add AI to every feature. If later features need AI, add one internal gateway/provider-adapter boundary with server-only credentials, capability allowlists, timeouts, bounded retries, normalized errors, structured-output validation, explicit degraded behavior and privacy-minimized telemetry. AI may suggest copy or classify content; deterministic code must authorize actions and validate business rules. Retrieved webpages and model output are untrusted data.

## 10. Quality gates

- Node 22 CI: unit/contract tests, TypeScript typecheck, production build and static asset checks.
- Browser QA: desktop/tablet/mobile; Arabic RTL and English LTR; keyboard-only; focus; reduced motion; console/network errors; public routes.
- Accessibility: semantic landmarks, labels, contrast, visible focus, touch targets, reduced motion and sensible heading order.
- SEO: unique titles/descriptions, canonical base URL, Open Graph, sitemap, robots, stable tenant slugs and no accidental indexing of private workspaces.
- Security: secret scan, server/client boundary, authorization tests, tenant isolation, validated inputs, safe redirects and no fake successful actions.
- Release: inspect the full diff, check CI, verify Vercel quota, deploy one coherent preview batch, record real evidence; production/domain changes require explicit approval.

## 11. Rollback

- The migration is additive and keeps `src/`, `index.html`, `owner/`, `templates/` and existing media source files intact.
- Roll back application routing by reverting the Next.js migration commit, not by modifying the reference repository or database.
- No database schema, Auth configuration, Storage policy, production domain, or production deployment is changed by this milestone.
