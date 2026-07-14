import { useState } from "react";
import { Link2, Twitter, Linkedin, Facebook, Check, Share2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ShareButtons = ({ url, title }: { url: string; title: string }) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, url }); return; } catch { /* fall through */ }
    }
    copy();
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({ title: "Link copied", description: "Article link copied to clipboard." });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL manually.", variant: "destructive" });
    }
  };

  const btn =
    "inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-shivraj-100 text-shivraj-700 hover:text-white hover:bg-shivraj-600 hover:border-shivraj-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200";

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <a className={btn} href={`https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter"><Twitter size={16} /></a>
      <a className={btn} href={`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn"><Linkedin size={16} /></a>
      <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook"><Facebook size={16} /></a>
      <button className={btn} onClick={copy} aria-label="Copy link">{copied ? <Check size={16} /> : <Link2 size={16} />}</button>
      <button className={btn + " md:hidden"} onClick={share} aria-label="Share"><Share2 size={16} /></button>
    </div>
  );
};

export default ShareButtons;
