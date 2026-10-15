# Owner Workspace — Implementation Notes

Updated: 2026-10-12

## Preview

Current branch: `feat/menuun-site-platform-foundation`  
Stable branch preview for the current branch: `https://menuun-sites-git-feat-menuun-site-plat-982423-midosd2s-projects.vercel.app/owner/`

The root route remains the existing ATELIER 09 salon page. The owner UI is isolated under `owner/index.html`; the existing `index.html` was not rewritten in this change. `.vercelignore` keeps internal documentation, SQL migrations, SQL tests and helper scripts out of the static deployment output.

## Implemented UI paths

- Sign in / create account using Supabase Auth client.
- Onboarding: create a salon via `public.create_salon_with_owner` (atomic salon + owner membership + site settings).
- Workspace selection for salons the signed-in user is an active member of.
- Overview cards for pending appointments, today's appointments, active services and active barbers.
- Appointment inbox, status filtering, name/phone search, confirm/cancel/complete/no-show actions.
- Add services with Arabic/English names, price and duration.
- Add barbers with display name and optional Arabic bio.
- Edit core salon details: name, phone, WhatsApp, address, city and time zone.
- Arabic RTL / English LTR toggle and responsive layout with mobile navigation.
- Error notices and action feedback; customer/appointment records are read from Supabase rather than localStorage.

## Explicitly not implemented yet

- Public booking wizard integration with the database RPC and live availability. The database endpoint `public.request_salon_appointment` now exists and has passed a rollback-only SQL smoke test, but the root template still uses its demo booking behavior.
- Dynamic binding of the root ATELIER 09 template to a published salon record.
- Media upload/editor UI, signed-URL delivery and gallery management. The private `salon-media` bucket and tenant-scoped Storage policies now exist in Supabase, but authenticated upload flows have not been browser-tested.
- Public QR creation and stable public salon route.
- Customer notifications / reply channel.
- Platform administrator console, team invitation UI, subscription/billing.
- Browser-based E2E tests or physical-device visual QA.

The UI intentionally does not claim that booking, media upload, QR or publishing is ready. A database-side public booking RPC now validates salon publication state, service/barber ownership, business hours and time horizon; database exclusion constraints reject overlaps, and successful requests create an appointment event and owner notifications. The website wizard is not wired to the RPC yet.

## Configuration

`owner/config.js` contains the Supabase project URL and the **publishable browser key** supplied by the owner. A publishable key is expected to be visible in a browser and is not a service-role key. Never place a service-role key, database password or other secret in this file.

The static page imports a pinned Supabase JS v2 client from `esm.sh`. This is a deliberate low-infrastructure first slice because the inspected repository has no package manifest or build system. Before expanding to a larger app, evaluate moving to a package-managed TypeScript build while preserving the root salon page as the first template.

## Branding update\n\n- Copied the official Menuun SVG logo variants (transparent, English, Arabic, monochrome) from `Midosd249/Menu_V3` into `assets/brand/menuun/` in this repository. The source repository was not modified.\n- The owner workspace header now uses `../assets/brand/menuun/menuun-logo.svg`; the public ATELIER 09 salon identity remains separate from the Menuun platform brand.\n\n## Verification

- GitHub Actions `Static Quality` run for commit `0ec0a02c8c3070bbc80391df938e38f31d8fcb12`: SUCCESS. It checked inline JavaScript syntax and expected local assets, and parsed `owner/config.js`.
- Vercel preview checks returned HTTP 200 for root `/`, `/owner/`, and `/owner/config.js`.
- Vercel checks returned HTTP 404 for `/supabase/migrations/20261012181200_salon_foundation.sql` and `/docs/MASTER_PLAN_MENUUN_SITE.md` after `.vercelignore`.
- The root page still references the established hero MP4; the MP4 and poster source URLs returned HTTP 200 and correct file signatures.
- SQL tests are documented in `docs/DATABASE_FOUNDATION_VERIFICATION.md`.
- No Playwright/browser session was available, so HTTP checks and syntax checks must not be described as browser E2E or visual QA.
