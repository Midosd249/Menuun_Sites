# SIMT demo media manifest

All source media was supplied by the project owner in `public/assets/incoming/`, then organized into `public/assets/simt/` for use by the demo. The original filenames are preserved.

## Media roles

| Role | Source asset | Implementation |
|---|---|---|
| Cinematic hero video | `6686907_1791754412449871.mp4` | Muted, looping desktop enhancement with a visible pause/play control. |
| Hero poster | `1066622116_1791753577498806.jpg` | Hero still and video poster; visible on mobile and for reduced-motion visitors. |
| Classic-cut service | `997294713_1791753388609333.jpg` | Thumbnail for the classic haircut service. |
| Fade service | `285805423_1791753297769456.jpg` | Thumbnail for the fade service and first gallery image. |
| Beard service | `663714582_1791753491635583.jpg` | Thumbnail for beard grooming and third gallery image. |
| Cut + beard service | `1066622116_1791753577498806.jpg` | Thumbnail for the combined service. |
| Groom ritual service | `840786121_1791753645708515.jpg` | Thumbnail for the groom ritual service. |
| Gallery / haircut detail | `997294713_1791753388609333.jpg` | Second gallery image. |
| Interior / location | `318993460_1791752791478768.jpg` | Location/space image. |
| Barber profile | `84095817_1791753745029697.jpg` | Local portrait for the first illustrative barber profile. |

## Reference screenshots

The nine screenshots of the MAREA Barber Club site were visually reviewed and moved out of `public/assets/` into `docs/design-references/`, preserving their filenames. The screenshot inventory and the design decisions derived from them are documented in `docs/design-references/README.md`. They are references only, not content images for SIMT.

## Visual direction adopted

- Keep SIMT's own identity; do not reuse MAREA's logo, name, copy, or exact page composition.
- Adapt the reference's forest-green / near-black contrast, warm ivory sections, restrained gold detail, teal booking CTA, and photo-led service discovery.
- Preserve the existing interactive demo booking journey and the cinematic hero.
- Keep the page usable without video: only load the video on viewports at least 768px wide when `prefers-reduced-motion: no-preference` matches. Mobile and reduced-motion visitors see the still image. The desktop hero includes a pause/play control.

## Delivery and rights notes

- All media filenames and file contents were preserved while moving from the upload inbox to the final SIMT asset directory.
- Media content has been visually inspected for role assignment, but image dimensions, video duration/codec, color profile, and file optimization have not been independently validated with a media-processing tool.
- Owner-supplied provenance is recorded; commercial usage rights are not independently verified.
- Some barber portraits remain remote placeholders because only one supplied asset is clearly a portrait.
- Business identity, prices, team names, location, hours, and the booking journey remain illustrative. The booking flow does not create real appointments or send submitted details.
- Before a real customer launch, verify rights, optimize images to modern responsive formats, inspect video encoding and poster frame, run browser visual QA at supported widths, and replace all fictional business data.
