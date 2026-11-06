import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

const ReadingProgress = ({ targetRef }: { targetRef?: React.RefObject<HTMLElement> }) => {
  const [progress, setProgress] = useState(0);
  const value = useMotionValue(0);
  const smooth = useSpring(value, { stiffness: 180, damping: 32 });
  const reduce = useReducedMotion();

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = targetRef?.current;
      let next = 0;
      if (el) {
        const rect = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
        next = (scrolled / Math.max(total, 1)) * 100;
      } else {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        next = total > 0 ? (h.scrollTop / total) * 100 : 0;
      }
      value.set(next / 100);
      setProgress(Math.round(next));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    onScroll();
    const observer = new ResizeObserver(onScroll);
    observer.observe(targetRef?.current ?? document.documentElement);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [targetRef, value]);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 z-[60] bg-transparent pointer-events-none print:hidden"
      role="progressbar"
      aria-label="Article reading progress"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-shivraj-500 via-shivraj-600 to-shivraj-800"
        style={{ scaleX: reduce ? value : smooth }}
      />
    </div>
  );
};

export default ReadingProgress;
