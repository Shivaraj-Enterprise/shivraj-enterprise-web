import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft } from "lucide-react";
import Layout from "@/components/Layout";
import RichTextRenderer from "@/components/blog/RichTextRenderer";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import RelatedPosts from "@/components/blog/RelatedPosts";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  blog_post_tags: { blog_tags: { slug: string; name: string } | null }[] | null;
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("blog_posts")
        .select("id, slug, title, excerpt, content, cover_image_url, published_at, blog_post_tags(blog_tags(slug, name))")
        .eq("slug", slug!)
        .eq("published", true)
        .maybeSingle();
      setPost((data as unknown as Post) ?? null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return <Layout><div className="container mx-auto p-16 text-center text-muted-foreground">Loading…</div></Layout>;
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto py-20 px-4 text-center">
          <h1 className="text-3xl font-bold text-shivraj-800 mb-4">Post not found</h1>
          <Link to="/blog" className="text-shivraj-700 hover:underline">← Back to all posts</Link>
        </div>
      </Layout>
    );
  }

  const tags = (post.blog_post_tags ?? []).map((pt) => pt.blog_tags).filter(Boolean) as { slug: string; name: string }[];
  const url = `https://shivraj-enterprise.lovable.app/#/blog/${post.slug}`;

  return (
    <Layout>
      <Helmet>
        <title>{post.title} – Shivraj Enterprise</title>
        <meta name="description" content={post.excerpt ?? post.title} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt ?? post.title} />
        <meta property="og:url" content={url} />
        {post.cover_image_url && <meta property="og:image" content={post.cover_image_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.cover_image_url ?? undefined,
            datePublished: post.published_at,
            author: { "@type": "Organization", name: "Shivraj Enterprise" },
            publisher: { "@type": "Organization", name: "Shivraj Enterprise" },
            mainEntityOfPage: url,
          })}
        </script>
      </Helmet>

      <article className="bg-white">
        {post.cover_image_url && (
          <div className="w-full max-h-[480px] overflow-hidden">
            <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="container mx-auto px-4 py-10 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center text-sm text-shivraj-700 hover:underline mb-6">
            <ArrowLeft size={14} className="mr-1" /> Back to blog
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-shivraj-800 mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-8">
            {post.published_at && (
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "long" })}
              </span>
            )}
            {tags.map((t) => (
              <span key={t.slug} className="px-2 py-0.5 rounded-full bg-shivraj-100 text-shivraj-700 text-xs">{t.name}</span>
            ))}
          </div>
          {post.excerpt && <p className="text-lg text-gray-600 mb-6 italic">{post.excerpt}</p>}
          <RichTextRenderer html={post.content} />
        </div>
      </article>
    </Layout>
  );
};

export default BlogPost;
