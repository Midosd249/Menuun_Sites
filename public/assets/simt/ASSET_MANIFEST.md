# SIMT demo media manifest

All source files below were uploaded by the project owner and are intentionally kept with their original filenames in `public/assets/incoming/`.

## Applied to the demo

| Role | Source asset | Implementation |
|---|---|---|
| Hero video | `6686907_1791754412449871.mp4` | Muted, looping, inline video on desktop when the visitor has not requested reduced motion; a visible pause/play control is available. |
| Hero poster / still fallback | `1066622116_1791753577498806.jpg` | Used as the hero background and the video's poster; visible on mobile and with reduced motion. |
| Gallery image 1 | `285805423_1791753297769456.jpg` | First gallery image. |
| Gallery image 2 | `318993460_1791752791478768.jpg` | Second gallery image. |
| Gallery image 3 | `663714582_1791753491635583.jpg` | Third gallery image. |
| Location / space image | `840786121_1791753645708515.jpg` | Image in the visit/location section. |

## Held for review

- `84095817_1791753745029697.jpg`
- `997294713_1791753388609333.jpg`

These two files remain untouched in the incoming folder. Their filenames do not indicate whether they are finished brand imagery, portraits, or reference screenshots, so they have not been assigned to a visible content role without visual confirmation.

## Delivery and rights notes

- The incoming originals are not renamed or deleted.
- The video is loaded only for desktop viewports (768px and wider) when the system preference is `prefers-reduced-motion: no-preference`; other contexts use the still image.
- Images and video are served locally from this repository, not fetched from a third-party image CDN.
- This manifest records owner-supplied provenance only. Usage rights, image dimensions, image content, video duration/codec, and visual similarity to the supplied screenshot references have not been independently verified by the text-only GitHub connector. Run media inspection and browser visual QA before treating this demo as production-ready.
- Business identity, prices, team names, location, hours, and the booking journey remain illustrative. The booking flow does not create real appointments or send submitted details.
