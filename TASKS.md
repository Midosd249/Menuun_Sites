# Tasks

## Active task
**Verify public marketing application build and routing** — IN_PROGRESS (build/tests pass; Vercel preview blocked)

Acceptance criteria:
- [x] `npm test` passes — GitHub Actions run 38305351474.
- [x] `npm run build` passes — GitHub Actions run 38305351474.
- [ ] Vercel preview build for `feat/public-platform-foundation` is inspected — BLOCKED by HTTP 402 daily deployment API limit (>100, retry after 24 hours).
- [ ] Root route and `/login/`, `/signup/` resolve to the React app.
- [ ] `/owner/` and `/templates/atelier-09/` remain accessible — copy script is covered by source test, but deployed routing remains unverified.
- [ ] No claims of working authentication or live bookings appear on the new public homepage.
- [x] Unknowns and evidence are recorded in `PROJECT_STATE.md`.

## Backlog
- [ ] Port and test the relevant Menu V3 Better Auth server/client patterns after a full auth and database audit.
- [ ] Confirm persistent database integration and environment requirements before production signup.
- [ ] Build protected customer workspace and server-authorized business onboarding.
- [ ] Define template contract and convert Atelier 09 into a reusable template.
- [ ] Design and test scheduling data model and server-side booking transaction.
- [ ] Add CI, browser tests, responsive visual review, SEO and accessibility quality gates.
