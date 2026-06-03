import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert } from "lucide-react";

type Props = { userId: string | null; email: string | null };

const RoleDiagnostics = ({ userId, email }: Props) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const run = async () => {
      setLoading(true);
      const [{ data: admin }, { data: roleRows }] = await Promise.all([
        supabase.rpc("has_role", { _user_id: userId, _role: "admin" }),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      setIsAdmin(!!admin);
      setRoles(((roleRows ?? []) as { role: string }[]).map((r) => r.role));
      setLoading(false);
    };
    run();
  }, [userId]);

  const permissions = isAdmin
    ? [
        "View contact submissions",
        "View role audit log",
        "Grant / revoke admin role",
        "Manage pre-approved admin emails",
      ]
    : ["No admin permissions"];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-3">
      <div className="flex items-center gap-2">
        {isAdmin ? (
          <ShieldCheck className="text-green-600" size={20} />
        ) : (
          <ShieldAlert className="text-amber-600" size={20} />
        )}
        <h2 className="font-semibold text-shivraj-800">Role diagnostics</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 text-sm">
        <div>
          <div className="text-muted-foreground">Account</div>
          <div className="font-mono break-all">{email ?? "—"}</div>
          <div className="font-mono text-xs text-muted-foreground break-all">
            {userId ?? "—"}
          </div>
        </div>
        <div>
          <div className="text-muted-foreground">Detected roles</div>
          <div className="flex flex-wrap gap-1 mt-1">
            {loading ? (
              <span className="text-muted-foreground">Checking…</span>
            ) : roles.length ? (
              roles.map((r) => <Badge key={r}>{r}</Badge>)
            ) : (
              <Badge variant="secondary">none</Badge>
            )}
            <Badge variant={isAdmin ? "default" : "destructive"}>
              has_role(admin) = {String(isAdmin)}
            </Badge>
          </div>
        </div>
      </div>
      <div>
        <div className="text-muted-foreground text-sm">Permissions</div>
        <ul className="list-disc list-inside text-sm">
          {permissions.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoleDiagnostics;
