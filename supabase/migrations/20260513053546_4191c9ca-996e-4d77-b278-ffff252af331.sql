-- Audit log table
CREATE TABLE public.role_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL CHECK (action IN ('granted', 'revoked')),
  target_user_id UUID NOT NULL,
  role public.app_role NOT NULL,
  performed_by UUID,
  performed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit log"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger function
CREATE OR REPLACE FUNCTION public.log_role_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.role_audit_log (action, target_user_id, role, performed_by)
    VALUES ('granted', NEW.user_id, NEW.role, auth.uid());
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.role_audit_log (action, target_user_id, role, performed_by)
    VALUES ('revoked', OLD.user_id, OLD.role, auth.uid());
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER user_roles_audit_insert
AFTER INSERT ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

CREATE TRIGGER user_roles_audit_delete
AFTER DELETE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.log_role_change();

CREATE INDEX idx_role_audit_log_performed_at ON public.role_audit_log(performed_at DESC);