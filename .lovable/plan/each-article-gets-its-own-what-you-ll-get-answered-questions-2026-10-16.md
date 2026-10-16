# Each article gets its own "What you'll get answered" questions

## Goal
Every blog article shows 3 questions written for that article only, in the "🎯 What you'll get answered" box. No article is left without the box, and no two articles repeat the same generic list.

## What changes
1. **Hand-written questions for the 4 guides** (GST & TDS, Outsourcing vs In-house, HR Compliance Checklist, Statutory Compliance). Each guide gets its own 3 questions, written to make readers want to read on.
2. **Database articles (like "Manpower agency in Vapi GIDC")**: questions come in this order:
   - questions saved for the article (new optional field the editor can fill in),
   - otherwise the article's own FAQ questions (as today),
   - otherwise the article's section headings turned into questions (e.g. "PF compliance checklist" becomes "What is on the PF compliance checklist?").
3. **Admin blog editor**: a new "What you'll get answered" box to type or edit up to 3 questions per article.
4. **Weekly auto-written articles**: the writer also creates 3 questions for each new article and saves them.
5. **Sharing**: the same questions are used in the share text, so shared posts match the article.

## Technical details
- Add nullable `learn_questions text[]` to `blog_posts`; read it in `BlogPost.tsx`, pass to `StaticArticleShell` via a new `questions` prop that overrides the DOM scan.
- Static guide pages pass their own `questions` array.
- Fallback in `StaticArticleShell`: FAQ "?" headings, then H2 text converted to a question.
- `AdminBlogEditor.tsx`: three text inputs saved to `learn_questions`.
- `auto-generate-article`: prompt returns `learn_questions`; stored on insert. Redeploy.

## Verification
Open each of the 4 guides and a database article: each shows different, article-specific questions; share menu uses the same ones; build passes.
