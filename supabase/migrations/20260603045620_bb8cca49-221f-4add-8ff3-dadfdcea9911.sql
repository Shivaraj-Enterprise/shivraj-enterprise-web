
-- Admin write policies on user_roles
CREATE POLICY "Admins can insert roles"
  ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
  ON public.user_roles FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, DELETE ON public.user_roles TO authenticated;

-- Admin write policies on pre_approved_admins
CREATE POLICY "Admins can insert pre-approved admins"
  ON public.pre_approved_admins FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete pre-approved admins"
  ON public.pre_approved_admins FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

GRANT INSERT, DELETE ON public.pre_approved_admins TO authenticated;

-- Audit log trigger (was missing — recreate so grants/revokes get logged)
DROP TRIGGER IF EXISTS user_roles_audit_trigger ON public.user_roles;
CREATE TRIGGER user_roles_audit_trigger
  AFTER INSERT OR DELETE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

-- Helper: list admins with their email (admin-only)
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text, granted_at timestamptz)
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  RETURN QUERY
  SELECT ur.user_id, u.email::text, ur.created_at
  FROM public.user_roles ur
  JOIN auth.users u ON u.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
END;
$$;
GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;

-- Grant admin role by email (creates pre-approval too; if user exists, grants immediately)
CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  INSERT INTO public.pre_approved_admins(email)
  VALUES (lower(_email))
  ON CONFLICT (email) DO NOTHING;

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF _uid IS NOT NULL THEN
    INSERT INTO public.user_roles(user_id, role)
    VALUES (_uid, 'admin')
    ON CONFLICT DO NOTHING;
    RETURN jsonb_build_object('status', 'granted', 'user_id', _uid);
  END IF;

  RETURN jsonb_build_object('status', 'pre_approved');
END;
$$;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text) TO authenticated;

-- Revoke admin role by email (removes role and pre-approval)
CREATE OR REPLACE FUNCTION public.revoke_admin_by_email(_email text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF lower(_email) = lower(coalesce((SELECT email FROM auth.users WHERE id = auth.uid()), ''))  THEN
    RAISE EXCEPTION 'cannot revoke your own admin role';
  END IF;

  DELETE FROM public.pre_approved_admins WHERE lower(email) = lower(_email);

  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF _uid IS NOT NULL THEN
    DELETE FROM public.user_roles WHERE user_id = _uid AND role = 'admin';
  END IF;

  RETURN jsonb_build_object('status', 'revoked');
END;
$$;
GRANT EXECUTE ON FUNCTION public.revoke_admin_by_email(text) TO authenticated;
