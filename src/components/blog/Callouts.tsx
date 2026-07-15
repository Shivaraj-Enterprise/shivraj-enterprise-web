import { ReactNode } from "react";
import { Lightbulb, AlertTriangle, Info, CheckCircle2, Sparkles, Quote as QuoteIcon } from "lucide-react";

type Variant = "tip" | "note" | "warning" | "success" | "key";

const variantStyles: Record<Variant, { bg: string; border: string; icon: JSX.Element; label: string; title: string }> = {
  tip: {
    bg: "bg-gradient-to-br from-amber-50 to-white",
    border: "border-amber-200",
    icon: <Lightbulb size={18} />,
    label: "text-amber-700 bg-amber-100",
    title: "text-amber-900",
  },
  note: {
    bg: "bg-gradient-to-br from-shivraj-50 to-white",
    border: "border-shivraj-200",
    icon: <Info size={18} />,
    label: "text-shivraj-700 bg-shivraj-100",
    title: "text-shivraj-900",
  },
  warning: {
    bg: "bg-gradient-to-br from-rose-50 to-white",
    border: "border-rose-200",
    icon: <AlertTriangle size={18} />,
    label: "text-rose-700 bg-rose-100",
    title: "text-rose-900",
  },
  success: {
    bg: "bg-gradient-to-br from-emerald-50 to-white",
    border: "border-emerald-200",
    icon: <CheckCircle2 size={18} />,
    label: "text-emerald-700 bg-emerald-100",
    title: "text-emerald-900",
  },
  key: {
    bg: "bg-gradient-to-br from-shivraj-800 via-shivraj-700 to-shivraj-900 text-white",
    border: "border-shivraj-900",
    icon: <Sparkles size={18} />,
    label: "text-white bg-white/15 ring-1 ring-white/20",
    title: "text-white",
  },
};

const defaultTitles: Record<Variant, string> = {
  tip: "Pro Tip",
  note: "Note",
  warning: "Watch out",
  success: "Success story",
  key: "Key Takeaways",
};

export const Callout = ({
  variant = "note",
  title,
  children,
}: {
  variant?: Variant;
  title?: string;
  children: ReactNode;
}) => {
  const s = variantStyles[variant];
  return (
    <aside
      className={`not-prose my-10 rounded-2xl border ${s.border} ${s.bg} p-6 md:p-7 shadow-sm animate-fade-in`}
      role="note"
    >
      <div className="flex items-center gap-3 mb-3">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl ${s.label}`}>
          {s.icon}
        </span>
        <span className={`text-xs font-bold uppercase tracking-widest ${s.title}`}>
          {title ?? defaultTitles[variant]}
        </span>
      </div>
      <div className={`text-[15.5px] leading-[1.75] ${variant === "key" ? "text-shivraj-50" : "text-gray-700"}`}>
        {children}
      </div>
    </aside>
  );
};

export const PullQuote = ({ children, cite }: { children: ReactNode; cite?: string }) => (
  <figure className="not-prose my-12 relative">
    <div className="absolute -top-4 -left-2 text-shivraj-200">
      <QuoteIcon size={44} strokeWidth={1.5} />
    </div>
    <blockquote className="pl-14 border-l-4 border-shivraj-500 py-2">
      <p className="text-xl md:text-2xl font-medium text-shivraj-900 leading-relaxed">{children}</p>
      {cite && <figcaption className="mt-3 text-sm text-shivraj-600 font-medium">— {cite}</figcaption>}
    </blockquote>
  </figure>
);

export const StatGrid = ({
  items,
}: {
  items: { value: string; label: string; hint?: string }[];
}) => (
  <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-4 my-10">
    {items.map((s, i) => (
      <div
        key={i}
        className="group relative overflow-hidden rounded-2xl bg-white border border-shivraj-100 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
      >
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-shivraj-100/60 blur-2xl group-hover:bg-shivraj-200/70 transition-colors" aria-hidden />
        <div className="relative">
          <div className="text-3xl md:text-4xl font-bold text-shivraj-800 tracking-tight">{s.value}</div>
          <div className="mt-1 text-sm font-medium text-shivraj-700">{s.label}</div>
          {s.hint && <div className="mt-2 text-xs text-gray-500 leading-relaxed">{s.hint}</div>}
        </div>
      </div>
    ))}
  </div>
);

export const SectionDivider = () => (
  <div className="not-prose flex items-center justify-center my-14" aria-hidden>
    <span className="w-1.5 h-1.5 rounded-full bg-shivraj-300" />
    <span className="w-16 h-px bg-gradient-to-r from-transparent via-shivraj-200 to-transparent mx-2" />
    <span className="w-2 h-2 rounded-full bg-shivraj-400" />
    <span className="w-16 h-px bg-gradient-to-r from-transparent via-shivraj-200 to-transparent mx-2" />
    <span className="w-1.5 h-1.5 rounded-full bg-shivraj-300" />
  </div>
);
