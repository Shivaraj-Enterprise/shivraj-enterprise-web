CREATE TABLE public.weekly_trending_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week text NOT NULL UNIQUE,
  topic text NOT NULL,
  keywords text[] NOT NULL DEFAULT '{}',
  faqs jsonb NOT NULL DEFAULT '[]'::jsonb,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.weekly_trending_content TO anon, authenticated;
GRANT ALL ON public.weekly_trending_content TO service_role;
ALTER TABLE public.weekly_trending_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active trending content" ON public.weekly_trending_content FOR SELECT TO anon, authenticated USING (active = true);