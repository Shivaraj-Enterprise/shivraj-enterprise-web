DROP POLICY "Anyone can submit contact form" ON public.contact_submissions;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;