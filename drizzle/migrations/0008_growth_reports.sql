CREATE TABLE public.growth_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  week text NOT NULL UNIQUE,
  metrics jsonb NOT NULL DEFAULT '{}'::jsonb,
  opportunities jsonb NOT NULL DEFAULT '[]'::jsonb,
  email_sent boolean NOT NULL DEFAULT false,
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.growth_reports TO authenticated;
GRANT ALL ON public.growth_reports TO service_role;
ALTER TABLE public.growth_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view growth reports" ON public.growth_reports FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));