/**
 * Aurora background with cinematic looping video underlay.
 * Used behind page headers for cohesive brand feel across the site.
 */
import blogHeroVideo from "@/assets/blog-hero.mp4.asset.json";

interface AuroraBackgroundProps {
  className?: string;
  intensity?: "subtle" | "bold";
  /** Set to false to hide the underlying video (e.g. on light-themed heroes). */
  video?: boolean;
}

const AuroraBackground = ({
  className = "",
  intensity = "subtle",
  video = true,
}: AuroraBackgroundProps) => {
  const opacity = intensity === "bold" ? "opacity-80" : "opacity-50";
  const videoOpacity = intensity === "bold" ? "opacity-40" : "opacity-25";
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {video && (
        <>
          <video
            src={blogHeroVideo.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className={`absolute inset-0 w-full h-full object-cover ${videoOpacity}`}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-shivraj-900/70 via-shivraj-800/60 to-shivraj-900/80" />
        </>
      )}
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
