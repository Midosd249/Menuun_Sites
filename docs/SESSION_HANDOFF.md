# Menuun — Session Handoff

**Updated:** 2026-10-13  
**Purpose:** Resume work accurately from any new chat. Repository state is authoritative; chat history is not.

## Canonical context

- Repository: `Midosd249/Menuun_Sites`
- Active branch: `feat/public-platform-foundation`
- Open draft PR: [#5](https://github.com/Midosd249/Menuun_Sites/pull/5)
- Product: Arabic-first, bilingual SaaS for salons, barbershops, and appointment-led service businesses.
- Desired public domain: `www.menuun.com` (domain linkage remains unverified).
- Reference repositories: `Midosd249/ai-agent-foundation` and `Midosd249/Menu_V3`; read-only references, do not modify them.
- Supabase project ref known from prior repository context: `kphypflbkbcvgcaupxxm`. Do not apply migrations or change Auth/Storage settings without a separately reviewed migration plan.
- Vercel project: `menuun-sites`. A previous deployment API attempt returned HTTP 402 for the daily deployment quota. Do not retry deployments until the quota status is rechecked.

## Required startup sequence

1. Read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`.
2. Read this file, `docs/architecture/nextjs-platform-architecture.md`, `docs/repository-audit.md`, `docs/roadmap/public-platform-foundation.md`, and `docs/design-research-log.md`.
3. Check the current branch head and PR #5 before editing; this handoff may lag the actual repository.
4. Inspect the current GitHub Actions run for the latest commit. Never infer build success from a commit alone.
5. Verify Vercel deployment quota/status before considering preview work. No production deploy, domain mutation, paid resource creation, or database migration without explicit authorization.

## Current implementation boundary

- The active code path is Next.js App Router with React and TypeScript.
- The public marketing page remains Arabic RTL by default and supports English LTR.
- `/login` and `/signup` are intentionally staged screens. No real authentication is implemented by this migration.
- The existing `owner/` and `templates/atelier-09/` HTML experiences must remain reachable through Next.js public assets and rewrites.
- SEO metadata, robots, and sitemap are foundational; the custom domain itself is not verified.
- No tenant booking API, protected workspace, production auth, or live AI gateway is claimed by this milestone.

## Immediate next task

Run and inspect GitHub Actions for the current branch. Fix any typecheck/build/test failures in a focused commit. Once CI passes, verify the Vercel quota and preview routing (root, login, signup, owner, template) and run browser QA at mobile/tablet/desktop for Arabic RTL and English LTR. Do not merge PR #5 until these acceptance checks are evidenced.

## Decision discipline

- Facts use `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, or `BLOCKED`.
- Preserve `templates/atelier-09/index.html`, owner workspace, media assets, and legacy context.
- Never copy Menu V3's restaurant order/cart/payment schema into salon scheduling.
- Before real authentication, reconcile the existing Supabase migration history across branches; choose Supabase SSR or another server-side auth stack only after reviewing the current project's state and official docs.
- Every behavior change gets tests; all external AI output is untrusted data; deterministic code enforces permissions.
