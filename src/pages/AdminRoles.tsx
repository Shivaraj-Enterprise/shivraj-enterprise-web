import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, LogOut, RefreshCw, Trash2, UserPlus } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";
import RoleDiagnostics from "@/components/admin/RoleDiagnostics";

type AdminRow = { user_id: string; email: string; granted_at: string };
type PreApproved = { email: string; created_at: string };

const AdminRoles = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [admins, setAdmins] = useState<AdminRow[]>([]);
  const [pre, setPre] = useState<PreApproved[]>([]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = async () => {
    setLoading(true);
    const [{ data: adminData, error: adminErr }, { data: preData, error: preErr }] =
      await Promise.all([
        supabase.rpc("list_admins"),
        supabase.from("pre_approved_admins").select("*").order("created_at", { ascending: false }),
      ]);
    if (adminErr) toast({ title: "Failed to load admins", description: adminErr.message, variant: "destructive" });
    else setAdmins((adminData as AdminRow[]) ?? []);
    if (preErr) toast({ title: "Failed to load pre-approvals", description: preErr.message, variant: "destructive" });
    else setPre((preData as PreApproved[]) ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (auth.isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAdmin]);

  const grant = async () => {
    if (!email.trim()) return;
    setBusy(true);
    const { data, error } = await supabase.rpc("grant_admin_by_email", { _email: email.trim() });
    setBusy(false);
    if (error) {
      toast({ title: "Failed to grant", description: error.message, variant: "destructive" });
      return;
    }
    const status = (data as { status?: string })?.status;
    toast({
      title: status === "granted" ? "Admin granted" : "Email pre-approved",
      description:
        status === "granted"
          ? `${email} now has admin access.`
          : `${email} will become admin on their first sign-in.`,
    });
    setEmail("");
    load();
  };

  const revoke = async (target: string) => {
    if (!confirm(`Revoke admin from ${target}?`)) return;
    setBusy(true);
    const { error } = await supabase.rpc("revoke_admin_by_email", { _email: target });
    setBusy(false);
    if (error) {
      toast({ title: "Failed to revoke", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Admin revoked", description: target });
    load();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <AdminGate auth={auth}>
      <Helmet>
        <title>Manage Admin Roles – Shivraj Admin</title>
        <meta name="description" content="Grant or revoke administrator access for the Shivraj Enterprise admin panel." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/submissions">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2" size={16} />Submissions
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-shivraj-800">Admin Roles & Permissions</h1>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/audit-log"><Button variant="outline">Audit Log</Button></Link>
              <Button variant="outline" onClick={signOut}>
                <LogOut className="mr-2" size={16} />Sign out
              </Button>
            </div>
          </div>

          <RoleDiagnostics userId={auth.userId} email={auth.email} />

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 space-y-3">
            <h2 className="font-semibold text-shivraj-800">Grant admin access</h2>
            <p className="text-sm text-muted-foreground">
              If the email already has an account, admin is granted immediately. Otherwise it is pre-approved and applied on first sign-in.
            </p>
            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[240px]">
                <Label htmlFor="grant-email">Email</Label>
                <Input
                  id="grant-email"
                  type="email"
                  placeholder="person@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button onClick={grant} disabled={busy || !email.trim()} className="bg-shivraj-600 hover:bg-shivraj-700">
                <UserPlus className="mr-2" size={16} />Grant admin
              </Button>
              <Button onClick={load} variant="outline" disabled={loading}>
                <RefreshCw className="mr-2" size={16} />{loading ? "Loading..." : "Refresh"}
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-shivraj-800">Active admins ({admins.length})</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Granted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {admins.map((a) => {
                  const self = a.user_id === auth.userId;
                  return (
                    <TableRow key={a.user_id}>
                      <TableCell>{a.email} {self && <Badge variant="secondary" className="ml-2">you</Badge>}</TableCell>
                      <TableCell className="font-mono text-xs">{a.user_id}</TableCell>
                      <TableCell className="whitespace-nowrap">{new Date(a.granted_at).toLocaleString()}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={self || busy}
                          onClick={() => revoke(a.email)}
                        >
                          <Trash2 className="mr-1" size={14} />Revoke
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {!admins.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                      No admins found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-shivraj-800">
                Pre-approved emails ({pre.length})
              </h2>
              <p className="text-sm text-muted-foreground">
                Anyone signing in with one of these emails automatically becomes admin.
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Added</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pre.map((p) => (
                  <TableRow key={p.email}>
                    <TableCell>{p.email}</TableCell>
                    <TableCell className="whitespace-nowrap">{new Date(p.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={busy}
                        onClick={() => revoke(p.email)}
                      >
                        <Trash2 className="mr-1" size={14} />Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!pre.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                      No pre-approved emails.
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

export default AdminRoles;
