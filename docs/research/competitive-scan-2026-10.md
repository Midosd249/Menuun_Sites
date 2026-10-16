# Competitive and open-source scan — 2026-10

**Scope:** Public product pages and official repositories reviewed 16 October 2026. This is product research, not a design/code reference. No competitor screenshots, text, assets, or source code are copied into Menuun.

## Feature matrix

| Product | Public booking / acquisition | Owner strengths evidenced by official pages | Gap/opportunity for Menuun (inference) |
|---|---|---|---|
| Fresha | 24/7 booking, marketplace, waitlist, upfront payments | Client profiles/notes, SMS/email/app reminders, CRM, loyalty, finance/client/team reports, checkout and team permissions | Win with faster Arabic-first setup, a tenant-owned brand page, and straightforward local collection workflow. |
| Booksy | 24/7 booking, marketplace, service photos and reviews | Client cards/tags/notes, reminders, configurable calendar, checkout, deposits/cancellation fees, revenue/cash-flow reports, staff performance | Offer an uncluttered owner inbox and reliable appointment-to-payment trace before adding broad CRM features. |
| Vagaro | Booking site and marketplace, online booking and social sources | Customizable dashboard widgets, new-vs-returning, booking percentage, sales trends, appointment distribution, notifications and sales breakdown | Prioritize a small set of explainable metrics with clear date bases and low-data safeguards. |
| Setmore | Shareable booking page, website plugin, social booking, QR | Calendar across devices, payments, automatic confirmations, email/SMS reminders, recurring appointments | Menuun's QR and public page are a useful base; add explicit self-service changes and operational follow-up later. |
| Square Appointments | Branded booking website, QR, web widget, marketplace | SMS/email reminders, Google Calendar sync, no-show fees, waitlist, multi-location/time-zone support, staff appointments and checkout | Local-market availability matters: do not assume US payment rails fit Saudi salons. |
| Planity | 24/7 booking, salon listing, social booking, waitlist | Synchronized staff calendars, automated SMS reminders, deposits/prepayment, cancellation policies, checkout and verified reviews | Keep the public page owner-branded and simple; defer marketplace economics and POS complexity. |

## Saudi Arabia / GCC signals

