# Menuun Sites

**A standalone website platform in the Menuun ecosystem.** This repository is intentionally separate from Menu V3 and is the home for customer websites, templates, editing, previews, and publishing.

> **Current state: interactive prototype, not a production website builder.** The current branch contains a bilingual Arabic RTL / English LTR barber-site demo and a simulated guided booking journey. Authentication, tenant-scoped persistence, editing, real booking integrations, publishing, customer domains, and Menu V3 integration are not implemented.

## Product boundary

- **Menu V3** continues to own existing digital-menu workflows and production data.
- **Menuun Sites** will own website editing, templates, assets, domains, drafts, publication snapshots, and site rendering.
- Integration will use explicit, versioned server-to-server contracts. Do not connect directly to Menu V3's database or copy private modules as a shortcut.
- Customer websites are intended to use Menuun-controlled subdomains first. Custom domains come later after ownership verification and lifecycle handling are implemented.

## Current prototype

The first vertical slice is a fictional barbershop concept named **سِمت / SIMT Barber House**. It includes:
- Arabic-first layout with a separate English LTR presentation;
- responsive hero, services/prices, barber profiles, gallery, location/hours, FAQ, and footer;
- a guided booking demo with service, barber, example date/time, and contact-detail steps;
- an explicit demo disclaimer: no appointment is created, no message is sent, and submitted details are not stored.

All business details, prices, team names, portraits, location, and hours are illustrative placeholders. Replace them with client-approved content before any real customer launch. The current photos load from Unsplash-hosted URLs; local optimized assets and a recorded asset manifest remain production follow-ups.

## Engineering method

This project adopts the workflow from [AI Agent Foundation](https://github.com/Midosd249/ai-agent-foundation), tailored for a production website platform:
- mandatory project-state review and durable handoff;
- focused branches and small, reviewable pull requests;
- evidence-based research and current official documentation;
- test-driven implementation and explicit acceptance criteria;
- security, tenant isolation, secret scanning, and release gates;
- licensed assets, Arabic RTL + English LTR, responsive QA, and Playwright browser testing;
- exact commit and deployment verification—CI passing alone is not proof of production deployment.

Read [AGENTS.md](AGENTS.md) before changing code.

## Local development

Requirements: Node.js 20+ (Node 20.9+ recommended).

```bash
npm install
npm run dev
```

Available checks:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install --with-deps chromium
npm run test:e2e
```

The CI workflow runs secret scanning, project-contract checks, lint, TypeScript checks, unit tests, production build, and desktop/mobile browser smoke tests. A passing CI run does not mean the app is deployed.

## Next product milestones

1. Stabilize the prototype and verify Arabic/English behavior, accessibility, and mobile layouts.
2. Decide authentication, database, storage, and deployment providers.
3. Build a tenant-scoped dashboard with structured editing, preview, and version history.
4. Add immutable publishing snapshots and safe tenant/subdomain routing.
5. Define and test the versioned Menu V3 integration API.
6. Add real booking/contact providers only after their credentials, privacy, consent, and failure behavior are designed.

## Release policy

No production release until required CI, critical browser journeys, tenant-isolation tests, security/secret scan, accessibility and responsive checks, and deployed-commit verification pass.
