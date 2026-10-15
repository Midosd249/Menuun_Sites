# ATELIER 09 — Asset Library

This directory is the single, organized home for replaceable visual assets for the ATELIER 09 demo.

## Folder map
- `images/branding/` — final logo exports and brand marks.
- `images/hero/` — still-image fallback/poster for the homepage hero video.
- `images/services/` — service-card photography used by the booking flow and services section.
- `images/gallery/` — portfolio/editorial gallery photography.
- `images/barbers/` — barber portraits used in the booking wizard.
- `video/` — homepage cinematic loop and optional alternate cuts.

## Rules
1. Use the exact filenames listed in each folder README unless the page references are updated in the same change.
2. Keep generated originals and prompt history outside production assets; only place final approved exports here.
3. Prefer WebP for photos (AVIF is also fine if browser support is considered); use PNG for transparent logos, SVG for clean vector marks, and MP4/H.264 for video.
4. Do not commit huge uncompressed originals. Optimize images and video for web delivery.
5. Never remove the hero video or change the video source to a still image as a substitute. The video is the chosen art direction.
6. Keep descriptive alt text in HTML and verify both desktop and mobile crops after swapping assets.
7. All asset paths should be root-relative (for example, `/assets/images/branding/atelier-09-logo.png`) once the local asset is installed.

See each folder's README for exact filenames, dimensions, generation prompts, and quality checks.
