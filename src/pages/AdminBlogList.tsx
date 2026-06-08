import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, LogOut, Plus, Pencil, Trash2 } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";

type Row = {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  published_at: string | null;
  updated_at: string;
};

const AdminBlogList = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("blog_posts")
      .select("id, slug, title, published, published_at, updated_at")
      .order("updated_at", { ascending: false });
    if (error) toast({ title: "Failed to load", description: error.message, variant: "destructive" });
    setRows((data ?? []) as Row[]);
    setLoading(false);
  };

  useEffect(() => { if (auth.isAdmin) load(); /* eslint-disable-next-line */ }, [auth.isAdmin]);

  const onDelete = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) return toast({ title: "Delete failed", description: error.message, variant: "destructive" });
    toast({ title: "Post deleted" });
    load();
  };

  const signOut = async () => { await supabase.auth.signOut(); navigate("/admin/login"); };

  return (
    <AdminGate auth={auth}>
      <Helmet>
        <title>Blog Posts – Shivraj Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/submissions"><Button variant="outline" size="sm"><ArrowLeft size={16} className="mr-2" />Submissions</Button></Link>
              <h1 className="text-2xl font-bold text-shivraj-800">Blog Posts</h1>
            </div>
            <div className="flex gap-2">
              <Link to="/admin/blog/new"><Button className="bg-shivraj-600 hover:bg-shivraj-700"><Plus size={16} className="mr-2" />New Post</Button></Link>
              <Button variant="outline" onClick={signOut}><LogOut size={16} className="mr-2" />Sign out</Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>
                      <div className="font-medium text-shivraj-800">{r.title}</div>
                      <div className="text-xs text-muted-foreground">/{r.slug}</div>
                    </TableCell>
                    <TableCell>
                      {r.published ? <Badge className="bg-green-600">Published</Badge> : <Badge variant="secondary">Draft</Badge>}
                    </TableCell>
                    <TableCell className="text-sm">{r.published_at ? new Date(r.published_at).toLocaleDateString() : "—"}</TableCell>
                    <TableCell className="text-sm">{new Date(r.updated_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/admin/blog/${r.id}/edit`}>
                          <Button variant="ghost" size="sm"><Pencil size={14} /></Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={() => onDelete(r.id)}><Trash2 size={14} className="text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!rows.length && !loading && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No posts yet. Click "New Post" to add one.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminBlogList;
