import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AdminGate from "@/components/admin/AdminGate";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

type Row = {
  id: string; name: string; phone: string; whatsapp: string | null; email: string | null; role: string;
  skill_level: string; experience_years: string | null; qualification: string | null;
  current_location: string | null; message: string | null; cv_path: string | null; created_at: string;
};

const List = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [level, setLevel] = useState("All");
  const [q, setQ] = useState("");
  useEffect(() => {
    supabase.from("job_applications").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, []);
  const openCv = async (p: string) => {
    const { data } = await supabase.storage.from("job-cvs").createSignedUrl(p, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  };
  const shown = rows.filter((r) => (level === "All" || r.skill_level === level) && (r.role + r.name).toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="container mx-auto py-10">
      <Helmet><title>Job Applications – Admin</title><meta name="robots" content="noindex" /></Helmet>
      <div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-shivraj-800">Job Applications ({shown.length})</h1><Link to="/admin/submissions" className="text-sm text-shivraj-600">← Admin</Link></div>
      <div className="flex gap-3 mb-4">
        <input className="border rounded px-3 py-2 text-sm" placeholder="Search name or job" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="border rounded px-3 py-2 text-sm" value={level} onChange={(e) => setLevel(e.target.value)}>{["All", "Skilled", "Semi-Skilled", "Unskilled"].map((l) => <option key={l}>{l}</option>)}</select>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-shivraj-50 text-left"><tr>{["Date", "Name", "Job", "Level", "Phone / WhatsApp", "Experience", "Qualification", "Location", "Message", "CV"].map((h) => <th key={h} className="p-2">{h}</th>)}</tr></thead>
          <tbody>{shown.map((r) => (
            <tr key={r.id} className="border-t align-top">
              <td className="p-2 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString()}</td>
              <td className="p-2">{r.name}<div className="text-xs text-gray-500">{r.email}</div></td>
              <td className="p-2">{r.role}</td><td className="p-2">{r.skill_level}</td>
              <td className="p-2">{r.phone}{r.whatsapp && r.whatsapp !== r.phone && <div className="text-xs">WA: {r.whatsapp}</div>}</td>
              <td className="p-2">{r.experience_years}</td><td className="p-2">{r.qualification}</td><td className="p-2">{r.current_location}</td>
              <td className="p-2 max-w-xs">{r.message}</td>
              <td className="p-2">{r.cv_path ? <Button size="sm" variant="outline" onClick={() => openCv(r.cv_path!)}>Open CV</Button> : "—"}</td>
            </tr>
          ))}</tbody>
        </table>
        {shown.length === 0 && <p className="p-6 text-center text-gray-500">No applications yet.</p>}
      </div>
    </div>
  );
};

const AdminJobApplications = () => <AdminGate><List /></AdminGate>;
export default AdminJobApplications;
