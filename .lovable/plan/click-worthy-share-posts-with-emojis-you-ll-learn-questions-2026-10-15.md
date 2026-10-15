# Click-worthy share posts with emojis, "you'll learn" questions and auto cover images

## Goal
Make every shared blog article look like a polished post from a big brand: an eye-catching hook with emojis, 3 questions the article answers, a clear call to read, hashtags, and a branded cover image that appears automatically in LinkedIn, Facebook, WhatsApp and X previews.

## 1. Richer share text (all platforms)
Each share message becomes:

```text
🚀 GST & TDS on Manpower Supply — Explained Simply

❓ What you'll find answered:
✅ Is GST charged on the full invoice or only the service fee?
✅ When does TDS apply and at what rate?
✅ How do you avoid penalties?

👷 Who it's for: factory owners, HR & purchase teams in Vapi GIDC
⏱️ 6-min read

👉 Read the full guide: <link>

#GST #TDS #ManpowerSupply #VapiGIDC #ShivrajEnterprise
```

- Questions taken from the article's own FAQ (first 3); if none, built from its section headings.
- Emoji picked by topic (💰 cost, ⚖️ compliance, 🏭 factory, 📊 guide), reading time auto-calculated.
- X/Twitter gets a shorter version that fits 280 characters (hook + 2 questions + link + hashtags).

## 2. Platform-specific styles (new option)
A small "Share" menu with a choice of tone before sharing:
- **Professional** (LinkedIn style: insight + questions + hashtags)
- **Quick & catchy** (X/WhatsApp style: short hook, emojis)
- **Question teaser** ("Do you know…? Find out 👇")
A live preview shows exactly what will be posted, with an "Edit before sharing" box.

## 3. Automatic cover image for every article
- A branded cover (1200×630) is generated once per article: article title, company logo, blue brand colours, topic illustration.
- Saved and reused, then set as the article's social preview image so LinkedIn/Facebook/WhatsApp show it.
- A "Download cover image" button in the share menu so you can attach it to Instagram or LinkedIn posts manually.

## 4. Extra features added
- **"Share a quote"** — select any sentence in the article and a floating "Share this" button appears (like Medium), sharing that line with the link.
- **QR code** in the share menu — scan or download, handy for printing on quotations or showing clients.
- **Share via Email** button with a ready subject and body.
- **"What you'll learn" box** at the top of each article, showing the same 3 questions — makes readers want to keep reading.

## Technical details
- `src/lib/shareSummary.ts`: add `faqQuestions`, `readMinutes`, `tone`; topic-emoji map; templates per tone.
- New `src/components/blog/ShareMenu.tsx` (dialog with tone selector, editable preview, cover download, QR, email) using existing dialog component; `ShareButtons.tsx` opens it.
- New `src/components/blog/QuoteShare.tsx` (selection listener → floating button) mounted in `StaticArticleShell`.
- New `src/components/blog/WhatYouLearn.tsx` rendered near the top of `StaticArticleShell`.
- Cover images: new edge function `generate-cover-image` using the AI image model, cached in storage + a `cover_image_url` reference (reuse `article_images` with section_key `cover`); static guides get covers pre-generated now; weekly auto-articles generate theirs on publish.
- `og:image` / `twitter:image` meta tags set per article via Helmet (shared crawlers read these; a pre-render note: since the site is a single-page app, sitemap-level meta for static guides will be added to make previews reliable).
- QR code via a small library (`qrcode.react`).

## Verification
Open an article: preview shows emojis/questions; each tone changes text; X stays under 280; cover appears and downloads; quote-share works on text selection; QR and email work; type-check passes.
