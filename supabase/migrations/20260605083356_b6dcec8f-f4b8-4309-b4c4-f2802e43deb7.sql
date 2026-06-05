
CREATE POLICY "Public can read company-assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'company-assets');

CREATE POLICY "Admins can upload company-assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update company-assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete company-assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'company-assets' AND public.has_role(auth.uid(), 'admin'));
