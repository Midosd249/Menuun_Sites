# Competitive and open-source scan — 2026-10

Reviewed official product/repository pages on 16 October 2026. This is product research only. No competitor code, screenshots, copy, designs or assets were copied.

## Feature matrix

| Product | Public booking | Owner-side strengths evidenced by official pages | Menuun opportunity (inference) |
|---|---|---|---|
| Fresha — [features](https://www.fresha.com/for-business/features) | 24/7 booking, marketplace, waitlist | CRM/client notes, reminders, deposits, checkout, loyalty, finance/client/team reports and permissions | Stay focused on an owned branded page, Arabic-first setup and simple collection tracking. |
| Booksy — [features](https://biz.booksy.com/features) | 24/7 booking, marketplace, reviews/photos | Client cards/tags, reminders, configurable calendar, checkout, deposits/cancellation fees, revenue and staff-performance reports | Build a clear booking inbox and appointment-to-payment trace before adding broad CRM. |
| Vagaro — [Pro](https://www.vagaro.com/pro), [dashboard reports](https://support.vagaro.com/hc/en-us/articles/12731739712667-Dashboard-Reports) | Booking site, marketplace, social sources | Customizable widgets, appointment-source distribution, new vs returning, booking percentage, sales trends and projected sales | Use a small set of explainable KPIs with explicit date bases and low-data safeguards. |
| Setmore — [features](https://www.setmore.com/features) | Shareable booking page, website/social links, QR | Multi-device calendar, payments, confirmations, email/SMS reminders, recurring bookings | Preserve Menuun's simple QR/public page and later add secure self-service changes. |
| Square Appointments — [features](https://squareup.com/us/en/appointments/features) | Branded booking site, QR/widget, marketplace | SMS/email reminders, calendar sync, no-show fees, waitlist, multi-location/time-zone support, staff appointments and checkout | Do not assume US payment rails fit Saudi salons; local provider fit is a prerequisite. |
| Planity — [Pro](https://info.planity.com/solution/logiciel-rendez-vous) | 24/7 booking, social booking, waitlist | Synchronized staff calendar, SMS reminders, deposits/prepayment, cancellation policies, checkout and verified reviews | Keep the owner-branded public page simple; defer marketplace and POS complexity. |

## Saudi Arabia / GCC signals

- **Shareek Salon** ([shareek.app](https://shareek.app/en)): Saudi salon positioning, branded booking links, deposits, WhatsApp notifications, packages, reports and ZATCA-ready invoices.
- **Mahjoz** ([mahjoz.io](https://mahjoz.io/en)): Saudi service-business positioning, booking, WhatsApp reminders, POS, employee app, ZATCA Phase 2 and local payment integrations.
- **Watily** ([booking system](https://watily.com/booking-system/en/)): Arabic-first booking, WhatsApp reminders, deposits, team calendars and post-visit review requests.
- **Mawid** ([mawid.ai](https://mawid.ai/)): Gulf booking links for Instagram/WhatsApp, Arabic/English, Hijri/Gregorian calendar and business-specific booking flows.

**Inference:** For a Saudi salon, public links that work in WhatsApp/Instagram, Arabic RTL quality, SAR formatting, Riyadh-time correctness, and a fast owner inbox are likely to matter more immediately than a marketplace. Vendor claims are not independent adoption/quality measurements.

## Open-source and permissive libraries

| Source | License stated by official repository | Safe use for ideas / candidate dependencies |
|---|---|---|
| [Cal.diy](https://github.com/calcom/cal.diy) | MIT | Availability-first scheduling concepts. Cal.com has a distinct history/licensing; verify the exact repository/package before any dependency decision. |
| [Easy!Appointments](https://github.com/alextselegidis/easyappointments) | GPL-3.0 | Self-hosted scheduling concepts only. **No code, CSS, text or assets reused.** |
| [Rallly](https://github.com/lukevella/rallly) | AGPL-3.0 | Low-friction scheduling/notification concepts only. **No code, CSS, text or assets reused.** |
| [Recharts](https://github.com/recharts/recharts) | MIT | Candidate for daily trend and revenue charts. |
| [TanStack Table](https://github.com/TanStack/table) | MIT | Candidate for sortable/filterable appointment tables. |
| [React Hook Form](https://github.com/react-hook-form/react-hook-form) | MIT | Candidate if owner form complexity grows. |
| [Radix Primitives](https://github.com/radix-ui/primitives) | MIT | Accessible primitives; retain Menuun's own visual system. |
| [Zod](https://github.com/colinhacks/zod) | MIT | Shared runtime validation for settings/API payloads. |
| [next-intl](https://github.com/amannn/next-intl) | MIT | Candidate for typed App Router locale dictionaries; evaluate migration cost first. |
| Native Web Audio API | Browser API | Keep a tiny local oscillator helper rather than add a sound dependency for a two-tone alert. |

License labels are based on the linked official repository/license pages. Re-check the exact package version and transitive dependencies before adoption. GPL/AGPL projects are ideas-only under Menuun's rule.

## Ten ranked recommendations

| # | Recommendation | Impact / effort | Decision |
|---:|---|---|---|
| 1 | Reliable localized booking inbox, sound state, deduplication and disconnect recovery | High / Medium | Implement and verify now |
| 2 | Preserve owner-entered names across page, metadata and share/QR | High / Low | PR C implementation; browser proof still required |
| 3 | Single-column mobile owner cards, contained controls and localized statuses | High / Medium | PR C partial; Playwright is release proof |
| 4 | Separate completed work, expected collection and collected revenue with explicit date bases | High / Medium | Expand in PR D |
| 5 | Per-staff completed/collected/awaiting and utilization against opening hours, including Unassigned | High / Medium | PR D |
| 6 | Daily trend, prior equal-period comparison and rule-based insights hidden on thin data | High / Medium | PR D |
| 7 | Validated editable social links and only filled public links | Medium / Low | PR C partial; verify with browser |
| 8 | Secure customer self-service cancel/reschedule links | High / High | Backlog; security/policy design first |
| 9 | WhatsApp reminders with consent, delivery status, opt-out and provider recovery | High / High | Backlog; provider/privacy review first |
| 10 | CRM, reviews, deposits, loyalty, waitlist and POS integrations | Medium–High / High | Backlog; validate demand/provider fit first |

## Backlog candidates — not built by this scan

1. WhatsApp reminders and one-tap confirmation/cancel/reschedule.
2. Secure expiring self-service cancellation/rescheduling links.
3. Client list/CRM with normalized phone, visit history, notes, consent and export/deletion.
4. Post-visit reviews and moderation.
5. Deposits/prepayment after local provider/refund review.
6. Waitlist, abandoned-booking recovery, loyalty and packages.
7. ZATCA/Mada/STC Pay/Apple Pay integrations after provider and compliance validation.
8. Expanded team permissions, per-staff calendar and commissions.

**Limitations:** These are official marketing claims, not hands-on product tests. Some owner dashboards require a login/demo. No private account was accessed.
