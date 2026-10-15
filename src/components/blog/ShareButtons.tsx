import { useState } from "react";
import { Link2, Twitter, Linkedin, Facebook, Check, Share2, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { buildShareText, buildTweetText } from "@/lib/shareSummary";

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt?: string;
  tags?: string[];
}

const ShareButtons = ({ url, title, excerpt, tags = [] }: ShareButtonsProps) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;

  const shareText = buildShareText({ title, url, excerpt, tags });
  const tweetText = buildTweetText({ title, url, excerpt, tags });

  const copyText = async (label = "Share text copied") => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({ title: label, description: "Summary, hashtags and link are on your clipboard — just paste." });
      setTimeout(() => setCopied(false), 1800);
      return true;
    } catch {
      toast({ title: "Copy failed", description: "Please copy the URL manually.", variant: "destructive" });
      return false;
    }
  };

  // LinkedIn/Facebook no longer accept pre-filled text, so copy the summary for pasting.
  const shareWithCopiedText = (shareUrl: string, platform: string) => async () => {
    await copyText(`Summary copied for ${platform}`);
    window.open(shareUrl, "_blank", "noopener,noreferrer,width=600,height=560");
  };

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText, url });
        return;
      } catch { /* fall through */ }
    }
    copyText();
  };

  const btn =
    "inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-shivraj-100 text-shivraj-700 hover:text-white hover:bg-shivraj-600 hover:border-shivraj-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200";

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <a
        className={btn}
        href={`https://twitter.com/intent/tweet?text=${enc(tweetText)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Twitter with summary and hashtags"
        title="Share on Twitter (summary + hashtags included)"
      >
        <Twitter size={16} />
      </a>
      <button
        className={btn}
        onClick={shareWithCopiedText(`https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, "LinkedIn")}
        aria-label="Share on LinkedIn (copies summary to paste)"
        title="Share on LinkedIn — summary copied, just paste it"
      >
        <Linkedin size={16} />
      </button>
      <button
        className={btn}
        onClick={shareWithCopiedText(`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, "Facebook")}
        aria-label="Share on Facebook (copies summary to paste)"
        title="Share on Facebook — summary copied, just paste it"
      >
        <Facebook size={16} />
      </button>
      <a
        className={btn}
        href={`https://wa.me/?text=${enc(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp with summary"
        title="Share on WhatsApp (summary included)"
      >
        <MessageCircle size={16} />
      </a>
      <button
        className={btn}
        onClick={() => copyText()}
        aria-label="Copy share text with summary and hashtags"
        title="Copy share text (summary + hashtags + link)"
      >
        {copied ? <Check size={16} /> : <Link2 size={16} />}
      </button>
      <button className={btn + " md:hidden"} onClick={share} aria-label="Share" title="Share">
        <Share2 size={16} />
      </button>
    </div>
  );
};

export default ShareButtons;
