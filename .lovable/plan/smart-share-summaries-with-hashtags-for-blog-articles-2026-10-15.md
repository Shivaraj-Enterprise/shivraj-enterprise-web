# Smart share summaries with hashtags for blog articles

## Goal
When a visitor clicks a share button on any blog article, the share includes a short, ready-made summary of the article (what it is, how it helps, who it is for) plus relevant hashtags — instead of just a bare link.

## What changes

### 1. Share summary generator (new helper, e.g. `src/lib/shareSummary.ts`)
- Builds a short share text from the article's title, excerpt and tags:
  - One-line "what it is" hook from the title
  - One-line "who it's for / how it helps" from the excerpt
  - The article link
  - Hashtags generated from the article's tags plus brand tags, e.g. `#ManpowerSupply #VapiGIDC #LabourContractor #ShivrajEnterprise` (hashtags cleaned: no spaces, title case)
- Same generator used by all share buttons so every platform gets consistent text.

### 2. Update `src/components/blog/ShareButtons.tsx`
- **Twitter/X:** pre-filled tweet with the full summary + hashtags + link (Twitter supports this).
- **LinkedIn:** opens the LinkedIn share dialog with the link, and automatically copies the summary + hashtags to the clipboard with a toast "Summary copied — paste it into your LinkedIn post" (LinkedIn no longer accepts pre-filled text).
- **Facebook:** same approach — share dialog with the link, summary copied to clipboard for pasting.
- **WhatsApp share button (new):** `wa.me` link with the full summary + link — WhatsApp supports pre-filled text and is the most-used sharing channel for this audience.
- **Copy link button:** upgraded to "Copy share text" — copies the full summary + hashtags + link.
- **Mobile native share (Share2 button):** passes the summary text via the Web Share API so WhatsApp/LinkedIn/etc. apps receive the text automatically.

### 3. Wire into article pages
- `ShareButtons` already receives `url` and `title`; add an optional `excerpt` and `tags` prop.
- Pass excerpt/tags from `StaticArticleShell` (covers all static guides) and `BlogPost.tsx` (covers database articles) so every article gets a tailored summary.

## Technical details
- Pure string building in `shareSummary.ts` — no backend, no API calls.
- Hashtag helper: strips spaces/punctuation, capitalizes words (`vapi-gidc` → `#VapiGIDC`).
- Clipboard copy wrapped in try/catch with a toast fallback (same pattern as the existing copy button).
- Twitter text kept under 280 characters (summary trimmed if needed).
- No changes to SEO metadata or article content — share text is generated at click time.

## Verification
- Open a blog article, click each share button, confirm:
  - Twitter popup contains summary + hashtags + link
  - LinkedIn/Facebook open and the summary is on the clipboard
  - WhatsApp opens with the full pre-filled message
  - Copy button copies the full share text
- Type-check passes.
