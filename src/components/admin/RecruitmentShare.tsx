import { useState } from "react";
import { Copy, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { jobRoles } from "@/data/jobRoles";
import { recruitmentMessage } from "@/lib/recruitment";

export default function RecruitmentShare() {
  const [role, setRole] = useState("General Helper");
  const message = recruitmentMessage(role);
  return <section className="py-6 border-y space-y-4">
    <h2 className="text-xl font-semibold text-shivraj-800">Recruitment sharing</h2>
    <div className="grid md:grid-cols-[240px_1fr] gap-6">
      <div className="space-y-3">
        <Label htmlFor="share-role">Role to promote</Label>
        <select id="share-role" className="w-full h-10 rounded-md border bg-background px-3 text-sm" value={role} onChange={e => setRole(e.target.value)}>
          {jobRoles.map(r => <option key={r.title}>{r.title}</option>)}
          {["Packer", "CNC Helper", "Storekeeper"].map(r => <option key={r}>{r}</option>)}
        </select>
        <Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(message); toast.success("Recruitment message copied"); } catch { toast.error("Could not copy"); } }}><Copy size={16} className="mr-2" />Copy message</Button>
        <Button asChild><a href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} className="mr-2" />Share on WhatsApp</a></Button>
      </div>
      <p className="whitespace-pre-line text-sm leading-relaxed bg-muted p-4 rounded-md">{message}</p>
    </div>
  </section>;
}