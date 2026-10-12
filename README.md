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
