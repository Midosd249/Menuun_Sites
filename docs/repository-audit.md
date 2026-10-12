# Repository Audit — Menuun Ecosystem

**Audit date:** 2026-10-13  
**Scope:** repositories discoverable through the connected GitHub account and public owner-repository listing. This is a scoped engineering audit, not a claim to have inspected every repository on GitHub.

## Executive verdict

Use `Menuun_Sites` as the single application repository, `ai-agent-foundation` as the workflow/security contract, and `Menu_V3` as a read-only engineering reference. Review `Demo_Site` later for website-builder and SEO workflows. Use `Menu-V2-Sandbox` only for narrowly relevant tenant-routing lessons after review. Do not merge repositories or blindly copy their domain logic.

## 1. `Midosd249/Menuun_Sites` — primary target

**Status: VERIFIED.** Active branch is `feat/public-platform-foundation`; draft PR #5 is open.

Reviewed:
- `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, `README.md`.
- `package.json`, `tsconfig.json`, `vercel.json`, CI workflow.
- `src/App.tsx`, `src/styles.css`, `tests/public-site-contract.test.mjs`, `scripts/copy-static.mjs`.
- `docs/roadmap/public-platform-foundation.md`, `docs/design-research-log.md`, `docs/MASTER_PLAN_MENUUN_SITE.md`, `docs/SESSION_CONTINUITY.md`.
- Existing `owner/`, `templates/atelier-09/`, and `public/assets/` path inventory from the Git tree.

Findings:
- The marketing site is a React/TypeScript/Vite SPA with an Arabic-first RTL experience and English LTR toggle.
- Account pages are deliberately staged; authentication is not implemented in this active app surface.
- Owner and Atelier 09 HTML must remain accessible.
- The repo contains older project continuity documents that describe another branch's Supabase migration history. Treat them as important evidence but reconcile the active branch and live database before any schema change.
- Vercel configuration previously targeted `dist`, which is incompatible with a normal Next.js deployment unless changed.

## 2. `Midosd249/ai-agent-foundation` — process and security reference

**Status: VERIFIED.** Reviewed `AGENTS.md`, `README.md`, and `docs/AI_SECURITY.md`.

Transfer:
- Keep deterministic business rules and authorization in code.
- Treat prompts, retrieved content and model outputs as untrusted data.
- Keep provider credentials server-side; validate structured outputs; bound timeouts/retries; define safe failure behavior.
- Use a single provider gateway only if Menuun gains a genuine AI use case.
- Route only the relevant specialist workflows; don't activate every agent for every task.

Do not:
- Add AI dependencies just to appear agentic.
- Let an agent/model approve permissions, bookings, pricing or tenant ownership.
- Copy the foundation as a runtime subsystem without a concrete feature requirement.

A requested `docs/automatic-specialist-routing.md` path was not found in this repository; the README and security contract were inspected instead.

## 3. `Midosd249/Menu_V3` — read-only engineering reference

**Status: VERIFIED.** Reviewed `AGENTS.md`, `package.json`, `docs/automatic-specialist-routing.md`, `src/lib/auth/server.ts`, and `src/lib/auth/client.ts`.

Transfer:
- Release-only Vercel workflow; local checks and browser QA before one coherent deployment.
- Strong server-side authorization, explicit auth invariants, tenant isolation and evidence-based status labels.
- Focused tests and regression checks.
- Keep the public menu, owner workspace and platform administration separate.

Do not:
- Copy restaurant orders, carts, payments or menu-specific schema into appointment scheduling.
- Port Better Auth wholesale: this target is moving to Next.js and the auth choice must be made after current Supabase migration state and official SSR docs are reconciled.
- Modify the Menu V3 repository or its live database as part of this project.

## 4. `Midosd249/Demo_Site` — adjacent website-growth product

**Status: VERIFIED.** Reviewed `README.md` and `AGENTS.md`.

Potential future value:
- Section-based website builder workflows, SEO/local visibility/AI-readiness audits, client reports and strict handling of unavailable evidence.
- Saudi/GCC SMB product framing and Arabic-first RTL requirements.

Boundary:
- It is a separate product with a different architecture and mission. No code was copied. Revisit only when Menuun reaches website editing/publishing or SEO-audit phases, and inspect its current implementation/tests before reusing any pattern.

## 5. `Midosd249/Menu-V2-Sandbox` — QR menu sandbox

**Status: VERIFIED.** Reviewed `README.md` and `package.json`.

Potential future value:
- Examples of tenant/branch URL selection and browser-safe public Supabase reads.

Boundary:
- Restaurant/cafe menu domain differs from salon scheduling. Reuse only general lessons after auditing the exact implementation, RLS policies and failure behavior. Do not copy menu/product/order models.

## 6. Other owner repositories

- `Midosd249/DIM` and `Midosd249/dim_menue`: **VERIFIED empty** at audit time; no source files to reuse.
- `Midosd249/portfolio-Architect-Urban-Planner-Sulafa-Ahmed-`: public HTML portfolio, unrelated to Menuun's product architecture.
- `Midosd249/Demo_Site` and `Midosd249/Menu-V2-Sandbox` are the only additional code-bearing public owner repositories found that appear adjacent enough to note. The public owner listing does not reveal private repositories; the connected GitHub installation search surfaced `Menu_V3` and `ai-agent-foundation` as relevant private references.

## 7. External research and design-reference limitations

- Next.js migration / App Router guidance: [Vercel migration skills](https://github.com/vercel-labs/migration-skills) and [Next.js documentation](https://nextjs.org/docs).
- Supabase server-side auth guidance: [Supabase Next.js SSR guide](https://supabase.com/docs/guides/auth/server-side/nextjs) and [Supabase Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security).
- Exa search was used to discover migration and Supabase SSR guidance; official docs take precedence over third-party blog posts.
- Refero searches were attempted for visual styles and salon booking/dashboard patterns, but the connector returned `NO_SUBSCRIPTION`. **No Refero screenshots or styles were inspected.** Do not label the current visual system Refero-validated until access is restored and references are actually reviewed.

## 8. Reuse matrix

| Area | Best source | Decision |
|---|---|---|
| Agent operating rules and AI safety | `ai-agent-foundation` | Reuse as process contract; keep AI out of core authorization |
| Auth/tenant isolation/testing/release discipline | `Menu_V3` | Reuse principles; adapt implementation to Next.js and appointment domain |
| Business site builder and SEO audit | `Demo_Site` | Revisit in a later phase; no code copied |
| QR tenant/branch selection | `Menu-V2-Sandbox` | Revisit after RLS/security review |
| Public marketing and product domain | `Menuun_Sites` | Source of truth |
| Visual references | Refero | Blocked by subscription; use no claims of direct reference review |

## 9. Audit gaps

- No live browser session/screenshots were available during this repository inspection.
- No full code-level audit was performed on every file in the adjacent repositories; inspection was targeted to mission, architecture, package and security entry points.
- Vercel's previous daily deployment API quota block must be rechecked before preview work.
- Supabase schema/migration status must be reconciled across branches and the live project before changing auth or data.
