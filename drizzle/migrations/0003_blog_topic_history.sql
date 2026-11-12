CREATE TABLE public.blog_topic_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week text NOT NULL,
  keyword text NOT NULL,
  normalized_keyword text NOT NULL,
  angle text,
  scope text NOT NULL DEFAULT 'india',
  kind text NOT NULL DEFAULT 'trending',
  sources jsonb NOT NULL DEFAULT '[]'::jsonb,
  score integer,
  chosen boolean NOT NULL DEFAULT false,
  reason text,
  post_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_topic_history TO authenticated;
GRANT ALL ON public.blog_topic_history TO service_role;
ALTER TABLE public.blog_topic_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view topic history" ON public.blog_topic_history FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE INDEX blog_topic_history_week_idx ON public.blog_topic_history(week);

CREATE TABLE public.blog_generator_state (
  id text PRIMARY KEY,
  locked_until timestamptz,
  paused_reason text,
  last_week text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_generator_state TO authenticated;
GRANT ALL ON public.blog_generator_state TO service_role;
ALTER TABLE public.blog_generator_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view generator state" ON public.blog_generator_state FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
INSERT INTO public.blog_generator_state(id) VALUES ('weekly');