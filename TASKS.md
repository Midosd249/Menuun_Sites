# Task Queue

## In progress
- [x] M1.1 Verify the bilingual barber-site prototype with CI and fix confirmed failures (run `38179926660` passed all jobs on code/test head `7af6f26bf0794125774b7ea899d6981eda9f24c4`; see [PR #2](https://github.com/Midosd249/Menuun_Sites/pull/2)).
- [ ] M1.2 Run Playwright checks and inspect desktop/mobile layouts, keyboard use, locale direction, and modal behavior.
- [ ] M1.3 Finish local media release readiness: verify usage rights, inspect image/video metadata, optimize responsive image/video variants, and record provenance (all seven supplied JPGs are now assigned to demo roles).
- [ ] M1.4 Finalize demo copy and clearly distinguish illustrative data from verified customer details.

- [ ] M1.7 Verify the uploaded hero video and local photos visually in browser at desktop/mobile sizes; inspect reduced-motion behavior and network loading.

## Next
- [ ] M1.5 Add accessibility checks for keyboard focus, dialog focus management, color contrast, and form errors.
- [x] M1.6 Verify the Vercel preview after CI passed: [preview](https://menuun-sites-7kys5107n-midosd2s-projects.vercel.app/) is `READY` for PR head `479ad8abcb8ee89148ea5251c154cdc270f6400b`; production deployment remains unverified.
- [ ] M2.1 Choose authentication, database, and object storage providers.
- [ ] M2.2 Build a tenant-scoped dashboard, structured editor, draft preview, and version history.
- [ ] M3.1 Design safe site publishing snapshots and tenant/subdomain routing.
- [ ] M4.1 Define the versioned Menu V3 integration API and contract tests.

## Blocked / needs verification
- [ ] Confirm Vercel project/team and DNS ownership.
- [ ] Decide whether identity is shared with Menu V3 or initially separate with later SSO.
- [ ] Decide database and object storage providers.
- [ ] Define Menu V3 integration API ownership, credentials, versioning, rate limits, and failure behavior.
- [ ] Review the downloaded Ritunio source and its license before reusing any code or assets.

## Done
- [x] Create engineering operating contract and continuity documents.
- [x] Record separation from Menu V3 and API-only integration principle.
- [x] Bootstrap Next.js, TypeScript, lint, unit-test, and browser-test configuration.
- [x] Build an Arabic-first responsive SIMT Barber House demo with English LTR support.
- [x] Add a guided booking simulation with an explicit no-real-booking disclosure.
- [x] Add CI jobs for secret scanning, foundation docs, lint, types, unit tests, build, and Playwright smoke tests.
- [x] Fix the initial secret-scan workflow's missing pull-request read permission in configuration.

## Closure requirements
Every task marked done must link to a PR/commit and list actual verification commands/results. The code and workflow configuration are in PR #2; the latest CI result still must be inspected before marking quality verification complete. Do not mark tasks complete from code inspection alone.


## SIMT visual polish follow-up — 2026-10-12
- [x] Add a focused visual polish branch based on the existing barbershop slice.
- [x] Add Arabic font hierarchy, restrained hero motion, interaction feedback, and focus/input refinements without a new animation dependency.
- [x] Document the design decisions and unverified items in [SIMT-POLISH-REVIEW.md](docs/design-references/SIMT-POLISH-REVIEW.md).
- [ ] Verify CI (lint, typecheck, unit tests, production build, Playwright) for the final branch commit.
- [ ] Perform visual and keyboard QA at 360, 390, 768, 1024, 1280, and wide desktop widths.
- [ ] Verify media rights, optimize images/video, and replace the remaining remote demo barber portraits before customer launch.
- [ ] Keep the PR unmerged until required checks pass and review comments are resolved.
