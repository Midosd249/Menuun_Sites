# Session Protocol

At the start of every session:
1. Read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, this file, and relevant docs.
2. Check branch, latest main SHA, working-tree/diff state (when available), open PRs, CI, and deployment status.
3. Confirm the exact task and acceptance criteria; avoid repeating work already verified.
4. Research current official documentation when choosing or integrating frameworks, APIs, hosting, auth, or storage.
5. For design work, prepare a brief, reference analysis, asset/licensing notes, and responsive/accessibility criteria before implementation.

During work:
- Use a focused branch and one coherent PR.
- Keep changes minimal and review the full diff.
- Use tests first for behavior changes.
- Never fabricate command results or infer production status from CI.
- Never copy private keys, tokens, environment values, or customer data into logs/docs.

At the end:
1. Run all feasible relevant checks and report skipped checks with reasons.
2. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` where status changed.
3. Provide exact branch, commit/PR, checks, and deployment SHA/URL if deployed.
4. Clearly separate verified facts, assumptions, and unresolved decisions.
