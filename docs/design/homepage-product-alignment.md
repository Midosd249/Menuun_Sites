# Homepage product alignment — claim and source matrix

## Product narrative

Menuun connects two distinct surfaces:
1. The private owner workspace, where an authorised salon owner or manager maintains business information and operations.
2. The public salon page, which renders only the business information that is active and published for customers.

The homepage uses static, illustrative UI panels. It does not query tenant data, appointments, customer records, or owner sessions.

## Claim-to-source matrix

| Homepage claim | Source of truth | Permitted wording | Do not imply |
|---|---|---|---|
| Manage salon details | `app/owner/page.tsx`, owner settings components | Update salon name, contact details, address, timezone and weekly opening hours | Multiple branch management or enterprise location hierarchy |
| Manage services | Owner services tab and service editor | Edit service names, descriptions, prices, durations and active state | Online checkout, deposits, recurring billing |
| Manage team profiles | Owner team tab and team editor | Maintain team profiles, specialties, availability and supported booking links | Payroll, shifts/payroll automation, staff invitations |
| Manage appointments | Owner appointments tab and appointment actions | Review, search, filter and update appointment statuses | Guaranteed instant confirmation, calendar integrations not evidenced |
| Notifications and insights | `app/owner/notifications-stats.tsx` | View owner notifications and available appointment/collection/business insights | Guaranteed revenue growth or invented KPI results |
| Salon branding and media | `app/owner/media-editor.tsx`, `app/owner/hero-video-editor.tsx` | Upload logo, gallery and hero media; select image/video mode | Unlimited storage or unrestricted media formats |
| Templates | `app/owner/template-picker.tsx` | Choose Atelier, Oasis or Forge Men | Essential, Editorial, Heritage, Gallery, or more than three live templates |
| Public salon page | `app/s/[slug]/page.tsx` | Display published salon identity, active services, team, media, hours, location and contact | Public access to private owner data, customer records or internal analytics |
| Appointment request | Public booking form and public salon page | Customers can use the supported appointment request flow | Payment processing or guaranteed acceptance/confirmation |
| Share page | `app/owner/qr-card.tsx` | Copy/share public URL and download/share QR | QR scan analytics unless separately implemented and verified |
| Bilingual experience | Public salon page and locale handling | Arabic RTL and English LTR on supported experiences | Every third-party or external destination is translated |

## Conversion and UX decisions

- Lead with the product's concrete audience: salons and barbershops.
- Demonstrate the owner workspace and public salon page together in the hero.
- Explain the relationship between the private owner workspace and published public content.
- Use one primary conversion path: owner sign-in. Account creation remains available from the existing sign-in route.
- Keep the sample salon link explicit as an example; do not present its data as Menuun adoption or customer proof.
- Present exactly three current templates: Atelier, Oasis and Forge Men.
- Repeat the owner sign-in action after the product explanation and at the page end.
- Avoid fabricated testimonials, customer logos, performance figures, ratings, and adoption counts.

## Visual system

The page uses the existing Menuun paper, ink, forest-green and lime palette. Product preview surfaces are HTML/CSS compositions with neutral sample labels and no live customer information. All styles are scoped below `.homepage-product` to avoid changing owner or tenant page layouts.

## Accessibility and responsive requirements

- Semantic header, navigation, main, sections and footer.
- Skip link and explicit navigation accessible name.
- Mobile navigation exposes `aria-expanded` and `aria-controls`, closes on selection and Escape.
- FAQ controls expose `aria-expanded` and `aria-controls`.
- Visible keyboard focus and reduced-motion overrides.
- Responsive layouts at narrow mobile, tablet and desktop widths.

## Verification status

Implementation source and static contract tests are committed on `feat/homepage-owner-product-alignment`. Runtime tests, TypeScript, production build and browser screenshots still require execution in a project runtime or CI. Do not infer their success from source inspection.
