import { useEffect, useState } from "react";
import { List } from "lucide-react";

type Heading = { id: string; text: string; level: number };

const slugify = (s: string) =>
  s.toLowerCase().replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-").slice(0, 80);

const TableOfContents = ({ containerRef }: { containerRef: React.RefObject<HTMLElement> }) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const nodes = Array.from(root.querySelectorAll("h2, h3")) as HTMLElement[];
    const used = new Set<string>();
    const list: Heading[] = nodes.map((el) => {
      let id = el.id || slugify(el.textContent || "section");
      let base = id, i = 2;
      while (used.has(id)) id = `${base}-${i++}`;
      used.add(id);
      el.id = id;
      // add scroll-margin for sticky headers
      el.style.scrollMarginTop = "96px";
      return { id, text: el.textContent || "", level: el.tagName === "H2" ? 2 : 3 };
    });
    setHeadings(list);

    if (list.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-96px 0px -60% 0px", threshold: [0, 1] }
    );
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [containerRef]);

  if (headings.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="text-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-4">
        <List size={14} /> On this page
      </div>
      <ul className="space-y-1 border-l border-shivraj-100">
        {headings.map((h) => {
          const isActive = h.id === activeId;
          return (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(h.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${h.id}`);
                }}
                className={`block py-1.5 pl-4 -ml-px border-l-2 transition-all duration-200 ${
                  h.level === 3 ? "pl-8 text-[13px]" : ""
                } ${
                  isActive
                    ? "border-shivraj-600 text-shivraj-800 font-medium"
                    : "border-transparent text-muted-foreground hover:text-shivraj-700"
                }`}
              >
                {h.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TableOfContents;
