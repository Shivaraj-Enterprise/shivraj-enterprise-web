import { useEffect, useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export type Draft = { id: string; content: string; article_url: string | null };
const SITE = "https://shivraj-enterprise.lovable.app";
const LIMIT = 2900;

const call = async (body: Record<string, unknown>) => {
  const { data, error } = await supabase.functions.invoke("publish-linkedin", { body });
  if (error) {
    let d = error.message;
    if (error instanceof FunctionsHttpError) { try { d = (await error.context.json()).error ?? d; } catch { /* keep */ } }
    throw new Error(d);
  }
  return data;
};

type Props = { articles: { id: string; title: string }[]; editing: Draft | null; onDone: () => void; onClearEdit: () => void };

const SocialComposer = ({ articles, editing, onDone, onClearEdit }: Props) => {
  const [mode, setMode] = useState<"article" | "topic">("article");
  const [articleId, setArticleId] = useState("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [text, setText] = useState("");
  const [link, setLink] = useState(`${SITE}/labour-cost-calculator`);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (editing) { setText(editing.content); setLink(editing.article_url ?? ""); setDraftId(editing.id); }
  }, [editing]);

  const reset = () => { setText(""); setDraftId(null); setTopic(""); setNotes(""); onClearEdit(); };
  const run = async (key: string, fn: () => Promise<void>) => {
    if (busy) return; setBusy(key);
    try { await fn(); } catch (e) { toast.error(e instanceof Error ? e.message : String(e)); }
    setBusy(null);
  };

  const generate = () => run("gen", async () => {
    const d = await call(mode === "article" ? { action: "generate", post_id: articleId } : { action: "generate", topic, notes, link: link || undefined });
    setText(d.content); if (d.link) setLink(d.link);
  });
  const save = () => run("save", async () => {
    const d = await call({ action: "save_draft", content: text, link: link || undefined, draft_id: draftId ?? undefined });
    setDraftId(d.id); toast.success("Draft saved"); onDone();
  });
  const publish = () => run("pub", async () => {
    const d = await call({ action: "publish_custom", content: text, link: link || undefined, draft_id: draftId ?? undefined });
    if (d?.skipped) toast.info(`Not posted: ${d.skipped}`); else { toast.success("Posted to LinkedIn"); reset(); }
    onDone();
  });

  const canGen = mode === "article" ? !!articleId : topic.trim().length > 2;
  const over = text.length > LIMIT;

  return (
    <div className="border rounded-lg p-5 bg-card mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-shivraj-800">{draftId ? "Edit draft" : "Write a new LinkedIn post"}</h2>
        {(draftId || text) && <Button size="sm" variant="ghost" onClick={reset}>Start over</Button>}
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant={mode === "article" ? "default" : "outline"} onClick={() => setMode("article")}>From a blog article</Button>
        <Button size="sm" variant={mode === "topic" ? "default" : "outline"} onClick={() => setMode("topic")}>Own topic</Button>
      </div>
      {mode === "article" ? (
        <select aria-label="Choose article" className="w-full border rounded px-3 py-2 text-sm bg-background" value={articleId} onChange={(e) => setArticleId(e.target.value)}>
          <option value="">Choose an article…</option>
          {articles.map((a) => <option key={a.id} value={a.id}>{a.title}</option>)}
        </select>
      ) : (
        <div className="space-y-2">
          <Input placeholder="Topic, e.g. Handling festival-season absenteeism in Vapi factories" value={topic} onChange={(e) => setTopic(e.target.value)} maxLength={300} />
          <Textarea placeholder="Optional notes or facts to include" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} maxLength={1000} />
        </div>
      )}
      <Button size="sm" variant="secondary" disabled={!canGen || !!busy} onClick={generate}>{busy === "gen" ? "Writing…" : "Write draft with AI"}</Button>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="post-text">Post text</label>
          <Textarea id="post-text" rows={12} value={text} onChange={(e) => setText(e.target.value)} placeholder="Write or generate your post…" />
          <div className={`text-xs ${over ? "text-destructive" : "text-muted-foreground"}`}>{text.length} / {LIMIT} characters</div>
          <label className="text-sm font-medium" htmlFor="post-link">Link to attach (optional)</label>
          <Input id="post-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" />
          <div className="flex flex-wrap gap-2 text-xs">
            <button type="button" className="underline text-shivraj-600" onClick={() => setLink(`${SITE}/labour-cost-calculator`)}>Labour cost calculator</button>
            <button type="button" className="underline text-shivraj-600" onClick={() => setLink(`${SITE}/services`)}>Services</button>
            <button type="button" className="underline text-shivraj-600" onClick={() => setLink(`${SITE}/contact`)}>Contact</button>
            <button type="button" className="underline text-muted-foreground" onClick={() => setLink("")}>No link</button>
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">Preview</div>
          <div className="border rounded-lg bg-background p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-9 w-9 rounded-full bg-shivraj-600 text-primary-foreground flex items-center justify-center text-sm font-bold">SE</div>
              <div><div className="text-sm font-semibold">Shivraj Enterprise</div><div className="text-xs text-muted-foreground">Now · Public</div></div>
            </div>
            <p className="whitespace-pre-wrap text-sm min-h-[80px]">{text || <span className="text-muted-foreground">Your post will appear here.</span>}</p>
            {link && <div className="mt-3 border rounded p-2 text-xs text-muted-foreground truncate">🔗 {link}</div>}
          </div>
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <Button variant="outline" disabled={!text.trim() || over || !!busy} onClick={save}>{busy === "save" ? "Saving…" : draftId ? "Update draft" : "Save draft"}</Button>
        <Button disabled={!text.trim() || over || !!busy} onClick={() => setConfirm(true)}>{busy === "pub" ? "Publishing…" : "Publish to LinkedIn"}</Button>
      </div>
      <Dialog open={confirm} onOpenChange={setConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Publish this post to LinkedIn?</DialogTitle>
            <DialogDescription>It will go live publicly on the connected LinkedIn profile exactly as shown.</DialogDescription>
          </DialogHeader>
          <p className="whitespace-pre-wrap text-sm max-h-60 overflow-auto border rounded p-3">{text}</p>
          {link && <p className="text-xs text-muted-foreground truncate">Link: {link}</p>}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirm(false)}>Cancel</Button>
            <Button onClick={() => { setConfirm(false); publish(); }}>Publish now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
export default SocialComposer;
