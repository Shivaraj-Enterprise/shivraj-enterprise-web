
## Overview

Two new features:
1. **Locations page** at `/locations` — expanded version of the existing "Service Areas" section (kept on home too).
2. **Blog/Articles system** — public listing/detail pages, admin CRUD with rich text + cover image upload + tags, plus a "Latest News" teaser on the home page.

---

## 1. Locations page (`/locations`)

New page reusing the existing home-page block, expanded with:
- Page hero ("Our Service Areas in Vapi GIDC")
- All three cards from home: **Vapi GIDC Industrial Phases**, **Villages & Areas Covered Near Vapi**, **Pin Codes We Operate In**
- Embedded Google Map (reuse `LocationMap` component)
- Local SEO meta tags + LocalBusiness JSON-LD
- CTA to Contact
- Header nav link added: Home / About / Services / **Locations** / Blog / Contact
- Footer link added
- Sitemap.xml updated

Home page keeps its current Service Areas section and gets a "View full coverage map" link to `/locations`.

---

## 2. Blog system

### Database (Lovable Cloud)
- `blog_posts` table: `slug` (unique), `title`, `excerpt`, `content` (HTML), `cover_image_url`, `published` (bool), `published_at`, `author_id`
- `blog_tags` table: `slug`, `name`
- `blog_post_tags` join table
- RLS: anyone (anon + authenticated) can SELECT published posts; admins can do everything (using existing `has_role(uid,'admin')`)
- Standard GRANTs (anon SELECT for published, authenticated full, service_role all)
- `updated_at` trigger

### Storage
- New private bucket `blog-assets` for cover images
- RLS on `storage.objects`: public SELECT for `blog-assets`, admin-only INSERT/UPDATE/DELETE
- Signed URLs fetched via a hook (same pattern as `useCompanyProfileUrl`)

### Public pages
- `/blog` — paginated list of published posts (cover thumb, title, excerpt, date, tags), tag filter chips
- `/blog/:slug` — full post: hero cover, title, date, tags, rendered HTML body
- SEO: per-post `<title>`, meta description from excerpt, Open Graph image, **Article JSON-LD**, canonical
- Sanitized HTML rendering via DOMPurify (added dep) to safely render the rich-text content

### Admin pages
- `/admin/blog` — list with status badges, search, "New post" button, edit/delete actions
- `/admin/blog/new` and `/admin/blog/:id/edit` — form with:
  - Title (auto-generates slug, editable)
  - Excerpt (short summary)
  - Cover image upload → `blog-assets` bucket
  - **Rich-text editor** (TipTap — headings, bold, italic, lists, links, blockquote, image)
  - Tag multi-select (create new tag inline)
  - Publish toggle + scheduled publish date
- Gated with `useAdminAuth` + `AdminGate` (same pattern as other admin pages)
- Nav link "Blog Posts" added to admin sidebar/links in `AdminSubmissions`

### Home page
- New "Latest News & Updates" section showing 3 most recent published posts → links to `/blog`

### Routing
- Add to `App.tsx`: `/locations`, `/blog`, `/blog/:slug`, `/admin/blog`, `/admin/blog/new`, `/admin/blog/:id/edit`

---

## Technical details

**New deps:** `@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-link`, `@tiptap/extension-image`, `dompurify`, `@types/dompurify`, `date-fns` (already present likely).

**New files (high level):**
- `src/pages/Locations.tsx`
- `src/pages/Blog.tsx`, `src/pages/BlogPost.tsx`
- `src/pages/AdminBlogList.tsx`, `src/pages/AdminBlogEditor.tsx`
- `src/components/blog/PostCard.tsx`, `BlogTagFilter.tsx`, `RichTextEditor.tsx`, `RichTextRenderer.tsx`
- `src/hooks/useBlogPosts.ts`, `useBlogPost.ts`, `useBlogCoverUpload.ts`
- 1 migration: tables + RLS + GRANTs + triggers
- Storage bucket created via tool, RLS policies via migration

**Edits:**
- `src/App.tsx` — 6 new routes
- `src/components/Header.tsx` — add Locations + Blog nav links
- `src/components/Footer.tsx` — add Locations + Blog links
- `src/pages/Index.tsx` — Latest News teaser, "View full coverage" link
- `src/pages/AdminSubmissions.tsx` — admin nav link to Blog Posts
- `public/sitemap.xml` — `/locations` + `/blog`
- `public/robots.txt` — allow as needed

**Security:**
- All form inputs validated with zod (title/slug/excerpt length, slug pattern)
- HTML body sanitized with DOMPurify before render
- Admin checks server-side via existing `has_role` + RLS

**Out of scope:** comments, drafts autosave, multi-author analytics, RSS feed (can add later if needed).
