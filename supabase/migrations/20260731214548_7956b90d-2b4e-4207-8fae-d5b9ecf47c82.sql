DROP POLICY IF EXISTS "Public can read cached article images" ON public.article_images;

REVOKE SELECT ON public.article_images FROM anon;

CREATE POLICY "Admins can read cached article images"
  ON public.article_images FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));