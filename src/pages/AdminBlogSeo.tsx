import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, RefreshCw, CheckCircle2, XCircle, ChevronDown, ChevronRight } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";

type SeoCheck = { id: string; label: string; pass: boolean; detail?: string; weight: number };
type SeoReport = {
  checks: SeoCheck[];
  schema: { blogPosting?: unknown; faqPage?: unknown; breadcrumb?: unknown };
  rewrite_history?: Array<{ attempt: number; score: number }>;
};
type Row = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updated_at: string;
  seo_score: number | null;
  seo_report: SeoReport | null;
};

const scoreColor = (n: number | null) => {
  if (n == null) return "bg-gray-400";
  if (n >= 80) return "bg-green-600";
  if (n >= 60) return "bg-amber-500";
  return "bg-red-600";
};

const AdminBlogSeo = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [running, setRunning] = useState<Record<string, boolean>>({});

  const load = async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, published, updated_at, seo_score, seo_report")
      .order("updated_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setRows((data ?? []) as unknown as Row[]);
  };

  useEffect(() => { if (auth.isAdmin) load(); /* eslint-disable-next-line */ }, [auth.isAdmin]);

  const rerun = async (id: string) => {
    setRunning((r) => ({ ...r, [id]: true }));
    try {
      const { data, error } = await supabase.functions.invoke("auto-generate-article", {
        body: { post_id: id },
      });
      if (error) throw error;
      toast({ title: "Re-generated", description: `New SEO score: ${(data as { seo_score?: number })?.seo_score ?? "?"}` });
      await load();
    } catch (e) {
      toast({ title: "Re-run failed", description: e instanceof Error ? e.message : String(e), variant: "destructive" });
    } finally {
      setRunning((r) => ({ ...r, [id]: false }));
    }
  };

  return (
    <AdminGate auth={auth}>
      <Helmet>
        <title>Blog SEO – Shivraj Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate("/admin/blog")}>
                <ArrowLeft size={16} className="mr-2" />Back to posts
              </Button>
              <h1 className="text-2xl font-bold text-shivraj-800">Blog SEO Dashboard</h1>
            </div>
          </div>

          <div className="space-y-3">
            {rows.map((r) => {
              const isOpen = !!expanded[r.id];
              const report = r.seo_report;
              return (
                <div key={r.id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <div className="flex flex-wrap items-center gap-4 p-4">
                    <button
                      className="flex items-center gap-2 flex-1 min-w-0 text-left"
                      onClick={() => setExpanded((s) => ({ ...s, [r.id]: !isOpen }))}
                    >
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      <div className="min-w-0">
                        <div className="font-medium text-shivraj-800 truncate">{r.title}</div>
                        <div className="text-xs text-muted-foreground truncate">/{r.slug}</div>
                      </div>
                    </button>
                    <div className={`text-white text-sm font-semibold rounded-full px-3 py-1 ${scoreColor(r.seo_score)}`}>
                      {r.seo_score ?? "—"}/100
                    </div>
                    {r.published ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                    <Button size="sm" variant="outline" onClick={() => rerun(r.id)} disabled={running[r.id]}>
                      <RefreshCw size={14} className={`mr-2 ${running[r.id] ? "animate-spin" : ""}`} />
                      {running[r.id] ? "Running…" : "Re-run"}
                    </Button>
                    <Link to={`/blog/${r.slug}`} target="_blank">
                      <Button size="sm" variant="ghost">View</Button>
                    </Link>
                  </div>

                  {isOpen && (
                    <div className="border-t border-gray-100 p-4 space-y-4 bg-shivraj-50/40">
                      {!report && <p className="text-sm text-muted-foreground">No SEO report yet. Click Re-run to generate one.</p>}
                      {report && (
                        <>
                          <div>
                            <h3 className="font-semibold text-sm mb-2">SEO checks</h3>
                            <ul className="grid sm:grid-cols-2 gap-2">
                              {report.checks?.map((c) => (
                                <li key={c.id} className="flex items-start gap-2 text-sm bg-white rounded border border-gray-100 p-2">
                                  {c.pass ? <CheckCircle2 size={16} className="text-green-600 mt-0.5" /> : <XCircle size={16} className="text-red-600 mt-0.5" />}
                                  <div className="min-w-0">
                                    <div className="font-medium">{c.label}</div>
                                    {c.detail && <div className="text-xs text-muted-foreground">{c.detail}</div>}
                                    <div className="text-xs text-muted-foreground">weight {c.weight}</div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                          {report.rewrite_history && report.rewrite_history.length > 1 && (
                            <div>
                              <h3 className="font-semibold text-sm mb-1">Rewrite history</h3>
                              <div className="text-xs text-muted-foreground">
                                {report.rewrite_history.map((h) => `#${h.attempt}: ${h.score}`).join(" → ")}
                              </div>
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-sm mb-2">Schema.org blocks</h3>
                            <div className="grid gap-2 md:grid-cols-3">
                              {(["blogPosting","faqPage","breadcrumb"] as const).map((k) => (
                                <details key={k} className="bg-white rounded border border-gray-100 p-2 text-xs">
                                  <summary className="cursor-pointer font-medium">{k}</summary>
                                  <pre className="mt-2 max-h-64 overflow-auto text-[11px] leading-relaxed">
{JSON.stringify(report.schema?.[k] ?? null, null, 2)}
                                  </pre>
                                </details>
                              ))}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            {!rows.length && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center text-muted-foreground">
                No posts yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminBlogSeo;
