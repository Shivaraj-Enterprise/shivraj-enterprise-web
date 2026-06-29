# Plan: React Bits + 3D revamp (full site, professional tone)

Transform every public page with React Bits animated components, a shader background, and an interactive 3D hero object — while keeping the existing shivraj-blue palette, typography, and copy so the site still reads as a serious B2B manpower brand.

## What the user will see

**Home (`/`)**
- New hero: Three.js `<Canvas>` with (a) a shader background (Aurora/Threads-style flowing gradient in shivraj blues) and (b) a slowly rotating, mouse-reactive 3D object (low-poly abstract industrial shape — interlocking torus/ico cluster) floating behind the headline. Existing TextType headline stays on top.
- Stats strip with `CountUp` (10+ years, 1500+ workers, 50+ clients, etc.).
- Service cards animate in with `TiltedCard` hover (subtle 3D tilt).
- Testimonials become a `InfiniteScroll`/marquee row of client logos + cards.
- Section reveals via `FadeContent` / `BlurText` on scroll.
- "Latest News" and "Service Areas" sections keep current content but gain scroll-reveal + hover lift.

**About / Services / Contact / Locations / Blog**
- Shared `AnimatedBackground` (very subtle Threads/Particles shader, low opacity) behind page headers so the brand feels cohesive.
- Page titles use `SplitText` or `BlurText` reveal.
- Section content uses `AnimatedContent`/`FadeContent` on scroll.
- Services rate-card rows animate in with stagger.
- Contact form gets a `GlareHover` accent on the submit button.
- Locations page: small rotating 3D globe/marker accent next to the map.

**Global polish**
- Sticky header gets a `GradientText` brand wordmark and subtle blur-on-scroll.
- Buttons gain a tasteful `ShinyText`/`GlareHover` variant for primary CTAs only.
- Page transitions: fade + slight slide between routes.
- Reduced-motion respected everywhere (`prefers-reduced-motion` disables 3D + shaders, falls back to static gradient).

## How it's built (technical)

**Dependencies**
- `three@^0.160`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122` (pinned — required for React 18).
- `gsap` (already used by some react-bits components) and `motion` (Framer Motion v11) for scroll/reveal animations.
- React Bits components copied directly into `src/components/reactbits/` from the official registry (`https://reactbits.dev/r/{name}.json`) — no MCP needed, the registry JSON contains the source. Components planned:
  - Backgrounds: `Aurora`, `Threads` (pick one for hero, one ultra-subtle for inner pages)
  - Text: `TextType` (already present), `SplitText`, `BlurText`, `GradientText`, `ShinyText`, `CountUp`
  - Components: `TiltedCard`, `GlareHover`, `InfiniteScroll`, `AnimatedContent`, `FadeContent`, `MagnetLines`
- `components.json` updated with the `@react-bits` registry entry for future installs.

**New files**
- `src/components/three/HeroScene.tsx` — R3F canvas: shader plane + rotating 3D shape, mouse parallax, suspense fallback.
- `src/components/three/SubtleBackground.tsx` — low-cost shader background for inner pages.
- `src/components/reactbits/*` — copied React Bits source files (one per component used).
- `src/hooks/useReducedMotion.ts` — gate 3D/shader mounting.

**Files edited**
- `src/pages/Index.tsx` — swap hero, wrap sections in reveal components, add stats strip.
- `src/pages/About.tsx`, `Services.tsx`, `Contact.tsx`, `Locations.tsx`, `Blog.tsx`, `BlogPost.tsx` — add `SubtleBackground` to page header, wrap content in reveal components, animate titles.
- `src/components/Header.tsx` — gradient wordmark, scroll blur.
- `src/components/Footer.tsx` — subtle gradient divider.
- `src/index.css` / `tailwind.config.ts` — add gradient tokens and shimmer keyframes; no palette change.
- `components.json` — add `registries["@react-bits"]`.

**Performance & safety**
- 3D canvas lazy-loaded with `React.lazy` + `Suspense`; never blocks first paint.
- Shader uses `dpr={[1, 1.5]}` cap and `frameloop="demand"` on inner pages.
- Mobile (<768px): hero 3D object hidden; shader background swapped for static CSS gradient.
- All animations honor `prefers-reduced-motion`.

**Out of scope**
- No backend/data changes. No copy rewrites. No palette change. Admin pages untouched.

## Acceptance
- Every public page has at least one React Bits reveal animation and the shared subtle background.
- Home hero renders a working 3D object + shader background on desktop, gracefully degrades on mobile / reduced-motion.
- Existing content, routing, SEO tags, and shivraj blue theme remain intact.
- No console errors; Lighthouse perf stays ≥ 70 on home.
