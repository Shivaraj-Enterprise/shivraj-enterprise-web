import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Twitter, Linkedin, Facebook, MessageCircle, Mail, Copy, Download, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { buildShareText, buildTweetText, coverFor, SITE_ORIGIN, type ShareTone } from "@/lib/shareSummary";

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  url: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  questions?: string[];
  readMinutes?: number;
  slug?: string;
}

const TONES: { id: ShareTone; label: string; hint: string }[] = [
  { id: "professional", label: "💼 Professional", hint: "Best for LinkedIn" },
  { id: "catchy", label: "⚡ Quick & catchy", hint: "Best for WhatsApp / X" },
  { id: "teaser", label: "🤔 Question teaser", hint: "Makes people curious" },
];

const ShareMenu = ({ open, onOpenChange, url, title, excerpt, tags = [], questions = [], readMinutes, slug }: Props) => {
  const [tone, setTone] = useState<ShareTone>("professional");
  const [text, setText] = useState("");
  const cover = coverFor(title, slug);
  const enc = encodeURIComponent;

  useEffect(() => {
    setText(buildShareText({ title, url, excerpt, tags, questions, readMinutes, tone }));
  }, [tone, title, url, excerpt, tags.join(","), questions.join("|"), readMinutes]);

  const copy = async (msg = "Share text copied") => {
    try {
      await navigator.clipboard.writeText(text);
      toast({ title: msg, description: "Just paste it into your post." });
    } catch {
      toast({ title: "Copy failed", description: "Please select the text and copy it.", variant: "destructive" });
    }
  };
  const openWin = (u: string) => window.open(u, "_blank", "noopener,noreferrer,width=640,height=600");
  const viaCopy = (u: string, p: string) => async () => { await copy(`Post copied for ${p} — paste it`); openWin(u); };

  const downloadQr = () => {
    const c = document.getElementById("share-qr") as HTMLCanvasElement | null;
    if (!c) return;
    const a = document.createElement("a");
    a.href = c.toDataURL("image/png");
    a.download = `${slug || "article"}-qr.png`;
    a.click();
  };

  const btn = "flex flex-col items-center gap-1 p-3 rounded-xl border border-shivraj-100 hover:bg-shivraj-50 hover:-translate-y-0.5 transition text-xs text-shivraj-800";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles size={18} className="text-shivraj-600" /> Share this article</DialogTitle>
          <DialogDescription>Pick a style, edit if you like, then share. Cover image and hashtags are ready.</DialogDescription>
        </DialogHeader>

        <img src={cover.replace(SITE_ORIGIN, "")} alt={`Cover image for ${title}`} width={1200} height={630} className="w-full rounded-xl aspect-[1200/630] object-cover" />

        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTone(t.id)}
              aria-pressed={tone === t.id}
              className={`px-3 py-2 rounded-full text-sm border transition ${tone === t.id ? "bg-shivraj-600 text-white border-shivraj-600" : "border-shivraj-100 text-shivraj-800 hover:bg-shivraj-50"}`}
              title={t.hint}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="text-xs font-semibold uppercase tracking-wider text-shivraj-600" htmlFor="share-text">Preview — edit before sharing</label>
        <textarea id="share-text" value={text} onChange={(e) => setText(e.target.value)} rows={10} className="w-full rounded-xl border border-shivraj-100 p-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-shivraj-500" />

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          <button className={btn} onClick={viaCopy(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, "LinkedIn")}><Linkedin size={18} />LinkedIn</button>
          <button className={btn} onClick={() => openWin(`https://twitter.com/intent/tweet?text=${enc(tone === "professional" ? buildTweetText({ title, url, tags, questions }) : text.slice(0, 280))}`)}><Twitter size={18} />X</button>
          <button className={btn} onClick={viaCopy(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, "Facebook")}><Facebook size={18} />Facebook</button>
          <button className={btn} onClick={() => openWin(`https://wa.me/?text=${enc(text)}`)}><MessageCircle size={18} />WhatsApp</button>
          <a className={btn} href={`mailto:?subject=${enc(title)}&body=${enc(text)}`}><Mail size={18} />Email</a>
          <button className={btn} onClick={() => copy()}><Copy size={18} />Copy</button>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-xl bg-shivraj-50">
          <QRCodeCanvas id="share-qr" value={url} size={110} includeMargin />
          <div className="flex-1 text-sm text-gray-700">
            <p className="font-semibold text-shivraj-900 mb-1">📱 QR code & cover image</p>
            <p className="mb-3">Scan to open on phone, or print it on quotations. Download the cover to attach to Instagram or LinkedIn posts.</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={downloadQr} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-shivraj-100 text-shivraj-800 text-xs"><Download size={14} /> QR code</button>
              <a href={cover.replace(SITE_ORIGIN, "")} download className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-white border border-shivraj-100 text-shivraj-800 text-xs"><Download size={14} /> Cover image</a>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareMenu;
