# Menuun Sites — Agent Operating Contract

## Mission
Build Menuun as a professional Arabic-first, bilingual SaaS platform for appointment-led businesses. Use Next.js App Router, React and TypeScript as the active web foundation. Treat Menu V3 and AI Agent Foundation as read-only architecture/process references, not codebases to clone blindly. The active milestone is the reversible Next.js public-platform foundation; auth, workspaces, tenant booking and publishing remain later phases.

## Startup and evidence
- Before meaningful changes, inspect this file, `docs/roadmap/public-platform-foundation.md`, relevant source, tests, configuration, Git branch/history, and Vercel evidence when available.
- Label repository facts `VERIFIED`, `INFERRED`, `PROPOSED`, `UNKNOWN`, or `BLOCKED`.
- Use connected tools only when available, relevant, authorized, and materially useful. Never claim a source was inspected if its connector failed.
- Read the AI Agent Foundation's `AGENTS.md` and `docs/AI_SECURITY.md` when planning specialist or AI-enabled workflows.

## Architecture
- Prefer Next.js App Router + React + TypeScript and a production build over a collection of independent HTML applications.
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
- For browser-facing work, use real-browser evidence when available. Source inspection and HTTP 200 do not prove visual quality. Preserve legacy owner/template routes through explicit Next.js public-asset handling and verify them in a browser.
- Keep changes scoped, reversible, and documented. Do not weaken security to make tests pass.
- Do not deploy, change Vercel project settings, create paid resources, or migrate existing data without explicit authorization.

## Active architecture references
- Read `docs/architecture/nextjs-platform-architecture.md` before route, auth, tenant, booking, template or AI-boundary changes.
- Read `docs/repository-audit.md` before reusing code from adjacent repositories.
- Read `docs/SESSION_HANDOFF.md` at the start of a new chat and verify current Git/CI/Vercel state before acting.

## Completion
- Report exact files/commits, test/build results, deployment status, remaining unknowns, and next task.
- Never claim `DEPLOYED` without direct Vercel evidence.
- Keep the plan and research log consistent with implementation state.

## Mandatory tool-catalog workflow
- For every repository task, before deciding how to proceed, read `docs/AI_TOOLS_CATALOG_AR.md` and select the tools/workflows that materially help the specific task. This applies to coding, debugging, research, design, documentation, testing, deployment analysis, and repository maintenance—not only tasks that explicitly mention AI tools.
- Do not wait for the user to name or tag a tool. Discover available connected tools, choose the best fit, and invoke them when relevant, authorized, and useful. Combine tools when the task benefits from it; for example, use Exa for external research and GitHub for repository inspection or changes.
- Treat the catalog as a selection guide, not proof that a tool is currently connected or that every feature is authorized. Verify availability and permissions at the time of use; if unavailable or unsuccessful, state the limitation and use a safe alternative where possible.
- Read the relevant tool entry before using an unfamiliar tool. Prefer evidence from the repository and primary/current sources; distinguish verified facts from proposals and assumptions.
- After tool-assisted work, verify the resulting artifact or action where practical and report what was actually completed. Never claim an action succeeded without evidence.
- Keep the catalog current: when a useful tool or workflow is discovered that is missing, propose or add a concise entry to `docs/AI_TOOLS_CATALOG_AR.md` as part of the relevant documentation work, without turning every task into unnecessary catalog maintenance.
- These instructions govern work in this repository. To make the same rule durable in another repository, add an equivalent instruction to that repository's `AGENTS.md` (or its agent instruction file); a file in this repository cannot enforce behavior in unrelated repositories or override platform/tool availability.
