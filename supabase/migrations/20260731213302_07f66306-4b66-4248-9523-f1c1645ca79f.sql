-- blog-assets: remove blanket public read; admins only for direct object access.
DROP POLICY IF EXISTS "Public can read blog-assets" ON storage.objects;
DROP POLICY IF EXISTS "Public read blog-assets" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view blog-assets" ON storage.objects;

CREATE POLICY "Admins can read blog-assets"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'blog-assets' AND public.has_role(auth.uid(), 'admin'));

-- company-assets: restrict public read to the single public marketing PDF.
DROP POLICY IF EXISTS "Public can read company-assets" ON storage.objects;

CREATE POLICY "Public can read company profile pdf"
ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'company-assets' AND name = 'company-profile.pdf');

CREATE POLICY "Admins can read company-assets"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(), 'admin'));