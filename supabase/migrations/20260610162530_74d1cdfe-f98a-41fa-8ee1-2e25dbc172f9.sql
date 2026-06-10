
CREATE TABLE public.rate_card_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service text NOT NULL,
  unit8 text NOT NULL DEFAULT '—',
  rate8 text NOT NULL DEFAULT '—',
  unit12 text NOT NULL DEFAULT '—',
  rate12 text NOT NULL DEFAULT '—',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.rate_card_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.rate_card_items TO authenticated;
GRANT ALL ON public.rate_card_items TO service_role;

ALTER TABLE public.rate_card_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rate card"
  ON public.rate_card_items FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert rate card"
  ON public.rate_card_items FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rate card"
  ON public.rate_card_items FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rate card"
  ON public.rate_card_items FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_rate_card_items_updated_at
  BEFORE UPDATE ON public.rate_card_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.rate_card_items (service, unit8, rate8, unit12, rate12, sort_order) VALUES
  ('Supervisor', 'Per month', '₹25,000', '—', '—', 10),
  ('Skilled (Operator) Labour', 'Per 8 hrs', '₹600', 'Per 12 hrs', '₹1,300', 20),
  ('Semi-Skilled Labour', 'Per 8 hrs', '₹550', 'Per 12 hrs', '₹1,020', 30),
  ('Unskilled Labour', 'Per 8 hrs', '₹502', 'Per 12 hrs', '₹800', 40),
  ('Housekeeping', 'Per 8 hrs', '₹620', '—', '—', 50),
  ('Fitter Labour', 'Per 8 hrs', '₹1,100', '—', '—', 60),
  ('Loading / Unloading', 'Per Tonne', '₹200', '—', '—', 70);
