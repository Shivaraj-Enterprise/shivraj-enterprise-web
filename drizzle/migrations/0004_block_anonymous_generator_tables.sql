CREATE POLICY "Block anonymous sessions" ON public.blog_generator_state AS RESTRICTIVE FOR ALL TO authenticated
USING (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE)
WITH CHECK (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE);
CREATE POLICY "Block anonymous sessions" ON public.blog_topic_history AS RESTRICTIVE FOR ALL TO authenticated
USING (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE)
WITH CHECK (COALESCE((auth.jwt() ->> 'is_anonymous')::boolean, false) IS NOT TRUE);