# Project State — Menuun Sites

**Updated:** 2026-10-12  
**Implementation status:** IMPLEMENTATION_IN_PROGRESS  
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
- Local dependency installation, TypeScript check, tests, and production build have not yet been executed in this remote-only edit session.
- Vercel build result and live preview have not yet been verified for this branch.
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
Verify the new public app build/tests and Vercel branch deployment; fix only failures within the public-site milestone.
