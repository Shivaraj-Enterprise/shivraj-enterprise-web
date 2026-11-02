# Site-wide Animation Upgrade

Make the website feel premium and alive using the animation libraries you've added: Motion, Anime.js, GSAP, React Bits, Magic UI, Kokonut UI, OriginKit and Bklit charts. The site keeps its blue/white look, stays fast, still reads well for Google (all text stays real text), and respects visitors who turn off motion.

## Guiding rules
- Each section gets one standout effect. Effects are never stacked on the same section.
- Numbers, prices and headings stay readable as plain text on first load (this protects the SEO fixes already made).
- Heavy effects only run on desktop. Phones get lighter versions.
- Everything turns off for visitors who choose reduced motion, and in print/PDF.
- The admin pages stay unchanged.

## Phase 1 — Shared animation toolkit
Build a small set of reusable pieces so every page feels consistent:
- **Scroll reveal** (Motion): sections fade and slide up as you scroll.
- **Stagger grid** (Motion): cards appear one after another.
- **Magnetic button** (Motion): main "Get Quote" buttons pull slightly toward the cursor.
- **Shimmer / shiny button** (Magic UI): a moving light sweep on key call-to-action buttons.
- **Number ticker** (Magic UI): counts up only after the final number is already in the page text.
- **Page transitions** (Motion): a soft fade between pages.
- **Scroll progress bar** (Motion): thin blue bar at the top of long pages.

## Phase 2 — Homepage
- **Hero**: keep the blur-word heading; add a slow animated grid/particle background (OriginKit or React Bits) behind it.
- **Trust stats**: Magic UI number ticker plus the Kokonut activity rings already in place.
- **Services grid**: React Bits spotlight / tilted cards with a hover glow.
- **Client logos**: Magic UI marquee with edge fade.
- **"How we work" steps**: GSAP scroll-triggered line that draws between steps.
- **Testimonials**: Magic UI animated testimonial cards that rotate.
- **Final call-to-action**: Magic UI border-beam around the quote box.

## Phase 3 — Services and the 9 service pages
- Service cards: Motion hover lift and stagger entrance.
- Rate card table: rows slide in once (prices already visible as text).
- Header Services dropdown: smooth Motion open/close.
- FAQs: smooth height animation when opening answers.

## Phase 4 — About, Careers, Locations, Contact
- **About**: Magic UI animated timeline from 2016 to today; team/value cards with tilt.
- **Careers**: job cards with Motion filter animation (cards reshuffle smoothly when you pick Skilled / Semi-Skilled / Unskilled); Anime.js "Apply" success burst.
- **Locations**: animated pins pulsing on the area map / list.
- **Contact**: input focus glow; Anime.js check-mark animation after a successful send.

## Phase 5 — Labour Cost Calculator (charts)
- Replace the current cost breakdown bars with **Bklit charts**: an animated ring/pie for cost split (wages, PF, ESI, service charge, GST) and an animated bar chart for monthly totals.
- Charts re-animate smoothly when values change. Existing glass styling stays; print layout unchanged.

## Phase 6 — Blog
- Blog cards: hover image zoom and Magic UI "magic card" glow.
- Article page: reading progress bar already exists — refine with Motion; headings reveal on scroll; Key Takeaways card gets a subtle border beam.

## Phase 7 — Small delights
- Custom cursor highlight on desktop (OriginKit cursor), off on touch screens.
- Animated 404 page (Anime.js).
- AI chat button: gentle pulse to invite clicks; chat opens with a spring.
- Header shrinks and blurs smoothly on scroll.

## Phase 8 — Checks
- Test every page on desktop and phone in the preview.
- Confirm no text, prices or numbers are hidden from Google before animation.
- Confirm reduced-motion and print still work.
- Check page speed stays good (lazy-load heavy effects).

## Suggested order
Build Phase 1 + 2 first so you can see the new feel on the homepage, then approve the rest one phase at a time.

## Technical details
- Libraries: `motion` (motion/react) as the main engine; keep `framer-motion` only where existing components use it; `animejs` v4 for one-off SVG/burst effects; `gsap` ScrollTrigger only for the steps line.
- Install via shadcn registries: `@magicui/number-ticker`, `shiny-button`, `border-beam`, `marquee`, `magic-card`, `animated-list`; `@react-bits/spotlight-card`, background items; `@bklit/ring-chart`, `@bklit/bar-chart`, `@bklit/chart-tooltip`; OriginKit components fetched via its MCP for React + Tailwind.
- Shared wrappers in `src/components/motion/` (Reveal, Stagger, Magnetic, PageTransition) with `useReducedMotion` guards.
- Colors only via existing `shivraj-*` / semantic tokens; chart colors via `--chart-*` mapped to brand blues.
- Heavy backgrounds lazy-loaded with `React.lazy` and disabled under `(max-width: 768px)`.
- Calculator styles stay scoped under `.calculator-page`; print CSS hides animated layers.
