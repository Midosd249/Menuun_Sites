# Project State — Menuun Sites

**Updated:** 2026-10-12  
**Implementation status:** IMPLEMENTATION_IN_PROGRESS — source tests/build verified in GitHub Actions; Vercel preview blocked by daily API quota  
**Active branch:** `feat/public-platform-foundation`

## Current milestone
Phase 1 — Public marketing website.

## Verified
- The former root `index.html` salon-template page was preserved at `templates/atelier-09/index.html`.
- The root entry now uses a React + TypeScript + Vite app shell.
- The new public app includes Arabic RTL default, English LTR switch, responsive marketing sections, and staged login/signup routes that explicitly state auth is not implemented yet.
- The roadmap and research log document the planned phases and current unknowns.
- Refero connector calls were blocked by `NO_SUBSCRIPTION`; no Refero screens or styles were inspected.

## Unknown / pending verification
- **VERIFIED by GitHub Actions run 38305351474:** `npm test` and `npm run build` passed on Node 22; existing inline-JS/assets and Supabase config checks also passed.
- **BLOCKED:** Vercel API returned HTTP 402 (`api-deployments-free-per-day`, >100 deployments, retry after 24 hours). A fresh preview build cannot be verified until the quota resets or the team resolves the plan limit.
- Domain `www.menuun.com` linkage is unknown.
- Durable database integration and production authentication are not implemented.
- No browser screenshots or end-to-end account flow have been verified.

## Files introduced/updated
- `AGENTS.md`
- `README.md`
- `docs/roadmap/public-platform-foundation.md`
- `docs/design-research-log.md`
- `package.json`, `tsconfig.json`, `vercel.json`
- `index.html`
- `src/main.tsx`, `src/App.tsx`, `src/styles.css`
- `tests/public-site-contract.test.mjs`
- `templates/atelier-09/index.html`

## Exactly one next task
After the Vercel deployment API limit resets, deploy the current PR head as a preview and verify public routing, asset preservation, and mobile/RTL/LTR rendering without promoting it to production.
