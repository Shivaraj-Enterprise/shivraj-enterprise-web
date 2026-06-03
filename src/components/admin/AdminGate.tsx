import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { AdminAuthState } from "@/hooks/useAdminAuth";

type Props = { auth: AdminAuthState; children: ReactNode };

const AdminGate = ({ auth, children }: Props) => {
  const navigate = useNavigate();

  if (!auth.authChecked) return <div className="p-8">Loading…</div>;

  if (!auth.isAdmin) {
    const signOut = async () => {
      await supabase.auth.signOut();
      navigate("/admin/login");
    };
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-4">
        <h1 className="text-xl font-semibold">Access denied</h1>
        <p className="text-muted-foreground text-center max-w-md">
          Signed in as <code>{auth.email ?? "unknown"}</code>. Your account does not
          have the <code>admin</code> role. Ask an existing admin to grant access.
        </p>
        <Button variant="outline" onClick={signOut}>
          <LogOut className="mr-2" size={16} />
          Sign out
        </Button>
      </div>
    );
  }

  return <>{children}</>;
};

export default AdminGate;
