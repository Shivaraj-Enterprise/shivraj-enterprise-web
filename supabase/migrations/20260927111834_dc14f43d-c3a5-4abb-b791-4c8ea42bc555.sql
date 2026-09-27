DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['article_images','blog_post_tags','blog_posts','blog_tags','contact_submissions','knowledge_chunks','leads','pre_approved_admins','rate_card_items','role_audit_log','user_roles']
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS "Block anonymous sessions" ON public.%I', t);
    EXECUTE format('CREATE POLICY "Block anonymous sessions" ON public.%I AS RESTRICTIVE FOR ALL TO authenticated USING (coalesce((auth.jwt() ->> ''is_anonymous'')::boolean, false) IS NOT TRUE) WITH CHECK (coalesce((auth.jwt() ->> ''is_anonymous'')::boolean, false) IS NOT TRUE)', t);
  END LOOP;
END $$;