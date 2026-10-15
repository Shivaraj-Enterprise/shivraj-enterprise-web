import { useState } from "react";
import { Twitter, Linkedin, MessageCircle, Share2, Sparkles } from "lucide-react";
import { buildShareText, buildTweetText } from "@/lib/shareSummary";
import ShareMenu from "@/components/blog/ShareMenu";

interface ShareButtonsProps {
  url: string;
  title: string;
  excerpt?: string;
  tags?: string[];
  questions?: string[];
  readMinutes?: number;
  slug?: string;
}

const ShareButtons = (props: ShareButtonsProps) => {
  const { url, title, excerpt, tags = [], questions = [], readMinutes } = props;
  const [open, setOpen] = useState(false);
  const enc = encodeURIComponent;
  const catchy = buildShareText({ title, url, excerpt, tags, questions, readMinutes, tone: "catchy" });
  const tweet = buildTweetText({ title, url, tags, questions });

  const btn =
    "inline-flex items-center justify-center w-10 h-10 rounded-full bg-white border border-shivraj-100 text-shivraj-700 hover:text-white hover:bg-shivraj-600 hover:border-shivraj-600 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200";

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <a className={btn} href={`https://twitter.com/intent/tweet?text=${enc(tweet)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on X" title="Share on X">
        <Twitter size={16} />
      </a>
      <button className={btn} onClick={() => setOpen(true)} aria-label="Share on LinkedIn" title="Share on LinkedIn">
        <Linkedin size={16} />
      </button>
      <a className={btn} href={`https://wa.me/?text=${enc(catchy)}`} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" title="Share on WhatsApp">
        <MessageCircle size={16} />
      </a>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-shivraj-600 text-white text-sm font-semibold hover:bg-shivraj-700 hover:-translate-y-0.5 hover:shadow-md transition-all"
        aria-label="Open share options"
      >
        <Sparkles size={14} /> <span className="hidden sm:inline">Share</span><Share2 size={14} className="sm:hidden" />
      </button>
      <ShareMenu open={open} onOpenChange={setOpen} {...props} />
    </div>
  );
};

export default ShareButtons;
