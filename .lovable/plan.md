# Fix "Duplicate, Google chose different canonical than user"

## What Google reported
One page is affected: `/blog/scaling-operations-with-reliable-manpower-supply-services-in-vapi` (crawled 20 Oct). The page correctly says "I am my own main page", but Google decided another page on your site says the same thing and picked that one instead.

## Why it happens
- Your site has several articles on almost the same topic: "Scaling Operations with Reliable Manpower Supply Services in Vapi", "Manpower Supply Services", "Manpower Agency in Vapi GIDC", plus the `/services/manpower-supply-services` page. Google sees them as copies.
- There are also three near-identical "Facility Management Services India" articles (`facility-management-services-india`, `facility-management-services-india-2`, `optimizing-industrial-ops-with-facility-management-services-india`) — likely to be flagged next.
- While an article is still loading, the page shows no "main page" tag at all, so Google can briefly see a blank, identical-looking page.

## Fix
1. **Give the "Scaling Operations" article its own angle**: rewrite its title, summary and opening so it is about *scaling up headcount for peak seasons and new production lines* (not general "manpower supply"), and add a clear link to the main Manpower Supply Services page.
2. **Merge the facility-management copies**: keep the best one, unpublish the other two, and send their old addresses to the kept article so no visitor gets a "not found".
3. **Always show the main-page tag**, even during loading, on every article.
4. **Stop the weekly auto-writer making repeats**: before writing, it checks existing titles and skips topics already covered.
5. Update the sitemap (remove unpublished copies) and re-submit to Google and Bing.

## After publishing
In Search Console, open **Page indexing → Duplicate, Google chose different canonical than user** and click **Validate fix**. Google can take a few days to weeks.

## Technical details
- `BlogPost.tsx`: render `<Helmet>` canonical/title from `slug` before data loads; for unpublished duplicate slugs, client-redirect (`<Navigate replace>`) to the kept slug via a small redirect map, and set canonical to the kept URL.
- DB: update `title`, `excerpt`, opening paragraph of the scaling post; set `published=false` on the two duplicates.
- `auto-generate-article`: query existing titles/slugs and instruct the model to avoid overlapping topics; reject slugs ending in `-2`.
- Edge `sitemap` function already filters `published=true`; `public/sitemap.xml` — remove `optimizing-industrial-ops-...` entry if not kept.
- Re-run IndexNow submission.
