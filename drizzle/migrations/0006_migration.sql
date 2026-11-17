CREATE UNIQUE INDEX IF NOT EXISTS social_posts_one_live_per_article
  ON public.social_posts (blog_post_id, platform)
  WHERE status IN ('publishing', 'published');