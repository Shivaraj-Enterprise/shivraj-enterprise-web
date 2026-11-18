import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import AdminGate from "@/components/admin/AdminGate";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { toast } from "sonner";

type Row = {
  id: string; platform: string; content: string; article_url: string | null; status: string;
  external_urn: string | null; error_message: string | null; source: string;
  created_at: string; published_at: string | null;
};

const postUrl = (urn: string | null) => (urn ? `https://www.linkedin.com/feed/update/${urn}/` : null);
const statusVariant = (s: string) => (s === "published" ? "default" : s === "failed" ? "destructive" : "secondary");

const List = () => {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [status, setStatus] = useState("All");
  const [confirmRow, setConfirmRow] = useState<Row | null>(null);
  const [retrying, setRetrying] = useState<string | null>(null);
  const [articles, setArticles] = useState<{ id: string; title: string }[]>([]);
  const [articleId, setArticleId] = useState("");
  const [confirmNew, setConfirmNew] = useState(false);
  useEffect(() => {
    supabase.from("blog_posts").select("id, title").eq("published", true).order("created_at", { ascending: false }).limit(30)
      .then(({ data }) => setArticles(data ?? []));
  }, []);
  const publishNew = async () => {
    if (retrying || !articleId) return;
    setRetrying(articleId);
    const { data, error } = await supabase.functions.invoke("publish-linkedin", { body: { post_id: articleId, source: "manual" } });
    if (error) {
      let details = error.message;
      if (error instanceof FunctionsHttpError) { try { details = (await error.context.json()).error ?? details; } catch { /* keep */ } }
      toast.error(`LinkedIn post failed: ${details}`);
    } else if (data?.skipped) toast.info(`Not posted: ${data.skipped}`);
    else toast.success("Posted to LinkedIn");
    setRetrying(null);
    await load();
  };
  const load = () => supabase.from("social_posts").select("*").order("created_at", { ascending: false })
    .then(({ data }) => setRows((data as Row[]) ?? []));
  useEffect(() => { load(); }, []);
  const retry = async (row: Row) => {
    if (retrying) return;
    setRetrying(row.id);
    setRows((rs) => rs?.map((r) => (r.id === row.id ? { ...r, status: "publishing" } : r)) ?? rs);
    const { data, error } = await supabase.functions.invoke("publish-linkedin", { body: { retry_of: row.id } });
    if (error) {
      let details = error.message;
      if (error instanceof FunctionsHttpError) { try { details = (await error.context.json()).error ?? details; } catch { /* keep */ } }
      toast.error(`LinkedIn post failed again: ${details}`);
    } else if (data?.skipped) toast.info(`Not posted: ${data.skipped}`);
    else toast.success("Posted to LinkedIn");
    setRetrying(null);
    await load();
  };
  const all = rows ?? [];
  const shown = all.filter((r) => status === "All" || r.status === status);
  const count = (s: string) => all.filter((r) => r.status === s).length;
  return (
    <div className="container mx-auto py-10">
      <Helmet><title>Social Studio – Admin</title><meta name="robots" content="noindex" /></Helmet>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-shivraj-800">Social Studio</h1>
        <Link to="/admin/submissions" className="text-sm text-shivraj-600">← Admin</Link>
      </div>
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[["Total posts", all.length], ["Published", count("published")], ["Failed", count("failed")]].map(([l, v]) => (
          <div key={l as string} className="border rounded-lg p-4 bg-card"><div className="text-sm text-muted-foreground">{l}</div><div className="text-2xl font-bold">{v}</div></div>
        ))}
      </div>
      <div className="border rounded-lg p-4 bg-card mb-6 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium">Post an article to LinkedIn now:</span>
        <select aria-label="Choose article" className="border rounded px-3 py-2 text-sm flex-1 min-w-[200px]" value={articleId} onChange={(e) => setArticleId(e.target.value)}>
          <option value="">Choose an article…</option>
          {articles.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
        <Button size="sm" disabled={!articleId || !!retrying} onClick={() => setConfirmNew(true)}>{retrying === articleId && articleId ? "Publishing…" : "Publish to LinkedIn"}</Button>
      </div>
      <select className="border rounded px-3 py-2 text-sm mb-4" value={status} onChange={(e) => setStatus(e.target.value)}>
        {["All", "published", "failed", "publishing", "draft"].map((s) => <option key={s}>{s}</option>)}
      </select>
      <div className="space-y-4">
        {shown.map((r) => {
          const url = postUrl(r.external_urn);
          return (
            <div key={r.id} className="border rounded-lg p-4 bg-card">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-sm">
                <Badge variant={statusVariant(r.status)}>{r.status}</Badge>
                <span className="capitalize">{r.platform}</span>
                <span className="text-muted-foreground">· {r.source === "auto" ? "Monday auto-post" : "Manual"}</span>
                <span className="text-muted-foreground ml-auto">{new Date(r.published_at ?? r.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</span>
              </div>
              <p className="whitespace-pre-wrap text-sm line-clamp-6">{r.content}</p>
              {r.error_message && <p className="text-sm text-destructive mt-2">Error: {r.error_message}</p>}
              <div className="flex gap-4 mt-3 text-sm">
                {url && <a href={url} target="_blank" rel="noopener noreferrer" className="text-shivraj-600 underline">View on LinkedIn</a>}
                {r.article_url && <a href={r.article_url} target="_blank" rel="noopener noreferrer" className="text-shivraj-600 underline">View article</a>}
                {r.status === "failed" && r.platform === "linkedin" && (
                  <Button size="sm" variant="outline" className="ml-auto" disabled={!!retrying} onClick={() => setConfirmRow(r)}>
                    {retrying === r.id ? "Retrying…" : "Retry post"}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        {rows && shown.length === 0 && <p className="p-6 text-center text-muted-foreground border rounded-lg">No LinkedIn posts yet. The first one goes out after next Monday's article.</p>}
      </div>
      <Dialog open={confirmNew} onOpenChange={setConfirmNew}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish this article to LinkedIn?</DialogTitle>
            <DialogDescription>A post will go live publicly on the connected LinkedIn profile. Each article can only be posted once.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmNew(false)}>Cancel</Button>
            <Button onClick={() => { setConfirmNew(false); publishNew(); }}>Publish now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={!!confirmRow} onOpenChange={(o) => !o && setConfirmRow(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish this post to LinkedIn?</DialogTitle>
            <DialogDescription>
              A fresh post for this article will go live publicly on the company LinkedIn profile. If the article was already posted, nothing will be published again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmRow(null)}>Cancel</Button>
            <Button onClick={() => { const r = confirmRow; setConfirmRow(null); if (r) retry(r); }}>Publish now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const AdminSocialStudio = () => { const auth = useAdminAuth(); return <AdminGate auth={auth}><List /></AdminGate>; };
export default AdminSocialStudio;
