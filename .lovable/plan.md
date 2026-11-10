# Never-ending weekly blog topics (AI topic discovery)

## Goal
When the 12 fixed topics are used up, the weekly generator invents a fresh topic that searchers ask about, is a different question from every existing article, and suits Shivraj Enterprise's buyers (factory HR, plant heads and purchase teams in Vapi, Sarigam, Umbergaon, Daman and Silvassa).

## How it works each Monday
1. Use any remaining fixed topic first.
2. If none are left, AI suggests 8 candidate topics (keyword, search intent, angle, category, tags). It sees every existing article title, slug and keyword, and gets SEO rules:
   - Long-tail, question-style or "how to / cost / checklist / rules" keywords a buyer would type
   - Local wording (Vapi GIDC, Valsad, Gujarat) where it fits
   - Buyer intent only: no job-seeker, home-cleaning or residential cleaning topics
   - Must link naturally to one of the 9 service pages or the cost calculator
3. Duplicate filter: throw out any candidate whose words overlap too much with an existing article or with past discovered topics. This avoids Google's "chose different canonical" problem.
4. Score the remaining candidates by buyer intent, local relevance and uniqueness, then write the top one using the current article pipeline (SEO scoring, rewrite if below threshold, cover image, IndexNow ping).
5. Save every chosen topic so it is never picked again.

## Admin control
On the Blog SEO admin page, add a "Discovered topics" list (keyword, date, article link) and a "Generate next article now" button.

## First run
After deployment, run it once so a new article goes out today instead of waiting for next Monday.

## Technical details
- New table `blog_topic_history` (keyword, normalized_keyword, angle, category, source fixed|ai, post_id, created_at). RLS on, admin-only read; the edge function writes using the service role.
- `auto-generate-article/index.ts`: `pickTopic()` falls back to `discoverTopic()`, which calls Lovable AI (gemini-3-flash-preview) with tool-calling for structured JSON. Similarity uses token Jaccard on keyword and title, rejecting anything at 0.5 or above. Retry once if every candidate is rejected; otherwise skip with a logged reason.
- Store `topic.keyword` on the post (existing column, or add `target_keyword`) for future dedupe.
- Keep the IndexNow ping and the cover-image calls as they are.
- Add a Deno test for the similarity and dedupe helper.
