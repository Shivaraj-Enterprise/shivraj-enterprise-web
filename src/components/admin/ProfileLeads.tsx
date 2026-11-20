import { useCallback, useEffect, useState } from "react";
import { RefreshCw, Mail, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

type Lead = { id: string; company_name: string | null; email: string | null; mobile: string | null; notes: string | null; created_at: string };
export default function ProfileLeads() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(false);
  const load = useCallback(async () => {
    setLoading(true); setError("");
    const result = await supabase.from("leads").select("id,company_name,email,mobile,notes,created_at")
      .eq("source", "company-profile-download").order("created_at", { ascending: false }).order("id").range(page * 25, page * 25 + 25);
    if (result.error) { setError("Could not load profile requests. Please try again."); setRows([]); }
    else { setRows((result.data ?? []).slice(0, 25)); setMore((result.data?.length ?? 0) > 25); }
    setLoading(false);
  }, [page]);
  useEffect(() => { load(); }, [load]);
  return <section className="border-t pt-6 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold text-shivraj-800">Company profile requests</h2><Button variant="outline" disabled={loading} onClick={load}><RefreshCw size={16} className="mr-2" />Refresh requests</Button></div>
    {error && <p role="alert" className="text-destructive">{error}</p>}
    <div className="overflow-x-auto border rounded-lg bg-card">
      <table className="w-full text-sm text-left"><thead className="bg-muted"><tr>{["Received", "Company", "Contact", "Details / alert status"].map(h => <th className="p-3" key={h}>{h}</th>)}</tr></thead>
        <tbody>{rows.map(r => <tr key={r.id} className="border-t"><td className="p-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td><td className="p-3">{r.company_name}</td><td className="p-3 space-y-2">{r.mobile && <a className="flex gap-2 items-center text-shivraj-600" href={`tel:${r.mobile}`}><Phone size={14} />{r.mobile}</a>}{r.email && <a className="flex gap-2 items-center text-shivraj-600" href={`mailto:${r.email}`}><Mail size={14} />{r.email}</a>}</td><td className="p-3 whitespace-pre-line">{r.notes}</td></tr>)}</tbody>
      </table>
      {!rows.length && !error && <p className="p-6 text-muted-foreground">{loading ? "Loading requests…" : "No profile requests on this page."}</p>}
    </div>
    <div className="flex items-center gap-3"><Button variant="outline" disabled={loading || page === 0} onClick={() => setPage(p => p - 1)}>Previous</Button><span className="text-sm">Page {page + 1}</span><Button variant="outline" disabled={loading || !more} onClick={() => setPage(p => p + 1)}>Next</Button></div>
  </section>;
}