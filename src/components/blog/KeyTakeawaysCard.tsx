import { Lightbulb } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { BorderBeam } from "@/components/ui/border-beam";

interface KeyTakeawaysCardProps {
  takeaways: string[];
  title?: string;
}

const KeyTakeawaysCard = ({ takeaways, title = "Key Takeaways" }: KeyTakeawaysCardProps) => {
  const reduce = useReducedMotion();
  if (takeaways.length === 0) return null;

  return (
    <section
      aria-labelledby="key-takeaways-heading"
      className="blog-takeaways relative isolate my-10 rounded-2xl border border-shivraj-200 bg-gradient-to-br from-shivraj-50 via-white to-shivraj-100/60 p-6 sm:p-8 shadow-sm"
    >
      {!reduce && <div aria-hidden="true" className="blog-takeaway-beam pointer-events-none absolute inset-0 rounded-[inherit] print:hidden"><BorderBeam size={100} duration={12} colorFrom="hsl(var(--primary))" colorTo="hsl(var(--activity-experience))" /></div>}
      <div className="flex items-center gap-3 mb-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-shivraj-600 text-white shadow-md">
          <Lightbulb className="h-5 w-5" aria-hidden="true" />
        </span>
        <h2 id="key-takeaways-heading" className="text-xl sm:text-2xl font-bold text-shivraj-800 !m-0">
          {title}
        </h2>
      </div>
      <ul className="space-y-3 !m-0 !p-0 list-none">
        {takeaways.map((item, i) => (
          <li
            key={i}
            className="flex gap-3 rounded-xl bg-white/80 border border-shivraj-100 px-4 py-3 text-shivraj-900 leading-relaxed shadow-sm transition hover:shadow-md hover:border-shivraj-300 !m-0"
          >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-shivraj-600 text-xs font-bold text-white">
              {i + 1}
            </span>
            <span className="text-[17px]">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default KeyTakeawaysCard;
