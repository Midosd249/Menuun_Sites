# MENUUN SITES — HOMEPAGE PRODUCT ALIGNMENT
## OpenCode Desktop Execution Brief

Repository: Midosd249/Menuun_Sites
Target branch: feat/homepage-owner-product-alignment
Base branch: main
Base commit: 81248b3dd6c9581c52556c4f054db7c26243fed3
Product: Arabic-first bilingual salon/barbershop website + owner workspace SaaS.

## 0. Objective and execution mode
Act as Principal Product Designer, Senior Next.js Engineer, Accessibility Reviewer, QA Lead and Release Engineer.
Execute the work in the checked-out repository. Do not stop after proposing a plan. Inspect, implement, test, self-review, fix, document, commit and open a Draft PR.
Use TDD for homepage content and template-contract checks. Preserve existing functionality. Do not clone another brand.

## 1. Verified source-of-truth product capabilities
Current main uses Next.js 15 App Router, React 19, TypeScript, Supabase SSR/browser integration.

### Owner workspace — app/owner/page.tsx
Tabs: overview, appointments, services, team, settings.
Verified capabilities:
- Active salon membership validation; owner/manager scope.
- Create salon via create_salon_with_owner RPC where eligible.
- Switch between salons where user has several memberships.
- Overview counts: today's appointments, pending, active services, active team; upcoming list.
- Search appointments by customer name/phone and filter by status.
- Appointment states/actions: pending, confirmed, completed, cancelled; no_show exists in status taxonomy. Completed appointments can record payment method cash/card/transfer and paid amount/date. This is recording, not payment gateway processing.
- Add/edit services: Arabic/English names/descriptions, price, duration, active state.
- Add/edit team profiles: Arabic/English names, titles, bios, specialties, availability, optional HTTPS booking URL.
- Edit salon name (AR/EN), phone, WhatsApp, address, city, timezone.
- Edit weekly opening hours.
- Upload/update/remove logo; gallery, hero poster and location photo; service/team images where supported; social URLs Instagram, TikTok, Snapchat, Facebook, Google Maps, website.
- Select/save a public template.
- Upload MP4/WebM/MOV hero video up to 100 MB and switch image/video mode.
- Copy/share published public salon link; download/share QR.
- NotificationsStats: owner notifications; booking sound control; real-time appointment/notification changes with polling fallback; revenue/collection statistics; today/next 7 days/month/custom date filters; expected vs collected, outstanding collection, completed work, appointment statuses, completion/cancellation/no-show rates, average ticket, top services, busiest days/hours, trends, new vs returning customers, barber details/occupancy, CSV export. Describe at a high level only; never invent actual values.

### Public salon site — app/s/[slug]/page.tsx
- Resolves only active and published salons server-side by slug.
- Reads active services, barbers, business hours and public active media.
- Public sections: logo/brand, hero image/video, services/prices/duration, team, gallery, booking form, opening hours, location/map, phone, WhatsApp, social links and website.
- Bilingual Arabic RTL / English LTR.
- QR sharing.
- SalonAiAssistant rendered on public salon pages in current source. Mention only as a bounded customer-help feature; never claim autonomous booking, confirmation, authorization, or guaranteed provider responses.
- Public pages show published tenant business information; do not imply private owner data or appointment/customer records are exposed.

### Actual templates — app/owner/template-picker.tsx
Exactly three:
1. Atelier (key atelier) — dark editorial, charcoal and lime.
2. Oasis (key oasis) — warm ivory and sage, calm visual direction.
3. Forge Men (internal key rose) — charcoal, olive and copper.
Use public label Forge Men; never show Rose as user-facing template label.
Current homepage inaccurately uses Essential, Editorial, Atelier. Correct this mismatch.
Template change does not alter salon services or appointments.

### Supporting modules
- app/owner/hero-video-editor.tsx: video up to 100 MB, MP4/WebM/MOV; select image/video mode.
- app/owner/qr-card.tsx: published public link and QR copy/share/download.
- app/owner/media-editor.tsx: salon logo/gallery/hero poster/location image/service & team images where supported, social/contact links.
- app/owner/notifications-stats.tsx: notifications, realtime updates, owner analytics described above.

