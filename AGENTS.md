# Menuun Sites — Agent Operating Contract

## Mission
Build Menuun as a professional Arabic-first, bilingual SaaS platform for appointment-led businesses. Treat Menu V3 as an architectural reference, not as a codebase to clone blindly. The current milestone is the public marketing site; customer accounts, workspaces, and reusable templates are later phases.

## Startup and evidence
- Before meaningful changes, inspect this file, `docs/roadmap/public-platform-foundation.md`, relevant source, tests, configuration, Git branch/history, and Vercel evidence when available.
- Label repository facts `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, or `BLOCKED`.
- Use connected tools only when available, relevant, authorized, and materially useful. Never claim a source was inspected if its connector failed.
- Read the AI Agent Foundation's `AGENTS.md` and `docs/AI_SECURITY.md` when planning specialist or AI-enabled workflows.

## Architecture
- Prefer React + TypeScript and a production build over a collection of independent HTML applications.
- Port patterns from Menu V3 only after inspecting source contracts, tests, and dependencies.
- Keep business logic for scheduling distinct from restaurant menu/order logic.
- Use same-origin server endpoints for auth and sensitive operations. Never store password hashes, session secrets, provider credentials, or database credentials in client code.
- Vercel is compute/hosting, not durable user storage. Require a persistent database before implementing production auth.
- Never trust client-supplied user ID, role, tenant/business ID, membership, or entitlement.
- Preserve existing business data and the Atelier 09 template unless an explicit migration/rollback plan is reviewed.

## Design
- Arabic RTL is the default; English LTR is a supported first-class experience.
- All key links and buttons must have a real, clear outcome; no fake signup success or fake booking flow.
- Use semantic HTML, visible focus, keyboard navigation, sufficient contrast, reduced-motion support, responsive layouts, and appropriate touch targets.
- Use design references for principles, not copying. Record material research in `docs/design-research-log.md`.

## Engineering
- Use tests-first for behavior changes. Discover existing commands before choosing test commands.
- Test state and user outcomes; prefer real implementations over excessive mocks.
- For browser-facing work, use real-browser evidence when available. Source inspection and HTTP 200 do not prove visual quality.
- Keep changes scoped, reversible, and documented. Do not weaken security to make tests pass.
- Do not deploy, change Vercel project settings, create paid resources, or migrate existing data without explicit authorization.

## Completion
- Report exact files/commits, test/build results, deployment status, remaining unknowns, and next task.
- Never claim `DEPLOYED` without direct Vercel evidence.
- Keep the plan and research log consistent with implementation state.
