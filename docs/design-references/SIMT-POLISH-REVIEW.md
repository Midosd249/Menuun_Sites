# SIMT Premium Polish — Design and Implementation Review

Date: 2026-10-12  
Repository: `Midosd249/Menuun_Sites`  
Working branch: `feat/simt-premium-motion-polish`  
Scope: the existing fictional SIMT men's barbershop demo only. No production launch or real booking integration is claimed.

## Verified baseline

- The application uses Next.js App Router, React 19, TypeScript, and a single-page Arabic-first RTL / English LTR barbershop demo.
- The current page already has a cinematic hero, owner-supplied local photos/video, services, illustrative barber profiles, gallery, location/hours, FAQ, and a simulated booking dialog.
- The booking flow is explicitly a demo: it does not create appointments, send messages, or persist submitted details.
- Business name, prices, staff identities, location, hours, and availability are illustrative. The site is not ready to represent a real business until these are approved and replaced.
- Two remaining barber portraits use remote Unsplash URLs; their rights and production suitability are not verified.
- The project requires Node.js 20.9+ and provides lint, typecheck, unit, build, and Playwright scripts.

## Design direction

Keep the existing SIMT identity and its distinctive editorial/photographic approach; do not import the women's salon archive's brand or assets. Maintain the forest/ink + warm ivory + restrained brass/teal contrast. Prioritize readable Arabic typography, a strong headline hierarchy, deliberate spacing, visible focus, and a clear booking action.

### External research

- Exa search surfaced a dark-luxury Cutz barbershop case study and implementation examples emphasizing photo-led storytelling, reduced-motion support, image optimization, clear booking paths, and semantic SEO. These are ideas to evaluate, not code or assets to copy.
- Refero was attempted for visual reference discovery, but the connected service returned `NO_SUBSCRIPTION`. No Refero results were used or represented as verified.
- The repository's existing owner-provided MAREA screenshots and `docs/design-references/README.md` remain the primary project-specific visual reference; their visual traits were adapted, not copied.

## Changes in this pass

1. Added the Alexandria Arabic font family while retaining IBM Plex Sans Arabic as a fallback and DM Sans / Playfair Display for the existing Latin typography.
2. Added a consistent motion vocabulary and restrained entrance choreography for the hero copy and overlaid labels.
3. Refined interactive feedback for buttons, service rows, imagery, selection controls, and form fields.
4. Strengthened keyboard focus visibility, tap behavior, dialog scroll containment, and form field semantics.
5. Preserved reduced-motion overrides and the still-first hero behavior on small screens / reduced-motion settings.
6. Added native required semantics to the demo name and telephone inputs and set the telephone input type.
7. Did not add an animation dependency; changes use existing CSS and React behavior.

## Acceptance criteria

- [x] No new framework or animation dependency.
- [x] Keep the site men's-barbershop-specific and preserve the demo-only disclosure.
- [x] Arabic-first typography and English support remain intact.
- [x] Respect `prefers-reduced-motion` and avoid showing the hero film on mobile.
- [x] Add native required semantics to demo contact fields.
- [ ] Run lint, typecheck, unit tests, production build, and Playwright tests on this exact branch head.
- [ ] Inspect actual browser renders at 360, 390, 768, 1024, 1280, and wide desktop.
- [ ] Verify keyboard focus order, dialog focus management, contrast, and video network/playback behavior.
- [ ] Optimize and verify owner-supplied media dimensions, formats, duration/codec, and commercial usage rights.
- [ ] Replace illustrative data and remaining remote barber portraits before a real client launch.

## Verification status

This was a repository/API-based source edit. No local shell checkout was available in this workflow, so no lint, typecheck, test, build, or browser run is claimed here. CI and preview status must be checked against the final commit SHA before considering the change verified. Production deployment remains unverified.

## Risks and next steps

- Motion and typography changes are source-reviewed but require browser QA to catch overflow, animation timing, font loading, and cross-browser rendering issues.
- CSS-hosted Google Fonts require network access; consider self-hosted/optimized font delivery when the final deployment environment and licensing are confirmed.
- Do not expose the archived `public/assets/grok-workspace.zip` in a public release; keep any source archive outside the public asset directory or remove it after confirming a private retained copy.
- Keep this PR unmerged until all required CI checks pass and the exact deployment/commit relationship is independently verified.
