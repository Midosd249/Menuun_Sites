# Menuun Sites — Engineering Operating Contract

## Product boundary
Menuun Sites is a standalone multi-tenant website product in the Menuun ecosystem. Menu V3 remains the digital-menu product. Do not import Menu V3 source code, share its database directly, or change its production behavior as a shortcut. Cross-product integration must use explicit, versioned server-side contracts and documented ownership.

## Mandatory start-of-task protocol
1. Read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, `SESSION_PROTOCOL.md`, `README.md`, and relevant architecture/security/design docs.
2. Inspect current Git branch, working tree, latest commits, open PRs, and relevant CI/deployment state before editing.
3. Classify statements as verified facts, assumptions, decisions, or recommendations.
4. Define acceptance criteria and a test plan before implementation.
5. Make the smallest complete change; do not rewrite working areas without evidence.
6. Run applicable tests and security checks. Report exact commands/results; never claim unrun checks passed.
7. Update continuity files and link the exact commit/PR/deployment evidence.

## Product design quality
- Build real, differentiated websites—not generic repeated card templates.
- Use design research and a written design brief before substantial UI work.
- Check responsive layouts at small phone, large phone, tablet, laptop, and desktop widths.
- Arabic RTL and English LTR are independent supported layouts, not a late CSS flip.
- Respect reduced motion, keyboard operation, semantic HTML, visible focus, contrast, and accessible form errors.
- Every visible interactive control must have a real behavior or be explicitly marked unavailable.
- Keep reference assets, licensed source material, and final production assets clearly separated. Verify licenses before reuse.

## Architecture and security
- Tenant identity is resolved and authorized on the server; never trust client-supplied tenant IDs or forwarded tenant headers.
- Every tenant-owned query, file operation, preview, publish, and domain operation must enforce tenant scope.
- Public published pages must not expose draft content, private assets, admin endpoints, or secrets.
- Validate and normalize hostnames; prevent host-header injection, tenant confusion, open redirects, and reserved-subdomain collisions.
- Keep secrets in deployment secret stores; commit only variable names and safe examples.
- Treat AI output as untrusted input. AI may assist with content/design but cannot authorize actions or bypass validation.
- Avoid cross-tenant shared caches unless tenant identity is part of the cache key and invalidation is tested.
- Database migrations are additive, reviewed, and reversible where practical.

## Engineering method
- Use test-driven development for behavior changes: reproduce/write failing test, implement, then verify.
- Prefer deterministic code for validation, routing, billing, permissions, and publishing.
- Use AI/provider abstractions only when needed; provider SDKs must not leak through business logic.
- Use Playwright for critical user journeys when configured; add browser tests for publishing, preview, locale, and tenant isolation.
- Use current official docs for framework, hosting, database, auth, and provider integrations.
- Keep dependencies minimal and license-compatible.

## Git and release discipline
- Never work directly on `main` for feature changes.
- One focused branch and PR per coherent task. Keep PRs small enough to review.
- Before PR creation, compare branch with latest main and inspect the full diff for unintended changes.
- Do not merge until required CI checks pass and review comments are resolved.
- Never stack several UI changes and assume the last merge contains them; verify the exact merged SHA and deployed commit.
- CI success is not deployment proof. Verify the production deployment URL and commit independently.
- After merging, verify main contains the expected commits/files; record commit SHA and deployment evidence in project state.
- Never close or merge a PR based only on title or assumption. Compare actual changed files and commit ancestry first.

## Completion report
State: changed files, behavior, tests run and exact outcomes, security implications, open risks, PR/commit URL, and deployment verification status.
