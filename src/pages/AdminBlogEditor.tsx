import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Upload, X } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";
import RichTextEditor from "@/components/blog/RichTextEditor";

const BUCKET = "blog-assets";
const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const schema = z.object({
  title: z.string().trim().min(3).max(200),
  slug: z.string().trim().min(3).max(120).regex(/^[a-z0-9-]+$/, "Lowercase letters, numbers and hyphens only"),
  excerpt: z.string().trim().max(500).optional(),
  content: z.string().min(1, "Content is required"),
});

type Tag = { id: string; slug: string; name: string };

const AdminBlogEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const auth = useAdminAuth();
  const isNew = !id;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [cover, setCover] = useState<string | null>(null);
  const [published, setPublished] = useState(false);
  const [publishedAt, setPublishedAt] = useState<string>("");
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<Set<string>>(new Set());
  const [newTagName, setNewTagName] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!auth.isAdmin) return;
    (async () => {
      const { data: tags } = await supabase.from("blog_tags").select("id, slug, name").order("name");
      setAllTags((tags ?? []) as Tag[]);

      if (!isNew) {
        const { data: post } = await supabase
          .from("blog_posts")
          .select("title, slug, excerpt, content, cover_image_url, published, published_at, blog_post_tags(tag_id)")
          .eq("id", id!)
          .maybeSingle();
        if (post) {
          setTitle(post.title);
          setSlug(post.slug);
          setSlugTouched(true);
          setExcerpt(post.excerpt ?? "");
          setContent(post.content ?? "");
          setCover(post.cover_image_url);
          setPublished(post.published);
          setPublishedAt(post.published_at ? post.published_at.slice(0, 16) : "");
          const ids = ((post.blog_post_tags ?? []) as { tag_id: string }[]).map((x) => x.tag_id);
          setSelectedTagIds(new Set(ids));
        }
      }
    })();
  }, [auth.isAdmin, id, isNew]);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const onCoverUpload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) return toast({ title: "Too large", description: "Max 5 MB", variant: "destructive" });
    setUploading(true);
    const path = `covers/${Date.now()}-${slugify(file.name)}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: file.type, upsert: false });
    if (error) { setUploading(false); return toast({ title: "Upload failed", description: error.message, variant: "destructive" }); }
    const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    setUploading(false);
    if (signed?.signedUrl) {
      setCover(signed.signedUrl);
      toast({ title: "Image uploaded" });
    }
  };

  const addTag = async () => {
    const name = newTagName.trim();
    if (!name) return;
    const tagSlug = slugify(name);
    const { data, error } = await supabase.from("blog_tags").insert({ name, slug: tagSlug }).select().single();
    if (error) return toast({ title: "Failed", description: error.message, variant: "destructive" });
    const t = data as Tag;
    setAllTags((arr) => [...arr, t]);
    setSelectedTagIds((s) => new Set(s).add(t.id));
    setNewTagName("");
  };

  const toggleTag = (tagId: string) => {
    setSelectedTagIds((s) => {
      const next = new Set(s);
      if (next.has(tagId)) next.delete(tagId); else next.add(tagId);
      return next;
    });
  };

  const onSave = async () => {
    const parsed = schema.safeParse({ title, slug, excerpt, content });
    if (!parsed.success) {
      return toast({ title: "Validation error", description: parsed.error.issues[0].message, variant: "destructive" });
    }
    setSaving(true);
    const payload = {
      title,
      slug,
      excerpt: excerpt || null,
      content,
      cover_image_url: cover,
      published,
      published_at: published ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : null,
      author_id: auth.userId,
    };

    let postId = id;
    if (isNew) {
      const { data, error } = await supabase.from("blog_posts").insert(payload).select("id").single();
      if (error) { setSaving(false); return toast({ title: "Save failed", description: error.message, variant: "destructive" }); }
      postId = data.id;
    } else {
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", id!);
      if (error) { setSaving(false); return toast({ title: "Save failed", description: error.message, variant: "destructive" }); }
    }

    // Sync tags
    await supabase.from("blog_post_tags").delete().eq("post_id", postId!);
    if (selectedTagIds.size > 0) {
      const rows = Array.from(selectedTagIds).map((tag_id) => ({ post_id: postId!, tag_id }));
      await supabase.from("blog_post_tags").insert(rows);
    }

    setSaving(false);
    toast({ title: "Saved" });
    navigate("/admin/blog");
  };

  return (
    <AdminGate auth={auth}>
      <Helmet>
        <title>{isNew ? "New Post" : "Edit Post"} – Shivraj Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/blog"><Button variant="outline" size="sm"><ArrowLeft size={16} className="mr-2" />Back</Button></Link>
              <h1 className="text-2xl font-bold text-shivraj-800">{isNew ? "New Post" : "Edit Post"}</h1>
            </div>
            <Button onClick={onSave} disabled={saving} className="bg-shivraj-600 hover:bg-shivraj-700">
              <Save size={16} className="mr-2" />{saving ? "Saving…" : "Save"}
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 space-y-5">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={200} />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" value={slug} onChange={(e) => { setSlugTouched(true); setSlug(e.target.value); }} />
              <p className="text-xs text-muted-foreground mt-1">URL: /blog/{slug || "your-slug"}</p>
            </div>
            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={500} rows={2} />
            </div>

            <div>
              <Label>Cover image</Label>
              {cover ? (
                <div className="relative inline-block mt-1">
                  <img src={cover} alt="Cover" className="max-h-48 rounded border" />
                  <button type="button" onClick={() => setCover(null)} className="absolute -top-2 -right-2 bg-white rounded-full border p-1 shadow">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="mt-1">
                  <Input type="file" accept="image/*" disabled={uploading}
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) onCoverUpload(f); }} />
                  {uploading && <p className="text-xs text-muted-foreground mt-1"><Upload size={12} className="inline mr-1" />Uploading…</p>}
                </div>
              )}
            </div>

            <div>
              <Label>Content</Label>
              <RichTextEditor value={content} onChange={setContent} />
            </div>

            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {allTags.map((t) => (
                  <button key={t.id} type="button" onClick={() => toggleTag(t.id)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      selectedTagIds.has(t.id) ? "bg-shivraj-600 text-white border-shivraj-600" : "bg-white text-shivraj-700 border-shivraj-200"
                    }`}>
                    {t.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Input placeholder="New tag name" value={newTagName} onChange={(e) => setNewTagName(e.target.value)} />
                <Button type="button" variant="outline" onClick={addTag}>Add tag</Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 items-end pt-4 border-t">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
                <span className="font-medium">Published</span>
              </label>
              <div>
                <Label htmlFor="published_at">Publish date (optional)</Label>
                <Input id="published_at" type="datetime-local" value={publishedAt} onChange={(e) => setPublishedAt(e.target.value)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminBlogEditor;
