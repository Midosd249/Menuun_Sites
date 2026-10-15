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

## Brand and interface exploration — 2026-10-13
- **Brand source of truth:** imported the complete Arabic and English SVG wordmarks from `Midosd249/Menu_V3/assets/brand/menuun/final/` at commit `b71b88954988303a258054236b56fff08a29f65b`. The source vector paths are preserved; these are not re-created text approximations.
- **Open-source motion/UI research:** reviewed the Motion for React accessibility guidance at https://motion.dev/docs/react-accessibility and public projects including https://github.com/ColorlibHQ/velora-ui and https://github.com/RMahammad/motiq.
- **Applied selectively:** kept the current dependency footprint and used small CSS entrance/hover transitions rather than adding a large animation dependency before browser profiling. `prefers-reduced-motion` disables the new movement.
- **Template scope decision:** the public page now presents exactly three curated starting points: Essential, Editorial, and Atelier. This is a public-facing set of three, not a promise that every future template is already implemented.
- **Still required:** real-browser visual QA at desktop, tablet, and mobile sizes in Arabic RTL and English LTR, including keyboard/focus and console/network checks. No claim of visual QA is made by this source-level update.

## Salon profile imagery and social/location links — 2026-10-14

- **Primary repository evidence:** `app/s/[slug]/page.tsx`, `app/owner/media-editor.tsx`, the public salon CSS, and the existing owner/data contracts. The public profile already used salon gallery media and `barbers.image_url`; service records previously had no public image field.
- **Exa research — open-source candidates reviewed:**
  - [Opencals Frisor](https://github.com/letsopencals/template-frisor) — MIT-licensed Next.js 15 barbershop storefront with service, staff, gallery, location, and booking patterns. Its Opencals SDK, Stripe, and NextAuth stack are not compatible with the existing Menuun Supabase/RPC architecture, so it was used only as a feature checklist/reference, not copied.
  - [ShearCraft Booking](https://github.com/Hereetria/shearcraft-booking) — MIT-licensed Next.js/Supabase barbershop booking project with service/staff/gallery concepts. Its overlapping booking and admin implementation was not imported wholesale; Menuun retains its own appointment RPCs and tenant policies.
  - [Ekwugha/barberShop](https://github.com/Ekwugha/barberShop) surfaced as another candidate, but its license was not verified during this pass; no code was reused from it.
- **Competitor feature synthesis from Exa:** Fresha's official help material describes team profiles, service eligibility, social links, and professional portfolios. This supports making team identity and portfolio imagery first-class, rather than treating the public page as a text-only menu. No competitor copy or branded UI was copied.
- **Design decisions:** service rows now have prominent image slots; barber cards use portraits; if a business has not uploaded real imagery yet, stock photos are explicitly labelled as illustrative. Owners can replace those fallbacks with their own service and barber images. Social URLs are accepted only when normalized to HTTPS and are rendered with safe new-tab attributes. A Maps destination is taken from the owner's URL or generated from the address when available.
- **Reference lock:** preserve Menuun's high-contrast Atelier 09 direction as the primary visual language; borrow a clear service-photo catalogue and team portfolio emphasis from the open-source feature review; keep Arabic RTL, existing booking RPCs, QR/share, and tenant-scoped media policies. Reject importing a different booking/auth backend or adding AI to deterministic CRUD.
- **Refero limitation:** style and screen searches were attempted, but Refero returned `NO_SUBSCRIPTION`. No Refero styles/screens were available to inspect; do not claim otherwise. Re-run the Refero research after subscription access is restored.
- **Open items:** verify the Unsplash fallback URLs in a real browser, test upload/replace flows against the staged migration, inspect responsive screenshots and keyboard behavior, and confirm CI on the latest branch head before calling the work complete.



## Signature salon templates — 2026-10-14

### Reference repositories actually inspected
- `Midosd249/Menu_V3`: read the design-intelligence and design-system contract. Applied the transferable gates: strong information hierarchy, explicit Arabic RTL behavior, responsive image stability, reduced-motion support, and truthful data/image states. No restaurant menu internals were imported.
- `Midosd249/Demo_Site`: read the builder and data-contract documentation. Applied the principle that preview/demo content must remain clearly distinct from real business data; the stock photos are marked as illustrative through alt text/labels and must be replaced by the salon's own photography.
- `Midosd249/Menu-V2-Sandbox`: read the tenant-aware image upload, preview, RTL/LTR and responsive interaction overview. Kept Menuun's own owner-media bucket and Supabase/RPC architecture; did not import its tenant/product schema.
- `Midosd249/ai-agent-foundation`: read `AGENTS.md`, `SESSION_PROTOCOL.md`, `PLAN.md`, `TASKS.md`, `prompts/ORCHESTRATOR.md` and the feature workflow. Used a bounded design/implementation/QA workflow with explicit evidence gates; no AI runtime was added because templates are deterministic.

### Design lock
- **Atelier / dark editorial:** charcoal foundation, electric citron signal, large photographic hero, sharp lines, high contrast, structured service rows.
- **Oasis / botanical natural:** warm chalk and sage palette, organic arch hero, photo-led service cards, soft paper surfaces and rounded booking controls.
- **Rose Studio / couture beauty:** blush and rosewood palette, arched imagery, editorial Arabic serif fallbacks, asymmetric corner details and boutique service cards.
- Shared invariants: Arabic-first RTL, clear booking CTA, stable price/duration hierarchy, owner-uploaded media wins over stock defaults, visible keyboard focus, reduced-motion support, no false reviews/ratings or fabricated business claims.
- The composition is original synthesis, not a clone of any single reference.
- **Image policy:** default remote Unsplash images are illustrative fallback photography. Real salon-owned photos take precedence. Image load errors hide the broken image rather than exposing the browser's broken-image glyph.

### Verification gate
- Added static regression assertions for distinct template selectors, salon imagery and failed-image handling.
- **Pending:** current-head CI, Vercel preview for the redesign commit, real browser screenshots and interaction checks at desktop/tablet/mobile, and external image URL checks.


## Final runtime and responsive verification — 2026-10-14

- **Verified source head:** `e4cd44bee6a44d713b03f8da9d90415da098af13`; preview deployment `dpl_36cBmox5KXRNeP95YzY5xpWM6y9N` reached READY.
- **Runtime defect found and fixed:** passing `onError` functions from the server-rendered salon page caused Next.js to return HTTP 500. The image fallback behavior now lives inside the client component `app/s/[slug]/salon-image.tsx`, so no event handler crosses the Server/Client Component boundary.
- **HTTP smoke checks:** `/`, `/s/atelier-09`, and the `atelier`, `oasis`, and `rose` template query variants returned HTTP 200.
- **Playwright matrix:** all three templates checked at 390 px, 768 px and 1440 px. No horizontal overflow; no browser page errors or console errors; all nine demo images loaded after scrolling through the page. The service-section captures confirm Atelier's row layout, Oasis's three-column photo cards, and Rose's two-column editorial cards at desktop.
- **External media:** the five current salon fallback URLs returned HTTP 200 with `image/jpeg`.
- **CI:** Static Quality run `38624960584` and Supabase RLS/pgTAP run `38624960495` both passed for the implementation head.
- **Still intentionally pending:** no Supabase migration was applied; owner-upload persistence, saved template selection, and social-link persistence cannot be claimed until migration and owner-path tests are completed. The PR remains draft/unmerged pending those release decisions.
