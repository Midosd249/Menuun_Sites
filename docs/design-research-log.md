# Design Research Log — Menuun Public Platform

**Date:** 2026-10-12  
**Status:** Focused research; synthesis is provisional until real-browser review.

## Repository evidence (primary)
- **Source:** `Midosd249/Menu_V3/AGENTS.md`, `package.json`, `docs/automatic-specialist-routing.md`, `src/lib/auth/server.ts`, and `src/lib/auth/client.ts`.
- **VERIFIED finding:** Menu V3 has a React 19 + TypeScript + Vite + TanStack Start/Router stack, Better Auth, PostgreSQL/PGLite-oriented persistence, and tests. It requires repository-first workflow, RTL/LTR checks, security boundaries, and evidence-based status.
- **Transferable principle:** Use a typed app architecture, server-side auth, durable persistence, focused tests, explicit unknowns, and staged delivery.
- **Limitation:** The target repo is currently static and its public business domain differs from Menu V3's restaurant-menu domain. The target stack cannot be changed by blindly copying every source file.
- **Do not copy:** Restaurant order/cart/payment schemas or Menu V3's template/theme internals as if they were salon-booking requirements.

## AI workflow and security
- **Source:** `Midosd249/ai-agent-foundation/AGENTS.md` and `docs/AI_SECURITY.md`.
- **VERIFIED finding:** The foundation requires minimal useful specialist routing, deterministic authorization, server-side secrets, validation of structured/model outputs, and no claiming unverified work.
- **Transferable principle:** Use a bounded specialist workflow (product/architecture, design, security, QA) and treat external/retrieved content as untrusted data.
- **Limitation:** The AI foundation is an operating contract, not a drop-in application runtime.
- **Do not copy:** Any AI provider integration without reading current official contracts and establishing a real product need.

## Public-market research
- **Source:** Exa search for salon appointment SaaS / public booking platforms, queried on 2026-10-12.
- **VERIFIED finding:** Public competitor material commonly emphasizes branded booking pages, anytime self-service, reducing manual messaging, and a unified business workspace. Results included a Lebanon-focused booking platform and salon software in the UAE.
- **Transferable principle:** Lead with a concrete customer outcome, show how a business gets a branded booking presence, and make the next step obvious.
- **Limitation:** This was a small discovery search, not a complete competitor audit; claims and prices on competitor sites were not independently validated.
- **Do not copy:** Competitor wording, pricing, branding, UI, screenshots, or unsupported feature claims.

## Visual direction
- **PROPOSED:** A premium editorial SaaS direction: warm ivory background, near-black typography, deep forest-green accent, restrained lime signal, generous whitespace, strong Arabic type, and a clear product-preview composition.
- **PROPOSED:** The homepage should communicate the platform promise before listing features. Use a visible product-preview card to make the workflow tangible, then explain benefits, onboarding steps, template flexibility, and FAQs.
- **PROPOSED:** Arabic is the default and RTL must be treated as a first-class layout rather than a translated LTR page. English should be supported through explicit document `lang` and `dir` updates.
- **UNKNOWN:** Current Refero connector calls were blocked by the connector's `NO_SUBSCRIPTION` response. No Refero screenshots/styles were inspected, so no claim is made that this design is Refero-validated.
- **No-copy rule:** Use original composition, original copy, CSS-native graphics, and product-specific components; do not recreate any one reference site.

## Validation still required
- Real-browser screenshots at mobile, tablet, and desktop widths.
- RTL visual review and English LTR review.
- Keyboard-only navigation and focus-state review.
- Actual Vercel build/deployment evidence.
- Product and customer interviews before freezing marketing claims or pricing.


## Next.js migration and research update — 2026-10-13

### Repository evidence
- `Menuun_Sites` now targets Next.js App Router for server-renderable marketing content, built-in metadata, sitemap/robots and future public tenant routes.
- The initial marketing page remains a client component because the Arabic/English switch, FAQ accordion and mobile navigation use browser interaction. The pathname is read with Next navigation APIs rather than accessing `window` during server rendering.
- Static owner/template source is preserved and copied into `public/` during the build. Route rewrites preserve legacy directory-index URLs; this must be verified against a real Next.js deployment before declaring compatibility complete.

### Architecture research
- Official Next.js documentation is the authority for App Router, route metadata and deployment conventions: https://nextjs.org/docs.
- Vercel migration skills provide a useful checklist for converting a React SPA, but their CRA-specific details must not be applied blindly to this Vite source: https://github.com/vercel-labs/migration-skills.
- Supabase's official Next.js SSR guidance and RLS guidance are the baseline for any later auth/database work: https://supabase.com/docs/guides/auth/server-side/nextjs and https://supabase.com/docs/guides/database/postgres/row-level-security.
- The migration deliberately does not configure authentication, add database migrations, create paid resources or deploy to production.

### Visual-reference status
- Refero style and dashboard-screen searches were attempted but returned `NO_SUBSCRIPTION`. No screenshots or style records were inspected.
- Existing visual direction remains provisional: deep forest green, restrained lime accent, generous spacing, and Arabic-first typography. It is not claimed to be externally reference-validated.
- Before a major redesign, restore Refero access, inspect 3–4 distinct styles and concrete dashboard/booking screens, write a reference lock, then perform screenshot-based visual QA.

### Acceptance still pending
- GitHub Actions test/typecheck/build evidence for the Next.js migration.
- Browser verification for `/`, `/login`, `/signup`, `/owner/`, and `/templates/atelier-09/`.
- Desktop/tablet/mobile review in Arabic RTL and English LTR, including keyboard focus and reduced motion.
- Vercel deployment quota and custom-domain linkage remain unverified.
