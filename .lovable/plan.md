# Fix "Video isn't on a watch page" in Google Search Console

## Why the last fix didn't work
Your Google report lists 11 pages (About, Contact, Locations, Terms and several Services pages), all pointing to the same moving background video at the top of each page. Blocking the video file stops Google from downloading it, but Google still sees a video on each page and keeps reporting it. The only reliable fix is to stop putting an actual video on these pages.

## What will change
- The moving background at the top of pages will become a still image taken from the same video. It will have a slow, gentle zoom and the glowing blue light effects, so it still looks animated and on-brand.
- No video will be on any page, so Google has nothing to report.
- Pages will also load faster, especially on mobile, because visitors no longer download a 14 MB video.
- Page content, links and rankings stay the same.

## After publishing
1. Publish the site.
2. In Search Console, go to Video indexing, open "Video isn't on a watch page" and click **Validate fix** again.
3. Google rechecks pages over the next few days to weeks.

## Technical details
- Grab a frame from `blog-hero.mp4` with ffmpeg, then save it as an optimized WebP in `src/assets/hero-bg.webp`.
- In `src/components/three/AuroraBackground.tsx`, swap the `<video>` for an `<img>` (decorative `alt=""`, `aria-hidden`, `loading="lazy"`, `decoding="async"`) with a slow scale animation that respects reduced motion. Keep the gradient overlay, blobs and grid. Keep the `video` prop name so callers don't need changes.
- Check for other `<video>` usages in Index/Blog/Services. Apply the same treatment to any that point to the same decorative clip.
- Keep the `Disallow: /*.mp4$` rules in robots.txt.
- Test on /about and /services/fitter-labour with Playwright: no `<video>` in the page and the header looks right.
