import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";

export type BlogPostCard = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  published_at: string | null;
  tags?: { slug: string; name: string }[];
};

const PostCard = ({ post }: { post: BlogPostCard }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block bg-white rounded-lg shadow-sm border border-shivraj-100 overflow-hidden transition hover:shadow-md"
    >
      {post.cover_image_url ? (
        <div className="aspect-[16/9] overflow-hidden bg-shivraj-50">
          <img
            src={post.cover_image_url}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-shivraj-100 to-shivraj-200" />
      )}
      <div className="p-5">
        <div className="flex items-center text-xs text-muted-foreground gap-3 mb-2">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "medium" })}
            </span>
          )}
          {post.tags?.slice(0, 2).map((t) => (
            <span key={t.slug} className="px-2 py-0.5 rounded-full bg-shivraj-100 text-shivraj-700">{t.name}</span>
          ))}
        </div>
        <h3 className="font-semibold text-lg text-shivraj-800 group-hover:text-shivraj-600 mb-2 line-clamp-2">
          {post.title}
        </h3>
        {post.excerpt && <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>}
      </div>
    </Link>
  );
};

export default PostCard;
