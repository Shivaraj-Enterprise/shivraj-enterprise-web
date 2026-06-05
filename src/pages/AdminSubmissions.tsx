import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Download, LogOut, RefreshCw } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  inquiry_type: string;
  message: string;
  email_sent: boolean;
  created_at: string;
};

const firstOfMonth = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
const today = () => new Date().toISOString().slice(0, 10);

const AdminSubmissions = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [rows, setRows] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(today());
  const [type, setType] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    let q = supabase
      .from("contact_submissions" as never)
      .select("*")
      .gte("created_at", `${from}T00:00:00.000Z`)
      .lte("created_at", `${to}T23:59:59.999Z`)
      .order("created_at", { ascending: false });
    if (type !== "all") q = q.eq("inquiry_type", type);
    const { data, error } = await q;
    if (error) {
      toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    } else {
      setRows((data as unknown as Submission[]) ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (auth.isAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAdmin]);

  const exportCsv = () => {
    const header = ["Date", "Name", "Email", "Phone", "WhatsApp", "Inquiry", "Message", "Email Sent"];
    const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = [header.join(",")].concat(
      rows.map((r) =>
        [
          new Date(r.created_at).toLocaleString(),
          r.name, r.email, r.phone, r.whatsapp ?? "",
          r.inquiry_type, r.message, r.email_sent ? "Yes" : "No",
        ].map(escape).join(",")
      )
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `submissions_${from}_to_${to}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = useMemo(() => {
    const counts: Record<string, number> = { service: 0, job: 0, quote: 0, other: 0 };
    rows.forEach((r) => { counts[r.inquiry_type] = (counts[r.inquiry_type] ?? 0) + 1; });
    return counts;
  }, [rows]);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <AdminGate auth={auth}>
      <Helmet>
        <title>Contact Submissions – Shivraj Admin</title>
        <meta name="description" content="Review and export contact form submissions for Shivraj Enterprise." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-shivraj-800">Contact Submissions</h1>
            <div className="flex gap-2">
              <Link to="/admin/roles"><Button variant="outline">Manage Roles</Button></Link>
              <Link to="/admin/company-profile"><Button variant="outline">Company Profile PDF</Button></Link>
              <Link to="/admin/audit-log"><Button variant="outline">Audit Log</Button></Link>
              <Button variant="outline" onClick={signOut}><LogOut className="mr-2" size={16} />Sign out</Button>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-wrap items-end gap-4">
            <div>
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="type">Type</Label>
              <select
                id="type"
                className="border rounded-md h-10 px-3"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="all">All</option>
                <option value="service">Service</option>
                <option value="job">Job</option>
                <option value="quote">Quote</option>
                <option value="other">Other</option>
              </select>
            </div>
            <Button onClick={load} disabled={loading} className="bg-shivraj-600 hover:bg-shivraj-700">
              <RefreshCw className="mr-2" size={16} />{loading ? "Loading..." : "Apply"}
            </Button>
            <Button onClick={exportCsv} variant="outline" disabled={!rows.length}>
              <Download className="mr-2" size={16} />Export CSV
            </Button>
            <div className="ml-auto flex flex-wrap gap-2 text-sm">
              <Badge variant="secondary">Total: {rows.length}</Badge>
              <Badge variant="secondary">Service: {stats.service ?? 0}</Badge>
              <Badge variant="secondary">Job: {stats.job ?? 0}</Badge>
              <Badge variant="secondary">Quote: {stats.quote ?? 0}</Badge>
              <Badge variant="secondary">Other: {stats.other ?? 0}</Badge>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap">{new Date(r.created_at).toLocaleString()}</TableCell>
                    <TableCell>{r.name}</TableCell>
                    <TableCell>{r.email}</TableCell>
                    <TableCell>{r.phone}</TableCell>
                    <TableCell>{r.whatsapp ?? "—"}</TableCell>
                    <TableCell><Badge>{r.inquiry_type}</Badge></TableCell>
                    <TableCell className="max-w-md whitespace-pre-wrap">{r.message}</TableCell>
                    <TableCell>{r.email_sent ? "✅" : "❌"}</TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                      No submissions in this range.
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

export default AdminSubmissions;