### Tests and scripts
package.json:
- npm test -> node --test tests/*.test.mjs
- npm run typecheck
- npm run build -> static copy + tsc + next build
- npm run test:e2e -> Playwright.
Important tests include:
- tests/public-site-contract.test.mjs
- tests/public-copy-safety.test.mjs
- tests/owner-workspace.test.mjs
- tests/e2e/public-responsive.spec.ts
- tests/e2e/owner-responsive.spec.ts
Homepage contract currently expects stale template labels Essential, Editorial, Atelier. Update after confirming picker data.
Do not weaken tests to make them pass.

### Current production baseline evidence
At inspection, https://menuun-sites.vercel.app/ returned HTTP 200 Arabic RTL.
Its hero contained a stylized fake mock dashboard with placeholder-like figures (—, 03, 02), marked واجهة تجريبية / تصميم مبدئي — ليس صفحة منشورة; it does not communicate the real relationship between owner workspace and public salon page.
https://menuun-sites.vercel.app/s/atelier-09 returned HTTP 200 and rendered active public salon data including brand, video, services, pricing/durations, contact and booking path.
Current Vercel project is Hobby. Avoid unnecessary deployments and CI runs.
Existing PR #37 TypeSafe Jev and PR #35 are unrelated. Do not modify them or their branches.

## 2. Product positioning and narrative
The homepage must show the real product as two connected experiences:
A) Owner workspace: owner controls salon identity, services, prices, team, hours, media, template, appointments, notifications and performance.
B) Public salon page: customer sees the business brand and published information, explores services/team/visuals, finds hours/location/contact and submits booking request through the supported flow.

Positioning direction:
مساحة واحدة لإدارة الصالون، وصفحة تحمل هويته وتخدم عملاءه.

Possible Arabic headline to refine:
أدِر صالونك من مكان واحد. وامنحه حضورًا يليق به.
Possible subheadline:
من الخدمات والفريق والمواعيد إلى صفحة رقمية تحمل هويتك — تجمع Menuun إدارة الصالون وتجربة العميل في مساحة واحدة.

Primary CTA should lead to real owner login: دخول المالك -> /login/.
Secondary CTA can lead to existing public sample /s/atelier-09, clearly labelled as a sample salon showcase.
Inspect /login/ and /signup/ routes before choosing other CTA labels. Do not imply instant signup, trial, free plan, or features not implemented.
English must be naturally written, not mechanically translated.

## 3. Design direction
- Preserve Menuun logo and existing design continuity: paper/ivory (#f7f6f1), ink (#20231d), forest green (#183d31), lime (#d5f278), existing IBM Plex Sans Arabic and DM Sans unless evidence supports a deliberate improvement.
- Design a distinctive product-led SaaS marketing page, not a generic template gallery.
- Hero must visibly show BOTH surfaces: owner workspace and customer-facing salon page, side by side or in a clear connected composition, with an intelligible data/content relationship.
- Use genuine screenshots if safely available. Otherwise create code-native UI panels faithful to actual screens and clearly label sample values معاينة توضيحية ببيانات نموذجية. Never expose real customer names, appointment data, phone numbers, or other private data.
- Do not fake KPI metrics, testimonials, ratings, customer logos or adoption counts.
- Strong typographic hierarchy, disciplined spacing, polished product framing, clear CTA priority, restrained motion and meaningful micro-interactions.
- Arabic RTL primary; English LTR fully supported.
- Accessible landmarks, skip link, labels, keyboard focus, contrast, touch targets, reduced motion and mobile safe areas.
- Fast page: no heavy video background or runtime data fetching for marketing content; no avoidable remote dependency.
- 320, 360, 390, 768, 1024 and 1440 widths must have no horizontal overflow.

## 4. Content architecture
Cover all of these, ordering may be optimized:
1. Header: logo, product/how-it-works/templates/FAQ anchors, locale switch, owner login; accessible mobile navigation that updates aria-expanded and closes after navigating.
2. Hero: specific proposition, concise copy, owner-login CTA, sample-public-site CTA, visual demonstration of both product surfaces.
3. Truthful proof strip, no invented numbers: Arabic-first, bilingual, owner-controlled business information, salon-branded public page.
4. Owner workspace feature storytelling: appointments/statuses; services/prices/durations; team profiles; business identity, weekly hours and media; templates and publish/share QR; notifications and performance insights.
5. Customer-facing page showcase: brand/hero, services, team, gallery, booking, hours/location, contact/WhatsApp.
6. Exactly 3 template cards: Atelier, Oasis, Forge Men. Verify sample routes/slugs before linking. Do not infer routes from template ids. Use direct preview links only for verified published demo slugs. Make previews visually distinct and faithful.
7. How it works: configure business details/services/team/hours; personalize template/media; publish and share URL/QR; handle appointments and view notifications/insights. Avoid one-click and same-day.
8. FAQ: what is Menuun; who it serves; owner capabilities; customer view; appointment flow; bilingual support; owner access; payment recording vs payment gateway.
9. Final CTA to owner login / approved product demo.
10. Footer with only confirmed navigation/contact. Never invent contact data.

## 5. Claim verification / tests
Create a source-to-claim matrix in docs/design/homepage-product-alignment.md:
- marketing claim
- source file/component
- proof of capability
- permitted wording
- prohibited interpretation.

Add/update tests to fail for:
- stale template names Essential/Editorial
- unsupported claims such as multi-branch, payment gateway, deposits, payroll, memberships, loyalty, marketplace, reviews, automated marketing, invitations, free trial, free plan, guaranteed results, customer counts, ratings and fake testimonials
- CTAs to fake destinations or fake success
- fake values shown as real performance data
- missing owner-workspace + public-site product connection
- missing AR/EN translations or wrong dir
- loss of responsive, focus-visible or reduced-motion support.
Preserve all existing tests except assertions that directly encode outdated names or copy, which should be updated to verified new facts.

## 6. Implementation steps
1. Read AGENTS.md, .github instructions, project state, docs/AI_TOOLS_CATALOG_AR.md, README and relevant existing tests.
2. Inspect app/page.tsx, app/globals.css, layout, login/signup, public salon route, actual templates, and related components.
3. Inspect available sample salon slugs and verify each demo link before adding it.
4. Document product truth matrix, new design direction, section architecture, copy rationale, CTA routes, assets and deferred claims in docs/design/homepage-product-alignment.md.
5. Implement in focused components (e.g. app/components/homepage/*) where helpful. Avoid monolithic root component and CSS leakage.
6. Keep content static/SSG-friendly. Anonymous homepage must not query owner or customer records.
7. Do not modify owner behavior or public booking logic. Do not expose owner data or any service role credential.
8. Do not add Supabase tables, migrations, policies, env variables, route handlers, payment gateway, subscription behavior, auth settings, DNS or Vercel settings.
9. Run tests first / TDD for new homepage contracts.
10. Finish all copy in Arabic and English, verify RTL/LTR, mobile, accessibility and metadata.

## 7. Required verification
Run npm test, npm run typecheck, npm run build.
Run npm run test:e2e only if browser setup is present; report if blocked.
Browser QA of / at: 320x800, 360x800, 390x844, 768x1024, 1024x768, 1440x900.
Check keyboard-only navigation, focus, mobile nav, anchors, language switch, CTAs, reduced motion, contrast, alt text, console and network errors.
Confirm /login/ and /s/atelier-09 still load. Do not submit actual signup/login/booking.
Verify initial viewport shows both owner and customer product surfaces clearly.
Compare before/after screenshots where possible.
Confirm no owner/public salon route behavior changed.
Avoid expensive CI repetition; one coherent final local run and one PR CI run.

## 8. Git / release discipline
- Work only on feat/homepage-owner-product-alignment.
- Base is main. Do not edit main.
- Do not alter, rebase, merge, close, rewrite or push to PR #37, PR #35 or unrelated branches.
- Commit message suggestion: feat: align marketing homepage with owner product.
- Push and open a Draft PR to main; keep Draft until user reviews visuals and QA.
- Do not merge automatically.
- No production deployment, Vercel setting/domain edit, DNS edit, Supabase dashboard setting or migration.
- One PR preview at most. Verify before telling the owner it exists.

## 9. Arabic delivery report
Report verified changes, branch, commit SHA and Draft PR.
Report test commands and precise pass/fail.
Report preview URL/status if available.
Report visual QA viewports checked and evidence.
Report NOT VERIFIED / BLOCKED items.
Report changed files and risks.
Confirm production/domain/Auth/Supabase were not touched.
Do not claim a test, screenshot, commit, push, or deployment unless direct evidence exists.