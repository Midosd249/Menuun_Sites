# Menuun — Appointment Business Platform

Menuun is an Arabic-first, bilingual SaaS platform for salons, barbershops and other appointment-led service businesses. The product direction is a coherent public marketing site, tenant-branded public business websites, an authenticated business workspace and a separately authorized platform operations surface.

## Active stack

- Next.js App Router
- React + TypeScript
- Vercel hosting
- Existing Supabase project is a candidate for persistence/auth after the migration history and security model are reconciled
- Arabic RTL by default; English LTR is a first-class path

## Current milestone

**Phase 1 — Next.js public-platform foundation.** The existing marketing experience is carried into the App Router. `/login` and `/signup` remain honest staged screens; this commit does not implement authentication or create accounts. The owner workspace and Atelier 09 HTML template are preserved as static assets and copied into Next.js `public/` at build time.

## Local commands

- `npm install`
- `npm run dev`
- `npm test`
- `npm run typecheck`
- `npm run build`
- `npm start`

## Engineering boundaries

- Use Next.js server rendering/metadata where it improves SEO and public routing; keep client components only for actual interaction.
- Use Menu V3 as a read-only reference for auth, authorization, tenant isolation, test and release principles. Never copy its restaurant order/cart/payment domain into appointment scheduling.
- Use AI Agent Foundation as a workflow/security contract, not a reason to add AI to deterministic business operations.
- Do not enable account creation before the auth provider, durable persistence, RLS, tenant authorization, email delivery, rate limits and recovery paths are verified.
- Never trust client-provided user, business, branch, role or entitlement identifiers.
- Do not expose service-role credentials or provider secrets in client code.
- Preserve legacy business data and the Atelier 09 template unless a reviewed migration and rollback plan says otherwise.
- No feature, browser result or deployment is considered verified without evidence.

## Project continuity and architecture

- `AGENTS.md` — operating and engineering contract
- `PROJECT_STATE.md` — current verified state and blockers
- `PLAN.md` / `TASKS.md` — active milestone and acceptance criteria
- `SESSION_PROTOCOL.md` / `docs/SESSION_HANDOFF.md` — how to resume in a new conversation
- `docs/architecture/nextjs-platform-architecture.md` — route, tenant, auth, booking, template and AI boundary decisions
- `docs/repository-audit.md` — review of the target and adjacent repositories
- `docs/roadmap/public-platform-foundation.md` — phased delivery plan
- `docs/design-research-log.md` — evidence and visual reference limitations
- `docs/MASTER_PLAN_MENUUN_SITE.md` and `docs/SESSION_CONTINUITY.md` — legacy continuity notes; reconcile their branch/database statements against live evidence before any database operation

## Release safety

Vercel deployment API previously returned HTTP 402 for a daily deployment quota. Do not retry deployment attempts until the quota is rechecked. Do not merge the active draft PR, change the production domain, modify Vercel settings, or apply database migrations without explicit authorization and verified checks.


## Supabase SSR authentication foundation — Phase 2 in progress

This branch adds the SSR client/session foundation only. The login and signup screens remain staged; no account creation is enabled, and a valid identity is **not** yet proof of business membership or tenant authorization.

### Local configuration

1. Copy `.env.example` to `.env.local`.
2. In the Supabase dashboard, open **Project Settings → API Keys** and copy the project URL and **publishable** key (or the legacy anon key only if the project has not moved to publishable keys).
3. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` in `.env.local`. Never use a secret/service-role key in either variable.
4. Restart the local Next.js server after editing environment variables.
5. Keep the real `.env.local` out of Git; only the empty example belongs in the repository.

### Hosting and Supabase dashboard steps — manual, not performed by this change

- Add the same two public values to the Vercel project's **Preview** environment first. Add them to Production only after the auth configuration and release review are approved.
- In Supabase **Authentication → URL Configuration**, set the Site URL to the intended canonical origin and add exact local/preview callback URLs to Redirect URLs. Avoid broad wildcard patterns in production.
- Before enabling public signup, separately verify email delivery, recovery templates, rate limits, redirect allowlists, leaked-password protection, and session revocation. The live project's leaked-password protection was reported disabled during the read-only audit.
- Do not enable signup yet. The UI flow, email lifecycle, business membership checks, RLS validation, and production browser tests are not complete.

### Current security behavior

- Browser and request-scoped server clients use only the public URL and publishable key.
- `middleware.ts` refreshes/validates Supabase claims and avoids shared caching of refreshed-session responses.
- `/owner`, `/app`, and `/platform-admin` fail closed when identity cannot be verified; public marketing, login, and signup routes remain reachable.
- `getVerifiedClaims()` validates identity with `auth.getClaims()`; it intentionally does not treat `getSession()` as proof of identity.
- Auth callback and sign-out redirects are restricted to local same-origin paths.
- **Not yet implemented:** login/signup form integration, verified business membership/role checks, tenant provisioning, RLS integration tests, real email delivery/recovery tests, browser E2E, and production enablement.
