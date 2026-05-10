## Goal
Make the Shivraj logo visible across the entire site — not just the header — so brand identity is reinforced on every page.

## Current state
- Logo exists at `src/assets/logo.png` and `public/favicon.png`
- Already shown in `Header.tsx` (visible on all pages via `Layout`)
- NOT shown in: Footer, page hero sections, or as a watermark/branding element on individual pages

## Proposed changes

### 1. Footer (`src/components/Footer.tsx`)
Add the logo above/beside the "SHIVRAJ ENTERPRISE PVT. LTD." heading in the company info column. White/light background circle so the dark-blue logo stays visible on the dark footer.

### 2. Page hero sections
Add a small logo badge centered above the H1 in each page header:
- `src/pages/Index.tsx` — hero section
- `src/pages/About.tsx` — page header
- `src/pages/Services.tsx` — page header
- `src/components/contact/PageHeader.tsx` — contact hero
- `src/pages/Terms.tsx` — page header

Logo will appear in a small white rounded container (~64px) above the title for consistent branding.

### 3. 404 page (`src/pages/NotFound.tsx`)
Add logo above the "404" message.

### 4. Favicon / browser tab
Already configured (`/favicon.png` in `index.html`) — no change needed.

### 5. Open Graph image
Currently uses an old social image URL. Optionally swap to use the logo, but this affects link previews — leaving as-is unless you want it changed.

## Out of scope
- No layout/color redesign
- No changes to form fields or business logic
- No new logo variants generated (uses existing `src/assets/logo.png`)

## Question
Should the logo also replace the current OG/social-share preview image, or keep the existing social image?
