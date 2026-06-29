/**
 * CSS-driven aurora background — no WebGL, very lightweight.
 * Used behind page headers for cohesive brand feel.
 */
interface AuroraBackgroundProps {
  className?: string;
  intensity?: "subtle" | "bold";
}

const AuroraBackground = ({ className = "", intensity = "subtle" }: AuroraBackgroundProps) => {
  const opacity = intensity === "bold" ? "opacity-80" : "opacity-50";
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      <div className={`absolute inset-0 ${opacity}`}>
        <div className="absolute -top-32 -left-24 h-[34rem] w-[34rem] rounded-full bg-shivraj-500/40 blur-[120px] animate-[blob_18s_ease-in-out_infinite]" />
        <div className="absolute top-10 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-400/30 blur-[110px] animate-[blob_22s_ease-in-out_infinite_reverse]" />
        <div className="absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-indigo-400/25 blur-[120px] animate-[blob_26s_ease-in-out_infinite]" />
      </div>
      {/* Fine grid overlay */}
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:48px_48px]" />
    </div>
  );
};

export default AuroraBackground;
