import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AdminGate from "@/components/admin/AdminGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Phone, MessageCircle, FileText } from "lucide-react";
import { toast } from "sonner";
import RecruitmentShare from "@/components/admin/RecruitmentShare";
import { candidateMatches, candidateWhatsapp } from "@/lib/recruitment";

type Row = {
  id: string; name: string; phone: string; whatsapp: string | null; email: string | null; role: string;
  skill_level: string; experience_years: string | null; qualification: string | null;
  current_location: string | null; message: string | null; cv_path: string | null; created_at: string;
};

const List = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const load = async () => {
    setLoading(true); setError("");
    const all: Row[] = [];
    for (let start = 0; ; start += 500) {
      const result = await supabase.from("job_applications").select("*").order("created_at", { ascending: false }).order("id").range(start, start + 499);
      if (result.error) { setError("Could not load candidates. Please try again."); setRows([]); setLoading(false); return; }
      const batch = result.data as Row[];
      all.push(...batch);
      if (batch.length < 500) break;
    }
    setRows(all); setLoading(false);
  };
  useEffect(() => {
    load();
  }, []);
  const openCv = async (p: string) => {
    const tab = window.open("about:blank", "_blank");
    if (tab) tab.opener = null;
    const { data, error } = await supabase.storage.from("job-cvs").createSignedUrl(p, 300);
    if (error || !data?.signedUrl) { tab?.close(); toast.error("Could not open this CV"); return; }
    if (tab) tab.location.href = data.signedUrl;
    else toast.error("Allow pop-ups to open the private CV");
  };
  const shown = rows.filter(r => candidateMatches(r, q, level, role));
  return (
    <div className="container mx-auto px-4 py-10 space-y-6">
      <Helmet><title>Job Applications – Admin</title><meta name="robots" content="noindex" /></Helmet>
      <div className="flex flex-wrap items-center justify-between gap-4"><h1 className="text-2xl font-bold text-shivraj-800">Candidate Bench ({rows.length})</h1><div className="flex gap-3"><Button variant="outline" disabled={loading} onClick={load}><RefreshCw size={16} className="mr-2" />Refresh candidates</Button><Button asChild variant="outline"><Link to="/admin/submissions">← Admin</Link></Button></div></div>
      <RecruitmentShare />
      <div className="flex flex-wrap gap-4 items-end">
        <div className="w-full sm:w-72"><Label htmlFor="candidate-search">Name, role or location</Label><Input id="candidate-search" placeholder="Search candidates" value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <div><Label htmlFor="candidate-level">Skill level</Label><select id="candidate-level" className="block border rounded-md h-10 px-3 text-sm bg-background" value={level} onChange={(e) => setLevel(e.target.value)}>{["All", "Skilled", "Semi-Skilled", "Unskilled"].map(l => <option key={l}>{l}</option>)}</select></div>
        <div><Label htmlFor="candidate-role">Role</Label><select id="candidate-role" className="block border rounded-md h-10 px-3 text-sm bg-background max-w-full" value={role} onChange={e => setRole(e.target.value)}>{["All", ...new Set(rows.map(r => r.role))].map(r => <option key={r}>{r}</option>)}</select></div>
        <span className="text-sm text-muted-foreground pb-2">{shown.length} matching candidates</span>
      </div>
      {error && <p role="alert" className="text-destructive">{error}</p>}
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-shivraj-50 text-left"><tr>{["Date", "Name", "Job", "Level", "Phone / WhatsApp", "Experience", "Qualification", "Location", "Message", "CV"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
          <tbody>{shown.map((r) => (
            <tr key={r.id} className="border-t align-top">
              <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="p-2">{r.name}<div className="text-xs text-muted-foreground">{r.email}</div></td>
              <td className="p-2">{r.role}</td><td className="p-2">{r.skill_level}</td>
              <td className="p-2"><a href={`tel:${r.phone}`} className="inline-flex gap-1 items-center text-shivraj-600"><Phone size={14} />{r.phone}</a>{candidateWhatsapp(r.whatsapp) && <Button asChild size="sm" variant="outline" className="mt-2"><a href={candidateWhatsapp(r.whatsapp) ?? ""} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} className="mr-1" />WhatsApp</a></Button>}</td>
              <td className="p-2">{r.experience_years}</td><td className="p-2">{r.qualification}</td><td className="p-2">{r.current_location}</td>
              <td className="p-2 max-w-xs">{r.message}</td>
              <td className="p-2">{r.cv_path ? <Button size="sm" variant="outline" onClick={() => { if (r.cv_path) openCv(r.cv_path); }}><FileText size={14} className="mr-1" />Open CV</Button> : "—"}</td>
            </tr>
          ))}</tbody>
        </table>
        {shown.length === 0 && !error && <p className="p-6 text-center text-muted-foreground">{loading ? "Loading candidates…" : rows.length ? "No candidates match these filters." : "No applications yet."}</p>}
      </div>
    </div>
  );
};

const AdminJobApplications = () => { const auth = useAdminAuth(); return <AdminGate auth={auth}><List /></AdminGate>; };
export default AdminJobApplications;
