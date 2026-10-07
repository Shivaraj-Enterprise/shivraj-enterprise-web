# SEO Fix: Remove Generic Cleaning Terms, Refocus on Industrial Manpower

## Goal
Stop attracting irrelevant consumer traffic ("clean up company", "cleaning services near me", "home cleaning services vapi", "house cleaning") and refocus all SEO on high-value B2B searches: labour contractor, manpower supply, and industrial housekeeping in Vapi GIDC.

## Changes

### 1. Homepage (index.html)
- **Title:** `Shivraj Enterprise | Labour Contractor & Manpower Supply in Vapi GIDC`
- **Meta description:** `Licensed industrial labour contractor and manpower supply services in Vapi GIDC, Gujarat. Skilled, semi-skilled & unskilled factory workers with PF, ESIC & GST compliance.`
- Update og:title, og:description, twitter tags to match.
- LocalBusiness schema: remove any generic "cleaning services" wording; add `"alternateName": "Shivraj Enterprises"` to capture the plural brand search (currently position 12.5).

### 2. Organization schema (src/components/contact/SchemaOrg.tsx)
- Remove generic cleaning phrasing from `description`.
- Add `"alternateName": "Shivraj Enterprises"`.

### 3. Services page (src/pages/Services.tsx)
- Reword the industrial housekeeping service card and copy so it says **"Industrial Housekeeping for Factories & Plants"** — factory/plant/facility context only, never "cleaning services" or "home cleaning".
- Adjust the FAQ item mentioning housekeeping to keep it industrial-only.
- Update page title/meta to lead with `Labour Contractor & Manpower Supply Services in Vapi GIDC`.

### 4. Housekeeping service subpage (src/data/servicePages.ts)
- For the `industrial-housekeeping-services` entry: replace consumer-style terms ("cleaning services", "clean up") with "industrial housekeeping", "factory housekeeping", "plant housekeeping".
- Update its meta title/description and FAQ answers the same way.

### 5. AI chat knowledge (supabase/functions/_shared/site-knowledge.ts)
- Remove generic cleaning terms so the AI sales agent also describes housekeeping as industrial-only.

### 6. Sitemap & IndexNow
- No URL changes, so no sitemap edits needed. After publish, resubmit all pages to Bing with the live IndexNow key so the updated titles/descriptions get re-crawled quickly.

## What stays untouched
- No page URLs change (no redirects needed).
- Industrial housekeeping remains a service — only the wording changes from consumer "cleaning" to industrial "housekeeping".
- Calculator, blog, admin, and contact pages are not modified.

## Expected result
- Google stops showing the site for home/residential cleaning searches.
- Rankings consolidate on: `labour contractor in vapi gidc`, `manpower supply services vapi`, `factory helper contractor`, `industrial housekeeping services`.
- "Shivraj Enterprises" plural brand search moves toward position 1.

## Verification
- Type-check and build pass.
- Grep the codebase to confirm no remaining instances of "clean up company", "cleaning services near me", "home cleaning", "house cleaning".
- After publish: resubmit all sitemap URLs via IndexNow and confirm acceptance (status 202).
