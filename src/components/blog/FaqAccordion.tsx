import { useEffect, useRef, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export type FaqItem = { q: string; a: React.ReactNode };

const FaqRow = ({
  item,
  open,
  onToggle,
  onKeyDown,
  index,
  rowId,
}: {
  item: FaqItem;
  open: boolean;
  onToggle: () => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  index: number;
  rowId: string;
}) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!contentRef.current) return;
    setHeight(contentRef.current.scrollHeight);
    const ro = new ResizeObserver(() => {
      if (contentRef.current) setHeight(contentRef.current.scrollHeight);
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, [item]);

  return (
    <div
      className={`group rounded-2xl border transition-all duration-300 overflow-hidden ${
        open
          ? "bg-white border-shivraj-300 shadow-lg"
          : "bg-white/70 border-shivraj-100 hover:border-shivraj-200 hover:shadow-md"
      }`}
    >
      <h3>
        <button
          id={`${rowId}-trigger`}
          aria-expanded={open}
          aria-controls={`${rowId}-panel`}
          data-faq-trigger
          onClick={onToggle}
          onKeyDown={onKeyDown}
          className="w-full flex items-start gap-4 text-left px-5 md:px-7 py-5 md:py-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-shivraj-400/60 rounded-2xl"
        >
          <span
            className={`shrink-0 mt-0.5 inline-flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold transition-colors ${
              open ? "bg-shivraj-600 text-white" : "bg-shivraj-50 text-shivraj-700 group-hover:bg-shivraj-100"
            }`}
            aria-hidden
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 text-base md:text-lg font-semibold text-shivraj-900 leading-snug">
            {item.q}
          </span>
          <span
            className={`shrink-0 mt-1 inline-flex items-center justify-center w-8 h-8 rounded-full border transition-all duration-300 ${
              open
                ? "bg-shivraj-600 border-shivraj-600 text-white rotate-180"
                : "bg-white border-shivraj-200 text-shivraj-700 group-hover:border-shivraj-400"
            }`}
            aria-hidden
          >
            <ChevronDown size={16} />
          </span>
        </button>
      </h3>
      <div
        id={`${rowId}-panel`}
        role="region"
        aria-labelledby={`${rowId}-trigger`}
        hidden={!open}
        style={{ maxHeight: open ? height : 0 }}
        className="transition-[max-height] duration-400 ease-in-out overflow-hidden"
      >
        <div ref={contentRef} className="px-5 md:px-7 pb-6 pt-1 pl-16 md:pl-20 text-[15.5px] leading-[1.8] text-gray-700">
          {item.a}
        </div>
      </div>
    </div>
  );
};

const FaqAccordion = ({
  items,
  title = "Frequently Asked Questions",
  subtitle,
  id = "faq",
}: {
  items: FaqItem[];
  title?: string;
  subtitle?: string;
  id?: string;
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const groupRef = useRef<HTMLDivElement>(null);

  const focusTrigger = (i: number) => {
    const triggers = groupRef.current?.querySelectorAll<HTMLButtonElement>("[data-faq-trigger]");
    if (!triggers) return;
    const t = triggers[(i + triggers.length) % triggers.length];
    t?.focus();
  };

  const onKeyDown = (i: number) => (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        focusTrigger(i + 1);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusTrigger(i - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTrigger(0);
        break;
      case "End":
        e.preventDefault();
        focusTrigger(items.length - 1);
        break;
    }
  };

  return (
    <section id={id} aria-labelledby={`${id}-title`} className="not-prose my-14 scroll-mt-28">
      <div className="mb-8 flex items-start gap-4">
        <span className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-br from-shivraj-600 to-shivraj-800 text-white shadow-md shrink-0">
          <HelpCircle size={20} />
        </span>
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-shivraj-600 mb-1">FAQ</div>
          <h2 id={`${id}-title`} className="text-2xl md:text-3xl font-bold text-shivraj-900 leading-tight">
            {title}
          </h2>
          {subtitle && <p className="mt-2 text-gray-600 leading-relaxed max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      <div ref={groupRef} className="space-y-3">
        {items.map((item, i) => (
          <FaqRow
            key={i}
            index={i}
            rowId={`${id}-${i}`}
            item={item}
            open={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            onKeyDown={onKeyDown(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default FaqAccordion;
