CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT,
  contact_person TEXT,
  mobile TEXT,
  email TEXT,
  location TEXT,
  industry TEXT,
  workers_required TEXT,
  worker_type TEXT,
  shift_details TEXT,
  start_date TEXT,
  duration TEXT,
  notes TEXT,
  source TEXT DEFAULT 'ai-sales-agent',
  conversation JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit leads" ON public.leads
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can view leads" ON public.leads
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete leads" ON public.leads
  FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));