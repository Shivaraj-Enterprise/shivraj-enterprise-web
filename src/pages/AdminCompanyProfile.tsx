import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { ArrowLeft, LogOut, Upload, FileText, ExternalLink } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import AdminGate from "@/components/admin/AdminGate";

const BUCKET = "company-assets";
const PATH = "company-profile.pdf";
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB

const AdminCompanyProfile = () => {
  const navigate = useNavigate();
  const auth = useAdminAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | null>(null);
  const [meta, setMeta] = useState<{ size: number; updatedAt: string } | null>(null);

  const refresh = async () => {
    const { data: list } = await supabase.storage.from(BUCKET).list("", { search: PATH });
    const found = list?.find((f) => f.name === PATH);
    if (found) {
      setMeta({
        size: (found.metadata as { size?: number } | null)?.size ?? 0,
        updatedAt: found.updated_at ?? found.created_at ?? "",
      });
      const { data: signed } = await supabase.storage.from(BUCKET).createSignedUrl(PATH, 3600);
      setCurrentUrl(signed?.signedUrl ?? null);
    } else {
      setMeta(null);
      setCurrentUrl(null);
    }
  };

  useEffect(() => {
    if (auth.isAdmin) refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.isAdmin]);

  const onUpload = async () => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Invalid file", description: "Please choose a PDF.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File too large", description: "Max 20 MB.", variant: "destructive" });
      return;
    }
    setUploading(true);
    const { error } = await supabase.storage.from(BUCKET).upload(PATH, file, {
      cacheControl: "60",
      upsert: true,
      contentType: "application/pdf",
    });
    setUploading(false);
    if (error) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Company Profile updated", description: "Visitors will see the new PDF immediately." });
    setFile(null);
    refresh();
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  return (
    <AdminGate auth={auth}>
      <Helmet>
        <title>Company Profile PDF – Shivraj Admin</title>
        <meta name="description" content="Upload and replace the public Company Profile PDF for Shivraj Enterprise." />
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="min-h-screen bg-shivraj-50 p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link to="/admin/submissions">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2" size={16} />Submissions
                </Button>
              </Link>
              <h1 className="text-2xl font-bold text-shivraj-800">Company Profile PDF</h1>
            </div>
            <Button variant="outline" onClick={signOut}>
              <LogOut className="mr-2" size={16} />Sign out
            </Button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-shivraj-800 flex items-center gap-2">
              <FileText size={18} /> Current file
            </h2>
            {meta ? (
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Size: {(meta.size / 1024).toFixed(1)} KB</div>
                <div>Last updated: {meta.updatedAt ? new Date(meta.updatedAt).toLocaleString() : "—"}</div>
                {currentUrl && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-shivraj-700 hover:underline"
                  >
                    Preview current PDF <ExternalLink size={14} />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No uploaded file yet — the site is serving the bundled fallback PDF.
              </p>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4">
            <h2 className="font-semibold text-shivraj-800 flex items-center gap-2">
              <Upload size={18} /> Replace PDF
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload a new PDF (max 20 MB). It will instantly replace the file linked from the home page hero and footer.
            </p>
            <div>
              <Label htmlFor="pdf-file">PDF file</Label>
              <Input
                id="pdf-file"
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              {file && (
                <p className="text-xs text-muted-foreground mt-1">
                  Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </p>
              )}
            </div>
            <Button
              onClick={onUpload}
              disabled={!file || uploading}
              className="bg-shivraj-600 hover:bg-shivraj-700"
            >
              <Upload className="mr-2" size={16} />
              {uploading ? "Uploading…" : "Upload & Replace"}
            </Button>
          </div>
        </div>
      </div>
    </AdminGate>
  );
};

export default AdminCompanyProfile;
