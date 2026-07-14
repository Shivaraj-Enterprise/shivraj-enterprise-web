import { useEffect, useState } from "react";

const ReadingProgress = ({ targetRef }: { targetRef?: React.RefObject<HTMLElement> }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = targetRef?.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        setProgress((scrolled / Math.max(total, 1)) * 100);
      } else {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        setProgress(total > 0 ? (h.scrollTop / total) * 100 : 0);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent pointer-events-none"
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full bg-gradient-to-r from-shivraj-500 via-shivraj-600 to-shivraj-800 transition-[width] duration-150 ease-out shadow-[0_0_12px_rgba(37,99,235,0.6)]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default ReadingProgress;
