---
name: blog-post-design-prompt
description: Standard design prompt to apply whenever a new blog post page is created or auto-generated. Enforces premium, readable, modern layout inspired by Medium/Stripe/Vercel/Notion.
type: feature
---

# Blog Post Design Prompt (apply on every new post)

Use this prompt as the design/layout brief every time a new blog post page is created (manual or auto-generated via `auto-generate-article`). Feed it into any redesign request and honor it in the shared article shell (`StaticArticleShell.tsx`) and `BlogPost.tsx`.

## Goal
Clean, professional blog experience comparable to Medium, Notion, Stripe, Vercel, HubSpot, Framer — while keeping Shivraj Enterprise branding (`shivraj-*` tokens).

## Typography & Readability
- Body 18px, line-height 1.8.
- Paragraph spacing 24–32px; heading→paragraph spacing 32–48px.
- Max content width 750–850px, left-aligned.
- Responsive type; strong hierarchy H1→H2→H3.
- Highlight keywords with brand color. Fonts: Inter/Manrope/Geist. Avoid text walls.

## Layout
- **Hero:** large featured image, title, short description, author, publish date, reading time, category badge.
- **Article body:** spaced paragraphs, large headings, subheadings, bullet/numbered lists, quote blocks, callout boxes, dividers, code blocks, modern tables, FAQ accordion, conclusion.
- **Right sidebar (desktop, sticky):** ToC with active-heading highlight, reading progress, share buttons, recent + popular blogs, categories, blog search, newsletter card.
- **Bottom:** related articles, prev/next nav, CTA banner, contact section.

## Images
- Featured banner + image every 3–4 sections + icons beside key headings.
- Auto-generated placeholder banner from title + category when no image (`ArticleImage` + AI image gen).
- Responsive, rounded, soft shadow, lazy-loaded, no CLS.

## Cards
Use styled cards for Tips, Notes, Warnings, Success Stories, Stats, Facts, Key Takeaways.

## Animations (subtle, professional)
- Hero: fade-up, scale, animated gradient bg.
- On scroll: fade-up, slide-up, blur-to-clear, stagger.
- Images: zoom on hover, parallax, fade-in.
- Cards: lift + glow on hover, border animation.
- Buttons: scale, ripple, gradient hover.
- Sidebar sticky w/ smooth transition. Reading progress bar. Smooth accordion.

## Visual Design
Glassmorphism where appropriate, soft shadows, 16–20px radii, generous whitespace, 8px spacing system, professional gradients, subtle bg patterns, elegant dividers.

## Colors
Keep `shivraj-*` brand tokens. Neutral reading bg. High contrast (WCAG AA+).

## Components required
Reading time badge, category chips, tags, author card, social share, copy link, like, bookmark, scroll-to-top.

## Reading Experience
Sticky ToC w/ active highlight, progress bar, estimated read time, smooth anchor scroll, mobile-comfortable spacing.

## SEO (must ship with every post)
Semantic HTML, `BlogPosting` + `BreadcrumbList` + `FAQPage` JSON-LD, proper H1→H2→H3, optimized images w/ alt, meta tags, Open Graph, Twitter Cards.

## Performance & A11y
Lazy load, prevent CLS, optimized animations, keyboard nav, focus states, alt text, high contrast.

## Empty state
No image → auto-generate beautiful branded placeholder from title + category.

## Overall feel
Premium, elegant, modern, spacious, highly readable — comparable to top SaaS blogs while staying on-brand.
