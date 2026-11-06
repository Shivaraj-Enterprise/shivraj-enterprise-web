import { Link } from "react-router-dom";
import { Calendar, ArrowUpRight, Clock } from "lucide-react";
import CoverPlaceholder from "./CoverPlaceholder";
import { MagicCard } from "@/components/ui/magic-card";
import { useReducedMotion } from "motion/react";

export type BlogPostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  tags?: { slug: string; name: string }[];
};

const estimateReadTime = (text: string | null | undefined) => {
  if (!text) return 3;
  const words = text.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 40) + 2);
};

const PostCard = ({ post, featured = false }: { post: BlogPostCard; featured?: boolean }) => {
  const primaryTag = post.tags?.[0]?.name;
  const readTime = estimateReadTime(post.excerpt);
  const reduce = useReducedMotion();

  return (
    <Link
      to={`/blog/${post.slug}`}
      aria-label={`Read article: ${post.title}`}
      className="blog-post-card group relative block h-full rounded-2xl border border-shivraj-100 overflow-hidden bg-card shadow-sm transition-all duration-300 motion-safe:hover:-translate-y-1 hover:shadow-xl hover:border-shivraj-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <MagicCard
        className={`blog-card-glow h-full [&>div:last-child]:flex [&>div:last-child]:h-full [&>div:last-child]:flex-col ${featured ? "md:[&>div:last-child]:flex-row" : ""}`}
        gradientColor="hsl(var(--primary) / 0.12)"
        gradientFrom="hsl(var(--primary))"
        gradientTo="hsl(var(--activity-experience))"
        gradientOpacity={reduce ? 0 : 0.5}
      >
      <div className={`relative overflow-hidden bg-shivraj-50 ${featured ? "md:w-1/2 aspect-[16/10] md:aspect-auto" : "aspect-[16/10]"}`}>
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading="lazy"
            width={1200}
            height={750}
            className="w-full h-full object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:group-hover:scale-105"
          />
        ) : (
          <CoverPlaceholder title={post.title} category={primaryTag} className="w-full h-full" />
        )}
        {primaryTag && post.cover_image_url && (
          <span className="absolute top-3 left-3 inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-white/90 backdrop-blur text-shivraj-800 shadow-sm">
            {primaryTag}
          </span>
        )}
      </div>

      <div className={`flex-1 p-6 flex flex-col ${featured ? "md:p-8 md:justify-center" : ""}`}>
        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
          {post.published_at && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> {readTime} min read
          </span>
        </div>

        <h3 className={`font-semibold text-shivraj-800 group-hover:text-shivraj-600 mb-3 leading-snug transition-colors ${
          featured ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
        }`}>
          {post.title}
        </h3>

        {post.excerpt && (
          <p className={`text-gray-600 leading-relaxed ${featured ? "text-base line-clamp-4" : "text-sm line-clamp-3"}`}>
            {post.excerpt}
          </p>
        )}

        <div className="mt-5 flex items-center gap-2 text-sm font-medium text-shivraj-700">
          <span className="border-b border-transparent group-hover:border-shivraj-600 transition-colors">Read article</span>
          <ArrowUpRight size={16} className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5" />
        </div>
      </div>
      </MagicCard>
    </Link>
  );
};

export default PostCard;
