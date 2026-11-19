import { useEffect, useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { MapPin, RefreshCw, Send, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

type GooglePost = { id: string; content: string; link: string; status: string; google_state: string | null; external_url: string | null; error_message: string | null };
type Overview = { verified: boolean; settings: { location_title: string; auto_publish: boolean }; posts: GooglePost[] };
type Insights = { startDate: string; endDate: string; queries: { query: string; clicks: number; impressions: number; position: number }[] };

async function call(body: Record<string, unknown>) {
  const { data, error } = await supabase.functions.invoke("google-business", { body });
  if (error) {
    let details = error.message;
    if (error instanceof FunctionsHttpError) { try { details = (await error.context.json()).error ?? details; } catch { /* preserve */ } }
    throw new Error(details);
  }
  return data;
}

export default function GoogleBusinessPanel({ articles }: { articles: { id: string; title: string }[] }) {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [article, setArticle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("https://shivraj-enterprise.lovable.app/labour-cost-calculator");
  const [confirm, setConfirm] = useState<"publish" | "auto" | GooglePost | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const load = async () => { try { setOverview(await call({ action: "status" })); setError(""); } catch (e) { setError(e instanceof Error ? e.message : String(e)); } };
  useEffect(() => { void load(); }, []);
  const run = async (body: Record<string, unknown>) => {
    if (busy) return;
    setBusy(true);
    try {
      const data = await call(body);
      if (body.action === "preview") { setContent(data.content); setLink(data.link); }
      else if (body.action === "search_insights") setInsights(data);
      else { toast.info(data.skipped ?? (body.action === "auto_publish" ? "Weekly Google updates updated" : `Google update: ${data.state ?? "submitted"}`)); await load(); }
    } catch (e) { toast.error(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  return <section className="py-8 border-y mb-6">
    <div className="flex flex-wrap justify-between gap-3 mb-4">
      <h2 className="text-xl font-semibold text-shivraj-800 flex items-center gap-2"><MapPin size={22} />Google Business updates</h2>
      <Button size="sm" variant="outline" onClick={load}><RefreshCw size={15} className="mr-2" />Refresh status</Button>
    </div>
    {error && <p role="alert" className="text-destructive text-sm mb-4">{error}</p>}
    {overview && <>
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <span className="text-sm font-medium">{overview.settings.location_title} · {overview.verified ? "Verified" : "Not verified"}</span>
        <div className="flex items-center gap-2"><Checkbox id="google-weekly" checked={overview.settings.auto_publish} disabled={busy || !overview.verified} onCheckedChange={(enabled) => enabled === true ? setConfirm("auto") : run({ action: "auto_publish", enabled: false })} /><Label htmlFor="google-weekly">Weekly article updates</Label></div>
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div><Label htmlFor="google-article">Article</Label><select id="google-article" value={article} onChange={(e) => { setArticle(e.target.value); setContent(""); }} className="w-full mt-2 border rounded-md p-2 bg-background"><option value="">Custom company update</option>{articles.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}</select></div>
          {article && <Button variant="outline" disabled={busy} onClick={() => run({ action: "preview", post_id: article })}>Prepare article update</Button>}
          <div><Label htmlFor="google-copy">Update text</Label><Textarea id="google-copy" className="mt-2 min-h-40" value={content} maxLength={1500} onChange={(e) => setContent(e.target.value)} /><p className="text-xs text-muted-foreground text-right mt-1">{content.length}/1500</p></div>
          <div><Label htmlFor="google-link">Website link</Label><Input id="google-link" value={link} onChange={(e) => setLink(e.target.value)} /></div>
          <Button disabled={busy || !content.trim() || !overview.verified} onClick={() => setConfirm("publish")}><Send size={16} className="mr-2" />Publish to Google</Button>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Update history</h3>
          <div className="space-y-3 max-h-96 overflow-auto">
            {overview.posts.length === 0 && <p className="text-sm text-muted-foreground">No updates submitted from Social Studio yet.</p>}
            {overview.posts.map((p) => <div key={p.id} className="border rounded-lg p-4">
              <p className="text-xs font-semibold text-shivraj-700 mb-2">{p.status} {p.google_state ? `· ${p.google_state}` : ""}</p>
              <p className="whitespace-pre-wrap line-clamp-3 text-sm">{p.content}</p>
              {p.error_message && <p className="text-destructive text-xs mt-2">{p.error_message}</p>}
              {p.status === "unknown" && <p className="text-muted-foreground text-xs mt-2">Check the Google listing before trying any new update; submission outcome is unknown.</p>}
              {p.external_url && <a href={p.external_url} target="_blank" rel="noopener noreferrer" className="text-shivraj-600 underline text-sm">View on Google</a>}
              {p.status === "failed" && <Button size="sm" variant="outline" disabled={busy} className="mt-3" onClick={() => setConfirm(p)}>Retry update</Button>}
            </div>)}
          </div>
        </div>
      </div>
    </>}
    <div className="mt-8 border-t pt-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-semibold">Industrial search opportunities</h3><Button variant="outline" disabled={busy} onClick={() => run({ action: "search_insights" })}><Search size={16} className="mr-2" />Check Google searches</Button></div>
      {insights && <><p className="text-xs text-muted-foreground mt-3">{insights.startDate} to {insights.endDate} · Top relevant queries, not all search traffic</p><div className="overflow-x-auto mt-3"><table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2">Query</th><th>Clicks</th><th>Impressions</th><th>Position</th></tr></thead><tbody>{insights.queries.map((q) => <tr key={q.query} className="border-b"><td className="py-2 pr-3">{q.query}</td><td className="text-center">{q.clicks}</td><td className="text-center">{q.impressions}</td><td className="text-center">{q.position.toFixed(1)}</td></tr>)}</tbody></table>{insights.queries.length === 0 && <p className="text-muted-foreground py-3">No relevant queries in this period.</p>}</div></>}
    </div>
    <Dialog open={!!confirm} onOpenChange={(open) => !open && setConfirm(null)}><DialogContent><DialogHeader><DialogTitle>{confirm === "auto" ? "Enable weekly Google updates?" : "Publish this Google update?"}</DialogTitle><DialogDescription>Shivraj Enterprise · Google Business Profile{confirm === "auto" ? ". Each newly published weekly article will automatically submit one update to this listing. Google controls approval and visibility." : ". This update will be sent publicly to Google for review."}</DialogDescription></DialogHeader>{confirm && confirm !== "auto" && <div className="max-h-64 overflow-auto whitespace-pre-wrap text-sm border rounded p-3">{typeof confirm === "object" ? confirm.content : content}<p className="mt-3 break-all">{typeof confirm === "object" ? confirm.link : link}</p></div>}<DialogFooter><Button variant="outline" onClick={() => setConfirm(null)}>Cancel</Button><Button disabled={busy} onClick={() => { const action = confirm; setConfirm(null); if (action === "auto") void run({ action: "auto_publish", enabled: true }); else if (action && typeof action === "object") void run({ action: "retry", retry_id: action.id }); else void run({ action: "publish", content, link, ...(article ? { post_id: article } : {}) }); }}>{confirm === "auto" ? "Enable weekly updates" : "Publish update"}</Button></DialogFooter></DialogContent></Dialog>
  </section>;
}