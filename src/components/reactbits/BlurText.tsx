import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}

const BlurText = ({ text, className = "", delay = 0, as = "h2" }: BlurTextProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const words = text.split(" ");
  const Tag = motion[as] as typeof motion.h2;
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          initial={{ opacity: 0, filter: "blur(12px)", y: 12 }}
          animate={inView ? { opacity: 1, filter: "blur(0px)", y: 0 } : {}}
          transition={{ duration: 0.6, delay: delay + i * 0.06, ease: "easeOut" }}
          className="inline-block mr-[0.25em]"
        >
          {w}
        </motion.span>
      ))}
    </Tag>
  );
};

export default BlurText;
