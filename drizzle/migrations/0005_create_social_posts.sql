CREATE TABLE public.social_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blog_post_id uuid,
  platform text NOT NULL DEFAULT 'linkedin',
  content text NOT NULL,
  article_url text,
  status text NOT NULL DEFAULT 'draft',
  external_urn text,
  error_message text,
  source text NOT NULL DEFAULT 'auto',
  created_at timestamptz NOT NULL DEFAULT now(),
  published_at timestamptz
);
GRANT SELECT ON public.social_posts TO authenticated;
GRANT ALL ON public.social_posts TO service_role;
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view social posts" ON public.social_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Block anonymous sessions" ON public.social_posts AS RESTRICTIVE FOR ALL TO authenticated
  USING (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE)
  WITH CHECK (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE);