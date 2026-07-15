import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Tag, ArrowUpRight, Sparkles } from "lucide-react";
import { STATIC_POSTS } from "@/data/staticPosts";

const RecentPosts = ({ currentSlug }: { currentSlug?: string }) => {
  const posts = STATIC_POSTS.filter((p) => p.slug !== currentSlug).slice(0, 4);
  if (posts.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-3 inline-flex items-center gap-2">
        <Sparkles size={14} /> Recent articles
      </div>
      <ul className="space-y-3">
        {posts.map((p) => (
          <li key={p.id}>
            <Link
              to={`/blog/${p.slug}`}
              className="group block rounded-xl p-3 -mx-3 hover:bg-shivraj-50/70 transition-colors"
            >
              <div className="text-[13px] font-medium text-shivraj-900 leading-snug group-hover:text-shivraj-700 line-clamp-2">
                {p.title}
              </div>
              <div className="mt-1 text-[11px] text-muted-foreground inline-flex items-center gap-1">
                {p.tags?.[0]?.name ?? "Guide"}
                <ArrowUpRight size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

const Categories = () => {
  const cats = useMemo(() => {
    const map = new Map<string, string>();
    STATIC_POSTS.forEach((p) => p.tags?.forEach((t) => map.set(t.slug, t.name)));
    return Array.from(map.entries()).slice(0, 8);
  }, []);
  if (cats.length === 0) return null;
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-3 inline-flex items-center gap-2">
        <Tag size={14} /> Categories
      </div>
      <div className="flex flex-wrap gap-2">
        {cats.map(([slug, name]) => (
          <Link
            key={slug}
            to={`/blog?tag=${slug}`}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-shivraj-50 text-shivraj-700 border border-shivraj-100 hover:bg-shivraj-600 hover:text-white hover:border-shivraj-600 transition-colors"
          >
            {name}
          </Link>
        ))}
      </div>
    </div>
  );
};

const SearchCard = () => {
  const [q, setQ] = useState("");
  const nav = useNavigate();
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const term = q.trim();
        if (!term) return;
        nav(`/blog?q=${encodeURIComponent(term)}`);
      }}
      className="relative"
      role="search"
    >
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-shivraj-400" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search the blog…"
        aria-label="Search blog"
        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-white border border-shivraj-100 text-sm placeholder:text-shivraj-400 focus:outline-none focus:ring-2 focus:ring-shivraj-400/40 focus:border-shivraj-300 transition"
      />
    </form>
  );
};

export const SidebarExtras = ({ currentSlug }: { currentSlug?: string }) => (
  <>
    <SearchCard />
    <RecentPosts currentSlug={currentSlug} />
    <Categories />
  </>
);

export default SidebarExtras;
