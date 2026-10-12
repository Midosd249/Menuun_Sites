# Session Protocol

1. Read `AGENTS.md`, `PROJECT_STATE.md`, `PLAN.md`, `TASKS.md`, this file, and relevant source/tests.
2. Establish repository truth before using chat history; mark facts VERIFIED, INFERRED, PROPOSED, UNKNOWN, or BLOCKED.
3. Select the smallest useful specialist workflow. Use design and research sources only when available and relevant; report connector limitations honestly.
4. Define one active task, acceptance criteria, risks, and rollback before implementation.
5. For behavior changes, write/fix tests first where feasible. Discover the project's actual test/build commands.
6. Implement the smallest complete, reversible change. Keep secrets and authorization server-side.
7. Verify tests/build, inspect relevant deployment evidence, and perform browser QA when available.
8. Update `PROJECT_STATE.md`, `PLAN.md`, and `TASKS.md` consistently. Record uncertainty rather than claiming success.
9. Stop at the active milestone boundary. Do not deploy, change production settings, create paid resources, or migrate data without authorization.
