import { ReactNode, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useLocation } from "react-router-dom";

/** Stagger container: children using <StaggerItem> appear one after another. Content stays in the DOM for crawlers. */
export const Stagger = ({ children, className, gap = 0.08 }: { children: ReactNode; className?: string; gap?: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ children, className }: { children: ReactNode; className?: string }) => (
  <motion.div
    className={className}
    variants={{
      hidden: { opacity: 0, y: 24, scale: 0.96 },
      show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 180, damping: 22 } },
    }}
  >
    {children}
  </motion.div>
);

/** Magnetic wrapper: pulls its child slightly toward the cursor on desktop. */
export const Magnetic = ({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 15 });
  return (
    <motion.div
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
};

/** Thin top progress bar showing how far the visitor has scrolled. */
export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[60] h-1 origin-left bg-gradient-to-r from-shivraj-400 via-shivraj-600 to-shivraj-400 print:hidden"
      style={{ scaleX }}
    />
  );
};

/** Soft fade/slide whenever the page changes. */
export const PageTransition = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const reduce = useReducedMotion();
  return (
    <motion.div
      key={pathname}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
};
