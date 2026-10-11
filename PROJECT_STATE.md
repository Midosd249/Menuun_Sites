# Project State — Menuun Sites

## Purpose
Standalone, production-grade multi-tenant website builder for Menuun customers, initially focused on salons and beauty businesses, designed to integrate safely with Menu V3 without coupling the applications or sharing a database directly.

## Verified repository state
- Repository: `Midosd249/Menuun_Sites`
- Initial observed content: README only; no application implementation was confirmed during bootstrap.
- Bootstrap branch: `foundation/bootstrap-quality-gates`
- Production deployment: NOT VERIFIED.
- Domain/DNS setup: NOT VERIFIED.
- Authentication provider and database provider: NOT DECIDED.
- Current framework: NOT YET ESTABLISHED IN CODE.
- Do not describe the product as deployed or production-ready until evidence exists.

## Product decisions
- Sites is a separate application and deployment lifecycle from Menu V3.
- Menu V3 remains the source of truth for its existing menu product and production data.
- Integration starts with an explicit server-to-server API contract; no direct database sharing.
- Initial product vertical: salon / beauty websites.
- Initial publishing target: customer subdomains under a Menuun-controlled domain, after DNS/hosting setup is verified.
- Custom customer domains are a later milestone, requiring domain ownership verification and lifecycle management.
- AI-assisted design/content is optional and bounded; generated output must be validated and editable.
- Prefer structured section-based editing over arbitrary code execution in customer sites.

## Current milestone
M0 — Repository foundation, architecture, and quality gates.

## Completed in this milestone
- [x] Establish engineering operating contract.
- [x] Define repository continuity and release-verification rules.
- [x] Record product boundary and integration principles.
- [ ] Bootstrap application runtime and installable dependencies.
- [ ] Configure CI and required checks.
- [ ] Run local verification against a clean checkout.

## Active risks / unknowns
- Confirm repository permissions, branch protection, and default branch settings.
- Confirm Vercel project/team and DNS ownership before domain implementation.
- Decide auth and data ownership for shared Menuun identity.
- Decide storage provider and image processing pipeline.
- Define API ownership, authentication, versioning, rate limits, and failure behavior between Menu V3 and Sites.
- Review the Ritunio source/license before reusing any code or assets.

## Verification evidence
No build, unit test, browser test, security scan, or deployment has been run by this bootstrap commit. Record results only after execution.

## Handoff
Next: inspect repository settings and files, choose the app stack based on current official docs, bootstrap a minimal runnable app, add CI/secret scanning/Playwright, and verify it from a clean checkout.
