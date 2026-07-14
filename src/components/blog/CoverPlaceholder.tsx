const palettes = [
  "from-shivraj-500 via-shivraj-700 to-shivraj-900",
  "from-indigo-500 via-shivraj-700 to-shivraj-900",
  "from-shivraj-600 via-sky-700 to-shivraj-900",
  "from-emerald-600 via-shivraj-700 to-shivraj-900",
  "from-rose-500 via-shivraj-700 to-shivraj-900",
];

const pick = (seed: string) => {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return palettes[h % palettes.length];
};

const CoverPlaceholder = ({ title, category, className = "" }: { title: string; category?: string; className?: string }) => {
  const gradient = pick(title);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.35), transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.25), transparent 45%)",
        }}
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
        aria-hidden
      />
      <div className="relative h-full w-full flex flex-col justify-end p-6 md:p-10 text-white">
        {category && (
          <span className="inline-flex self-start px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/15 ring-1 ring-white/25 backdrop-blur mb-3">
            {category}
          </span>
        )}
        <p className="text-lg md:text-2xl font-semibold leading-tight max-w-[85%] drop-shadow line-clamp-4">
          {title}
        </p>
      </div>
    </div>
  );
};

export default CoverPlaceholder;
