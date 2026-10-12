# Menuun — Public Platform

Menuun is being rebuilt as a professional Arabic-first, bilingual SaaS platform for appointment-led service businesses. This repository will contain the public marketing site, account flows, customer workspace, and reusable business templates as a cohesive application.

## Current milestone
**Phase 1 — Public marketing website**  
The root page uses React + TypeScript + Vite. Arabic RTL is the default; English LTR is supported. The sign-in and sign-up destinations are intentionally honest staged screens until secure server-side authentication is implemented.

The previous Atelier 09 salon page has been preserved at `templates/atelier-09/index.html` as the first template candidate. The existing `owner/` area remains unchanged during this milestone.

## Local development
- `npm install`
- `npm run dev`
- `npm test`
- `npm run build`
- `npm run preview`

## Architecture decisions
- Use Menu V3 as an architectural reference, not a literal code copy.
- Authentication must be server-side and same-origin.
- A durable database is required before production account creation; Vercel function memory/filesystem is not persistent account storage.
- Tenant membership, roles, booking availability, and appointment writes must be enforced server-side.
- Keep salon scheduling distinct from restaurant menu/order logic.
- Do not claim a feature or deployment is working without verification evidence.

## Project documentation
- [Public platform roadmap](docs/roadmap/public-platform-foundation.md)
- [Design research log](docs/design-research-log.md)
- [Agent operating contract](AGENTS.md)

## Current status
Implementation is in progress on `feat/public-platform-foundation`. The public marketing site is the only authorized product surface in this phase. Authentication, customer workspace, template publishing, scheduling persistence, data migration, and production domain changes are later phases.
