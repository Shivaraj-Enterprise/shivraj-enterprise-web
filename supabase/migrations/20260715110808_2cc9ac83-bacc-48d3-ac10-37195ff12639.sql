
CREATE TABLE public.article_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  section_key TEXT NOT NULL,
  prompt TEXT NOT NULL,
  aspect_ratio TEXT NOT NULL DEFAULT '16:9',
  storage_path TEXT NOT NULL,
  image_url TEXT NOT NULL,
  url_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slug, section_key)
);

GRANT SELECT ON public.article_images TO anon, authenticated;
GRANT ALL ON public.article_images TO service_role;

ALTER TABLE public.article_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read cached article images"
  ON public.article_images FOR SELECT
  USING (true);

CREATE TRIGGER article_images_updated_at
  BEFORE UPDATE ON public.article_images
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
