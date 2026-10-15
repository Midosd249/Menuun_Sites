# Canonical Project Baseline

**Status:** Canonical baseline for ongoing development  
**Default branch:** `main`  
**Baseline merge commit:** `dd1e7961100330f8ffa93a3a11129a98b6683950`  
**Merged PR:** [#16 — Set canonical salon theme baseline](https://github.com/Midosd249/Menuun_Sites/pull/16)  
**Prior implementation branch:** `feat/three-theme-content-media-refresh`

## Rule for future work

Use `main` as the source of truth for all future development. Start new feature/fix branches from the latest `main`; do not use older feature branches as the base. Before continuing work from any existing branch, compare it with `main` and rebase or recreate it as appropriate so that already merged changes are not lost or accidentally reverted.

## Canonical theme scope

- **Atelier:** the service-card image/text overlap correction is Atelier-specific.
- **Oasis:** the full-width service-card layout with image on the right and content on the left in Arabic RTL is Oasis-specific; narrow screens have a vertical fallback.
- **Forge Men (فورج للرجال):** the former Rose Studio user-facing theme name and the charcoal/olive/bronze palette are canonical. The legacy `rose` internal template key is retained for route/configuration compatibility.
- Preserve each theme's identity. Do not apply one theme's service-card fix to the other themes.

## Shared functionality in the baseline

- Data-driven services and featured groom package with booking CTAs.
- Our Work gallery and dynamic barber/team profiles.
- Arabic/English content and RTL/LTR presentation.
- Owner-managed media and content, bilingual image alt text, contact/location information and opening hours.
- Supabase migration and RLS tests associated with the implementation.

## Validation record at merge time

The branch's latest recorded Static Quality workflow reported 52 tests passed, type-check passed, and Next.js build passed. Supabase RLS/pgTAP tests were reported passing, and the demo salon records were verified. Six theme/language preview routes returned HTTP 200 on the last available Vercel preview.

## Known limitations at merge time

- A fresh Vercel preview deployment was blocked by the account's daily deployment limit. The last available preview predates the latest Oasis column-ratio and opening-hours editor changes.
- Pixel-level browser screenshots at all requested viewport widths and a full interactive booking journey had not yet been completed.
- Default gallery/media records reference images hosted by Unsplash; these references are not binary copies in Supabase Storage. Owner-uploaded replacements are stored in Supabase Storage.
- Demo address, hours and other business details should be replaced/confirmed by the salon owner before real-world use.

## Recommended continuation workflow

1. Pull the latest `main`.
2. Create a short-lived feature branch from `main`.
3. Make a focused change and update relevant tests.
4. Run lint, type-check, build, tests and Supabase RLS tests where applicable.
5. Verify responsive layouts and booking/contact flows in a real browser.
6. Open a PR targeting `main`; merge only after reviewing CI and the diff.
7. Never apply production database changes or deploy production manually without explicit authorization.
