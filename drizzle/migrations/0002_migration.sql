CREATE POLICY "Block anonymous sessions" ON public.job_applications AS RESTRICTIVE FOR ALL TO authenticated
USING (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE)
WITH CHECK (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE);