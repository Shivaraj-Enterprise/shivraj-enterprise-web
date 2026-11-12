import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { Sparkles } from "lucide-react";

type Row = {
  id: string; week: string; keyword: string; scope: string; kind: string; score: number | null;
  chosen: boolean; reason: string | null; sources: { title: string; url: string }[]; post_id: string | null;
};

const WeeklyTopicsPanel = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [running, setRunning] = useState(false);

  const load = async () => {
    const { data } = await supabase.from("blog_topic_history").select("*").order("created_at", { ascending: false }).limit(60);
    setRows((data as unknown as Row[]) ?? []);
  };
  useEffect(() => { load(); }, []);

  const runNow = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke("auto-generate-article", { body: { force: true } });
    setRunning(false);
    if (error || data?.ok === false) {
      toast({ title: "Could not create article", description: data?.error ?? data?.paused ?? error?.message, variant: "destructive" });
    } else if (data?.skipped) {
      toast({ title: "Nothing published", description: data.skipped });
    } else {
      toast({ title: "Article published", description: data?.post?.title });
    }
    load();
  };

  const weeks = [...new Set(rows.map((r) => r.week))];

  return (
    <div className="bg-card rounded-lg shadow-sm border border-border p-5 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-shivraj-800">Weekly trending topics</h2>
          <p className="text-sm text-muted-foreground">Found fresh every Monday from the last 7 days of news.</p>
        </div>
        <Button onClick={runNow} disabled={running}>
          <Sparkles size={16} className="mr-2" />{running ? "Working… (2–4 min)" : "Generate this week's article now"}
        </Button>
      </div>
      {weeks.length === 0 && <p className="text-sm text-muted-foreground">No topics yet.</p>}
      {weeks.map((w) => (
        <div key={w} className="space-y-2">
          <h3 className="text-sm font-semibold text-foreground">{w}</h3>
          <ul className="space-y-2">
            {rows.filter((r) => r.week === w).map((r) => (
              <li key={r.id} className={`rounded-md border p-3 text-sm ${r.chosen ? "border-primary bg-primary/5" : "border-border"}`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{r.keyword}</span>
                  <Badge variant="outline">{r.scope}</Badge>
                  <Badge variant="secondary">{r.kind}</Badge>
                  {r.score != null && <span className="text-muted-foreground">score {r.score}</span>}
                  {r.chosen && <Badge>Chosen</Badge>}
                </div>
                {r.reason && <p className="text-muted-foreground mt-1">{r.reason}</p>}
                {r.sources?.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-x-3">
                    {r.sources.slice(0, 3).map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-xs">{s.title?.slice(0, 70) || "source"}</a>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default WeeklyTopicsPanel;
