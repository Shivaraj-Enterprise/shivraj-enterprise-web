# Never-ending weekly blog topics (AI topic discovery)

## Goal
When the 12 fixed topics run out, the weekly generator picks a fresh, most-searched topic. Each topic must be a different question from every existing article and suit Shivraj Enterprise's buyers. Reach now goes past the local area to all-India and global readers.

## How it works each Monday
1. Use any remaining fixed topic first.
2. Trending scan: search web and news from the last 14 days for Indian labour and HR updates (minimum wage notifications, Labour Codes, EPF/ESIC/GST changes, factory safety, GIDC news) and global workforce news. Where search results include LinkedIn and Instagram trends, it checks those too. A fresh, relevant update becomes a "What changed and what it means for your factory" article that cites the official source.
   - It also checks every day for breaking rule changes, so an article can go out within about a day.
   - Rule articles show "Updated on" dates. When a newer rule replaces an older one, the old article links to the new one.
3. If nothing is trending, AI suggests 8 candidate topics. It sees every existing article and follows SEO rules: long-tail question or "how to / cost / checklist / rules" keywords, buyer intent only (no job-seeker or home-cleaning topics), and a natural link to a service page or the cost calculator.
4. Duplicate filter: drop candidates too similar to existing or past topics. This prevents Google's "chose different canonical" problem.
5. Rank by real search demand (search volume and how hard it is to rank), buyer intent and uniqueness. The top topic is written with the current article steps: SEO score, rewrite if needed, cover image, IndexNow ping.
6. Save every chosen topic so it is never picked again.

## Wider reach: local, all-India and global
Monthly mix (about 4 articles):
- 2 local (Vapi GIDC, Valsad, South Gujarat) for nearby buyers
- 1 all-India on high-search national topics (Labour Codes, EPF/ESIC, GST on manpower, state minimum wages, contract labour rules)
- 1 global on worldwide workforce topics (staffing trends, factory safety standards, outsourcing vs in-house, automation and labour)

National and global articles still end by showing how Shivraj Enterprise helps factories in Gujarat, so readers can become enquiries. Trending national news can take any week's slot.


## Trend window, future topics and wider ideas
- Trend window: each week, check topics that trended 7 to 14 days ago. These are proven trends that still have room to rank.
- Future topics: predict what is coming, such as announced Labour Code start dates, wage revision dates (April and October), budget changes, EPF/ESIC deadlines, festive-season hiring, and monsoon safety. Publish 2 to 4 weeks early so the article is ready when searches rise.
- Wider ideas: sometimes pick a trending topic outside the usual list when it still fits Shivraj Enterprise, for example factory heatwave safety, worker migration after festivals, or AI and automation in plants. Each one ties back to manpower, compliance or workforce services.
- Each week picks the best of four sources: fresh news, the 7-14 day trend, a predicted upcoming topic, or AI evergreen ideas. Reach (local, India or global) is balanced over the month. Goal: keep the blog showing up for trending searches.

## Admin control
The Blog SEO admin page gets a "Discovered topics" list (keyword, reach level, date, article link) and a "Generate next article now" button.

## First run
After setup, run it once so a new article goes out today.

## Technical details
- New table `blog_topic_history` (keyword, normalized_keyword, angle, category, scope local|india|global, source fixed|ai|trending, post_id, created_at). RLS is on with admin-only read; the edge function writes using the service role.
- `auto-generate-article/index.ts`: `pickTopic()` falls back to `discoverTopic(scope)`. `pickScope()` uses the monthly mix from history. Lovable AI (gemini-3-flash-preview) returns structured candidates through tool calling, and the prompt changes by scope.
- Search-demand ranking uses Semrush keyword data when available (`in` for local and India, `us` for global). Otherwise it falls back to AI scoring.
- Similarity check: token Jaccard on keyword and title; anything at 0.5 or above is rejected. If every candidate is rejected, retry once, then skip and log the reason.
- Trending scan uses web search with a recency filter. Results are source data only: the AI must cite URLs and never invent dates or amounts. A daily scheduled job checks only for breaking changes, with at most one extra article per week.
- Keep the IndexNow ping and cover-image calls.
- Topic source is stored as fresh|trend_7_14|predicted|wider|evergreen. Predicted topics come from a small calendar of known dates plus AI forecasting from news; the AI must cite a source for any date or amount.
- Add a Deno test for the similarity check and scope mix.
