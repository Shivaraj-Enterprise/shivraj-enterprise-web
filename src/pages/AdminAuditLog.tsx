import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { LogOut, RefreshCw, ArrowLeft } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";

type AuditEntry = {
  id: string;
  action: "granted" | "revoked";
  target_user_id: string;
  role: string;
  performed_by: string | null;
  performed_at: string;
};

const AdminAuditLog = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [rows, setRows] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("role_audit_log" as never)
      .select("*")
      .order("performed_at", { ascending: false })
      .limit(500);
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setRows((data as unknown as AuditEntry[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auth.isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAdmin]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <AdminGate auth={auth}>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/submissions">
                <Button variant="outline" size="sm"><ArrowLeft className="mr-2" size={16} />Submissions</Button>
              </Link>
              <h1 className="text-2xl font-bold text-shivraj-800">Admin Role Audit Log</h1>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/roles"><Button variant="outline">Manage Roles</Button></Link>
              <Button onClick={load} disabled={loading} variant="outline">
                <RefreshCw className="mr-2" size={16} />{loading ? "Loading..." : "Refresh"}
              </Button>
              <Button variant="outline" onClick={signOut}><LogOut className="mr-2" size={16} />Sign out</Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Target user ID</TableHead>
                  <TableHead>Performed by (user ID)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{new Date(r.performed_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={r.action === "granted" ? "default" : "destructive"}>{r.action}</Badge>
                    </TableCell>
                    <TableCell>{r.role}</TableCell>
                    <TableCell className="font-mono text-xs">{r.target_user_id}</TableCell>
                    <TableCell className="font-mono text-xs">{r.performed_by ?? "system / migration"}</TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      No audit entries yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminAuditLog;
