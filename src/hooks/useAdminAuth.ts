import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export type AdminAuthState = {
  authChecked: boolean;
  isAdmin: boolean;
  userId: string | null;
  email: string | null;
};

/**
 * Consistent admin auth check for every admin route.
 * - Redirects to /admin/login if no session
 * - Uses the `has_role` RPC (SECURITY DEFINER) so it is not blocked by RLS
 */
export const useAdminAuth = (): AdminAuthState => {
  const navigate = useNavigate();
  const [state, setState] = useState<AdminAuthState>({
    authChecked: false,
    isAdmin: false,
    userId: null,
    email: null,
  });

  useEffect(() => {
    let cancelled = false;
    const init = async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        navigate("/admin/login");
        return;
      }
      const user = sess.session.user;
      const { data: isAdminRpc } = await supabase.rpc("has_role", {
        _user_id: user.id,
        _role: "admin",
      });
      if (cancelled) return;
      setState({
        authChecked: true,
        isAdmin: !!isAdminRpc,
        userId: user.id,
        email: user.email ?? null,
      });
    };
    init();
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return state;
};
