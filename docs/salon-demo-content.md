# Salon demo content and media

The public salon page reads the replaceable demo catalog from `app/s/[slug]/salon-demo-content.ts`.

## Replaceable content

- `DEMO_SERVICES`: Arabic and English names/descriptions, durations, starting prices, and service photo sources.
- `GROOM_PACKAGE`: featured package copy, inclusions, duration, price, and image.
- `OUR_WORK_IMAGES`: six portfolio entries, each with Arabic/English alt text and category labels.
- `LOCATION_IMAGE`: fallback closing/location image, Arabic/English alt text, and focal-position metadata.
- `DEMO_CONTACT`: demo phone/WhatsApp, fictional Riyadh address, map destination, and hours.

For the demo slugs `atelier-*`, `oasis-*`, and `rose-*`, the presentation catalog is intentionally used so all three theme previews remain consistent. Stored service IDs are retained when present so those services can still use the existing booking RPC. If a catalog item has no stored service ID, its CTA uses WhatsApp rather than submitting a fabricated service ID to the database. The groom package similarly uses the current booking flow only if a real stored groom service exists; otherwise it opens WhatsApp.

## Demo data notice (internal only)

The Riyadh address and business hours are fictional presentation data, and the supplied phone number is demo contact data. They have not been verified as a real salon branch. Do not present this content as a verified business listing. Public UI intentionally avoids internal development notes.

## Image source and reuse status

The fallback image URLs in the content module use `images.unsplash.com` photo URLs with responsive width/quality parameters. They are used under the Unsplash License, which generally permits free commercial and personal use; individual images can still have separate trademark, privacy, or publicity considerations. Check the exact image and its context before using it for a real business.

- License: https://unsplash.com/license
- Reference for open-source booking patterns (not copied into this project): https://github.com/letsopencals/template-frisor — MIT-licensed template according to the project's published documentation.
- Additional reference implementation reviewed for patterns only: https://github.com/Ekwugha/barberShop — verify the repository's current LICENSE before copying any code.

No third-party source code was copied into this implementation. Theme-specific styling and existing Supabase booking logic remain part of this repository.
