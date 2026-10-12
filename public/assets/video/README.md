# Homepage video

## Primary file
- `atelier-09-hero.mp4` — the primary homepage hero video.
- Optional `atelier-09-hero-mobile.mp4` — mobile-specific cut if needed after performance testing.

Recommended: MP4 / H.264, 1920 × 1080, 24–30 fps, 8–15 seconds, seamless loop, muted, no audio track, target 4–10 MB where quality allows. Keep a high-quality master outside the production repository.

## Nano Banana Pro / video-generator prompt
Generate a photorealistic cinematic 10-second seamless-loop fashion film for ATELIER 09, a premium contemporary men's grooming atelier. A barber in a charcoal apron performs precise, calm finishing work on a male client's haircut. Macro details of comb, clippers, hands, hair texture, mirror reflections and brushed metal; dark walnut and charcoal interior; warm practical lights; subtle muted olive-lime highlights; shallow depth of field; deliberate, elegant camera movement; authentic human motion; premium European grooming campaign mood, adapted to a Riyadh studio. Keep the camera movement slow and controlled; maintain continuity between first and last frames so the loop feels seamless. Landscape 16:9, no cuts that feel abrupt, no dialogue, no music, no text, no logos, no watermark.

## Critical playback requirements
- Keep the HTML video element configured with `autoplay muted loop playsinline`.
- Always provide a poster image.
- Never replace the video with a still image when playback fails; keep the poster as graceful fallback only.
- Verify playback on iOS Safari and Android Chrome. Mobile browsers may delay autoplay until the video is muted and metadata is available.
- Compress the video and avoid unnecessary audio tracks to protect page speed.
