# Menuun Sites

**A standalone website platform in the Menuun ecosystem.** The initial product focus is professional salon and beauty-business websites, with a planned path to other verticals.

> **Status: foundation/bootstrap phase.** The repository is not yet a deployed website builder. Runtime, database, auth, storage, and production domain configuration remain to be selected and verified.

## Product boundary

- **Menu V3** continues to own digital-menu workflows and existing production data.
- **Menuun Sites** will own website editing, templates, assets, domains, drafts, publication snapshots, and site rendering.
- Integration will use explicit, versioned server-to-server contracts. Do not connect directly to Menu V3's database or copy private modules as a shortcut.
- Customer websites are intended to use Menuun-controlled subdomains first. Custom domains come later after ownership verification and lifecycle handling are implemented.

## Engineering method

This project adopts the disciplined workflow from [AI Agent Foundation](https://github.com/Midosd249/ai-agent-foundation), tailored for a production website platform:

- mandatory project-state review and durable handoff;
- focused branches and small, reviewable pull requests;
- evidence-based research and current official documentation;
- test-driven implementation and explicit acceptance criteria;
- security, tenant isolation, secret scanning, and release gates;
- design briefs, licensed assets, Arabic RTL + English LTR, responsive QA, and Playwright browser testing;
- exact commit and deployment verification—CI passing alone is not proof of production deployment.

Read [AGENTS.md](AGENTS.md) before changing code.

## Project documents

- [Project state](PROJECT_STATE.md)
- [Plan and milestones](PLAN.md)
- [Task queue](TASKS.md)
- [Session protocol](SESSION_PROTOCOL.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security baseline](docs/SECURITY.md)
- [Design quality gate](docs/DESIGN_QUALITY_GATE.md)

## Initial product direction

The first vertical slice should provide a distinctive salon site with hero, services/pricing, team, gallery, location/contact, and a booking/contact CTA. Content must be editable, previewable, and publishable; no arbitrary customer JavaScript or executable code.

## Local development

Application setup instructions will be added after the framework/runtime decision and a clean install/build have been verified. Do not infer a runnable app or deployment from the presence of this repository.

## Release policy

No production release until the required CI checks, critical browser journeys, tenant-isolation tests, security/secret scan, accessibility and responsive checks, and deployed-commit verification pass.
