import { useMemo } from "react";

/**
 * Auto-generated in-article illustration.
 * Renders an accessible SVG placeholder with a fixed aspect ratio so
 * lazy loading never causes layout shift. Uses brand tokens only.
 */

const palettes = [
  { from: "#dbeafe", via: "#bfdbfe", to: "#93c5fd", accent: "#1d4ed8" },
  { from: "#e0e7ff", via: "#c7d2fe", to: "#a5b4fc", accent: "#4338ca" },
  { from: "#cffafe", via: "#a5f3fc", to: "#67e8f9", accent: "#0e7490" },
  { from: "#dcfce7", via: "#bbf7d0", to: "#86efac", accent: "#166534" },
  { from: "#fef3c7", via: "#fde68a", to: "#fcd34d", accent: "#92400e" },
];

const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
};

type Props = {
  /** Alt text — used for accessibility and the visible caption fallback. */
  alt: string;
  /** Optional small label shown in the corner (e.g. "Figure 1"). */
  label?: string;
  /** Optional caption shown below the illustration. */
  caption?: string;
  /** Aspect ratio — defaults to 16/9 to prevent CLS. */
  aspect?: "16/9" | "4/3" | "21/9";
  className?: string;
};

const shapes = ["circles", "grid", "waves", "bars"] as const;

const ArticleImage = ({ alt, label, caption, aspect = "16/9", className = "" }: Props) => {
  const { p, shape, seed } = useMemo(() => {
    const h = hash(alt);
    return {
      p: palettes[h % palettes.length],
      shape: shapes[h % shapes.length],
      seed: h,
    };
  }, [alt]);

  const aspectClass =
    aspect === "4/3" ? "aspect-[4/3]" : aspect === "21/9" ? "aspect-[21/9]" : "aspect-video";

  const gradientId = `ai-grad-${seed}`;
  const patternId = `ai-pat-${seed}`;

  return (
    <figure className={`not-prose my-10 ${className}`}>
      <div className={`relative w-full ${aspectClass} rounded-2xl overflow-hidden shadow-lg ring-1 ring-shivraj-100 bg-shivraj-50`}>
        <svg
          role="img"
          aria-label={alt}
          viewBox="0 0 800 450"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 w-full h-full"
        >
          <title>{alt}</title>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={p.from} />
              <stop offset="50%" stopColor={p.via} />
              <stop offset="100%" stopColor={p.to} />
            </linearGradient>
            <pattern id={patternId} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke={p.accent} strokeOpacity="0.08" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="800" height="450" fill={`url(#${gradientId})`} />
          <rect width="800" height="450" fill={`url(#${patternId})`} />

          {shape === "circles" && (
            <g opacity="0.85">
              <circle cx="620" cy="120" r="140" fill={p.accent} opacity="0.10" />
              <circle cx="180" cy="360" r="180" fill={p.accent} opacity="0.14" />
              <circle cx="420" cy="240" r="70" fill="#ffffff" opacity="0.35" />
            </g>
          )}
          {shape === "grid" && (
            <g opacity="0.75">
              {Array.from({ length: 6 }).map((_, i) => (
                <rect
                  key={i}
                  x={80 + i * 110}
                  y={130 + (i % 2) * 40}
                  width="90"
                  height="180"
                  rx="14"
                  fill={p.accent}
                  opacity={0.08 + (i % 3) * 0.04}
                />
              ))}
            </g>
          )}
          {shape === "waves" && (
            <g opacity="0.9">
              <path d="M0 320 Q 200 250 400 320 T 800 320 L 800 450 L 0 450 Z" fill={p.accent} opacity="0.12" />
              <path d="M0 360 Q 200 300 400 360 T 800 360 L 800 450 L 0 450 Z" fill={p.accent} opacity="0.18" />
              <path d="M0 400 Q 200 360 400 400 T 800 400 L 800 450 L 0 450 Z" fill={p.accent} opacity="0.24" />
            </g>
          )}
          {shape === "bars" && (
            <g opacity="0.8">
              {[110, 190, 240, 160, 300, 210, 260, 340].map((h, i) => (
                <rect
                  key={i}
                  x={80 + i * 80}
                  y={430 - h}
                  width="46"
                  height={h}
                  rx="8"
                  fill={p.accent}
                  opacity={0.14 + (i % 4) * 0.05}
                />
              ))}
            </g>
          )}
        </svg>

        {label && (
          <span className="absolute top-4 left-4 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/85 backdrop-blur text-shivraj-800 shadow-sm">
            {label}
          </span>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground text-center leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export default ArticleImage;
