# Weekly trending blog article (fresh topics every week)

## Goal
Every Monday at 9 AM (India time), publish one new English article on a topic that is trending right now and fits Shivraj Enterprise. Topics are never chosen from a fixed list. Each week starts with a fresh search, so the blog keeps up with current searches.

## Every Monday: three helpers working in order
1. **Trend finder.** Searches the internet and news from the **last 7 days**. It looks for topics linked to manpower, labour, HR, factory work and compliance, including:
   - Local: Vapi GIDC, Valsad, South Gujarat, Daman, Silvassa
   - India: minimum wage notices, Labour Codes, EPF/ESIC/GST changes, hiring trends
   - Global: workforce and staffing trends, factory safety, automation and labour
   - Coming soon: announced dates such as wage revisions, Labour Code start dates, budget changes, festive hiring and monsoon safety. Articles on these go out early, before searches peak.
   - Wider trending topics that still fit the company, such as factory heatwave safety or worker migration after festivals
   It produces a fresh list of about 8 to 10 topics, each with its source link.
2. **Topic picker.** Searches again to check how much people search for each topic and who already ranks for it. It removes anything too close to an existing article, then picks the one topic most likely to bring visitors and buyer enquiries. Over a month it balances local, India and global topics.
3. **Writer and SEO checker.** Writes the article using only facts from its sources, with official links for any rule, date or amount. It then checks and fixes the title, description, keywords, headings, internal links to service pages or the cost calculator, FAQs, Key Takeaways, "What you'll learn" questions and cover image. If the SEO score is too low, it rewrites the article.

## After writing
- The article publishes automatically. No approval step.
- It is added to the sitemap. Google (through Search Console) and Bing (through IndexNow) are told about the new link right away.
- Rule articles show an "Updated on" date. When a newer rule replaces an older one, the old article links to the new one.
- If no suitable trend turns up in a week, the picker uses the strongest evergreen question people are searching for that week, so a post still goes out.

## Admin page
The Blog SEO admin page gets:
- A weekly list of every topic found, which one was chosen and why, and its source links
- A "Generate this week's article now" button

## First run
After setup, run it once so an article goes out today.

## Technical details
- Remove the 12 fixed topics and `pickTopic()` fixed list from `auto-generate-article`. Replace with a three-step pipeline inside the same function: `findTrends()` → `pickTopic()` → `writeAndSeoCheck()`. Each step is a separate AI call with its own instructions.
- Trend and picker steps use web search limited to the last 7 days. Results are source data only: the AI must cite URLs and must never invent dates or amounts. Search-volume checks use Semrush keyword data when available (`in` database for local and India, `us` for global). Otherwise the AI estimates.
- New table `blog_topic_history` (week, keyword, normalized_keyword, scope local|india|global, kind trending|upcoming|wider|evergreen, sources jsonb, chosen bool, reason, post_id, created_at). Every candidate is saved each week. RLS is on with admin-only read; the function writes using the service role.
- Duplicate filter: token Jaccard on keyword and title against all posts and past chosen topics; anything at 0.5 or above is rejected.
- Existing weekly cron (Monday 03:30 UTC = 9:00 IST) stays. Add a single-run lock, a limit of one article per week, and a pause on credit or permission errors.
- After publishing: update the sitemap entry, ping IndexNow, and resubmit the sitemap to Google Search Console through the connected account. Google decides indexing speed; ranking is not guaranteed.
- Deno tests for the similarity filter and the monthly scope balance.