- **Shareek Salon** ([shareek.app](https://shareek.app/en)) markets Saudi salon operations: branded booking links, deposits, WhatsApp notifications, packages, financial reports, staff roles and ZATCA-ready invoices.
- **Mahjoz** ([mahjoz.io](https://mahjoz.io/en)) positions itself for Saudi service businesses with booking, WhatsApp reminders, POS, employee app, and ZATCA Phase 2 / local payment integrations.
- **Watily** ([watily.com](https://watily.com/booking-system/en/)) markets Arabic-first appointment booking, WhatsApp reminders, deposits, team calendars and post-visit review requests.
- **Mawid** ([mawid.ai](https://mawid.ai/)) describes Gulf-focused booking links shared through Instagram/WhatsApp, Arabic/English, Hijri/Gregorian calendar support and business-specific booking flows.

**Market inference:** A Saudi barbershop owner is likely to value a public booking link that works from WhatsApp/Instagram, clear SAR amounts, Arabic RTL quality, local time correctness, and a fast owner inbox before complex marketplace discovery. These are positioning signals from vendor claims, not independently verified usage/adoption metrics.

## Open-source references and license notes

| Source | License evidence | Useful idea only; no code/design copying |
|---|---|---|
| [Cal.diy repository](https://github.com/calcom/cal.diy) | MIT license stated in repository | Availability-first scheduling and clear separation of booking settings from calendars. Cal.com’s historical/main product licensing differs; verify the exact repository and package license before any dependency decision. |
| [Easy!Appointments](https://github.com/alextselegidis/easyappointments) | GPL-3.0 stated in repository | Self-hosted appointment workflow and service/provider concepts. **Ideas only** under this project's no-GPL/AGPL-copy rule. |
| [Rallly](https://github.com/lukevella/rallly) | AGPL-3.0 stated in repository | Low-friction shared scheduling and notification patterns. **Ideas only**; no code, CSS, copy, or assets reused. |
| [Recharts](https://github.com/recharts/recharts) | MIT | Candidate for simple accessible daily trend and revenue charts; not installed by this scan. |
| [TanStack Table](https://github.com/TanStack/table) | MIT | Candidate if the appointment list grows to require sorting, filtering, and pagination. |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) | MIT | Candidate for validated owner settings forms if current native forms become hard to maintain. |
| [Radix Primitives](https://github.com/radix-ui/primitives) | MIT | Candidate accessible primitives for menus, dialogs, and sliders; retain Menuun's own visual system. |
| [Zod](https://github.com/colinhacks/zod) | MIT | Candidate for shared form/API validation schemas. |
| [next-intl](https://github.com/amannn/next-intl) | MIT | Candidate for typed locale dictionaries and App Router locale handling; assess bundle and migration cost first. |
| Native Web Audio API | Browser API; no third-party library license | Prefer a small local oscillator helper over adding an audio dependency for a two-tone booking alert. |

License names above are from the cited official repository/license pages where available. Before adding a package, re-check the exact package version, transitive dependency licenses, and any dual-license terms. GPL/AGPL sources are not implementation sources for Menuun.

## Ten recommendations ranked by impact / effort

| Rank | Recommendation | Impact | Effort | Decision |
|---:|---|---|---|---|
| 1 | Make every new booking visible in a localized notification centre with sound state, deduplication and recovery when Realtime disconnects | High | Medium | Implement/verify now |
| 2 | Keep the salon's Arabic/English business name authoritative across public page, metadata, QR/share and owner settings | High | Low | Implemented in PR C; browser verification still needed |
| 3 | Make mobile owner cards one-column, status labels localized, and all controls fit at 270–430px | High | Medium | Implemented partially; Playwright matrix is the release proof |
| 4 | Distinguish completed work, expected collection, and actually collected revenue with explicit scheduled-date vs payment-date labels | High | Medium | Existing baseline; expand in PR D |
| 5 | Add per-staff completed jobs, collected/awaiting amounts, and utilization against opening hours, including Unassigned | High | Medium | PR D scope |
| 6 | Show a daily trend and prior equal-period comparison; suppress insights when samples are too small | High | Medium | PR D scope |
| 7 | Normalize and validate social links, preserve clearable values, and render only valid HTTPS links | Medium | Low | Implemented partially in PR C; live UI verification needed |
| 8 | Add customer self-service cancel/reschedule with tenant-safe tokens and explicit policy | High | High | Backlog; design/API/security first |
| 9 | Add WhatsApp reminders with consent, delivery status, opt-out, and provider failure handling | High | High | Backlog; provider/privacy/compliance review first |
| 10 | Add customer CRM, reviews, deposits, loyalty, marketplace discovery and POS integrations | Medium–High | High | Backlog; validate demand and Saudi provider fit before selecting |

## Backlog candidates — not built in this scan

1. WhatsApp reminders and one-tap confirm/cancel/reschedule.
2. Customer self-service cancellation/rescheduling with secure, expiring links.
3. Client list/CRM with normalized phone, visit history, notes, consent and export.
4. Review request and moderation workflow.
5. Optional deposits/prepayment after local payment-provider and refund-policy review.
6. Waitlist, abandoned-booking recovery, loyalty and packages.
7. ZATCA/Mada/STC Pay integrations only after a specific provider/compliance plan is approved.
8. More detailed team permissions and per-staff calendar views.

**Research limitations:** Official marketing pages are feature claims, not hands-on product testing. Public owner-dashboard details were especially available from Vagaro's support documentation; some competitor dashboards require login/demo access. No private account was accessed and no competitor UI was cloned.
