import { motion, useReducedMotion } from "motion/react";

/** Adapted from OriginKit Text Colour Sweep: visible-first, token-based and word-safe on mobile. */
export default function TextColourSweep({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="home-colour-sweep">
      {text.split(" ").map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={false}
          whileInView={reduce ? undefined : {
            y: [8, 0],
            color: ["hsl(var(--home-sweep-start))", "hsl(var(--home-sweep-accent))", "hsl(var(--home-sweep-start))"],
          }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.15, delay: index * 0.075, ease: "easeOut" }}
        >
          {word}{index < text.split(" ").length - 1 ? "\u00a0" : ""}
        </motion.span>
      ))}
    </span>
  );
}