# Website Design Quality Gate

## Before implementation
- Record target business, audience, conversion goal, content hierarchy, primary CTA, locale(s), and constraints.
- Review reference sites for patterns; do not copy protected source/assets without a license.
- Establish a distinct visual direction, typography, spacing, colors, imagery, motion, and responsive behavior.
- Track asset source, license, intended use, and final production asset separately from reference material.

## Every website must verify
- No accidental horizontal overflow at 320/360/390/430/768/1024/1280/1440px.
- Arabic RTL and English LTR have correct text alignment, layout order, navigation, forms, and icon direction.
- Mobile navigation opens/closes with touch and keyboard; Escape closes overlays and focus is managed.
- Buttons and links have meaningful destinations/actions and visible focus.
- Semantic headings, landmarks, labels, alt text, contrast, and reduced-motion support.
- Images have responsive sizes, correct aspect ratio, useful alt text, and no avoidable layout shift.
- Loading, empty, error, not-found, and offline/degraded states are designed.
- Long titles, long service names, large font settings, and missing images do not break layout.
- Page title, description, canonical URL, Open Graph, sitemap and robots behavior are appropriate.
- Keyboard-only critical path and automated accessibility smoke checks pass.

## Visual acceptance
Test on at least one Chromium desktop and mobile viewport; use additional browser engines when available. Capture screenshots for the homepage, services, gallery, contact/booking CTA, and management preview. Review screenshots rather than treating a successful build as proof of visual quality.

## Motion
Motion must communicate hierarchy or state, remain performant, respect reduced-motion preferences, and never block content or interaction.

## Release threshold
A site is not done because the code compiles. It is done only after responsive, locale, interaction, accessibility, performance, and publishing checks have evidence.
