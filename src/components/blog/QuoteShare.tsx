import { RefObject, useEffect, useState } from "react";
import { Quote } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Medium-style: select text in the article to share it as a quote.
const QuoteShare = ({ containerRef, url, title }: { containerRef: RefObject<HTMLElement>; url: string; title: string }) => {
  const [pos, setPos] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    const onUp = () => {
      setTimeout(() => {
        const sel = window.getSelection();
        const text = sel?.toString().trim() ?? "";
        const el = containerRef.current;
        if (!sel || !el || text.length < 12 || !el.contains(sel.anchorNode)) return setPos(null);
        const r = sel.getRangeAt(0).getBoundingClientRect();
        setPos({ x: r.left + r.width / 2, y: r.top, text: text.slice(0, 220) });
      }, 0);
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    const hide = () => setPos(null);
    window.addEventListener("scroll", hide, { passive: true });
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
      window.removeEventListener("scroll", hide);
    };
  }, [containerRef]);

  if (!pos) return null;
  const msg = `💬 "${pos.text}"\n\n— from "${title}"\n👉 ${url}`;
  const share = async () => {
    if (navigator.share) {
      try { await navigator.share({ title, text: msg, url }); setPos(null); return; } catch { /* fallthrough */ }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    try { await navigator.clipboard.writeText(msg); toast({ title: "Quote copied", description: "Paste it anywhere." }); } catch { /* ignore */ }
    setPos(null);
  };

  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={share}
      style={{ left: pos.x, top: pos.y - 48 }}
      className="fixed z-50 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-shivraj-900 text-white text-xs font-semibold shadow-lg print:hidden"
    >
      <Quote size={14} /> Share this quote
    </button>
  );
};

export default QuoteShare;
