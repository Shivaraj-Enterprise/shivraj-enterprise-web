import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Calendar, ArrowLeft, Clock, User, ArrowRight, MessageSquare } from "lucide-react";
import Layout from "@/components/Layout";
import RichTextRenderer from "@/components/blog/RichTextRenderer";
import { supabase } from "@/integrations/supabase/client";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import RelatedPosts from "@/components/blog/RelatedPosts";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import NewsletterCard from "@/components/blog/NewsletterCard";
import ScrollTopButton from "@/components/blog/ScrollTopButton";
import CoverPlaceholder from "@/components/blog/CoverPlaceholder";
import FadeContent from "@/components/reactbits/FadeContent";

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

const estimateReadTime = (html: string) => {
  const text = html.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(2, Math.round(words / 220));
};

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

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

  const readTime = useMemo(() => (post ? estimateReadTime(post.content) : 0), [post]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto py-24 px-4 max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-6 bg-shivraj-100 rounded w-32" />
            <div className="h-10 bg-shivraj-100 rounded w-4/5" />
            <div className="h-4 bg-shivraj-100 rounded w-2/3" />
            <div className="aspect-[16/9] bg-shivraj-100 rounded-2xl" />
            <div className="h-4 bg-shivraj-100 rounded w-full" />
            <div className="h-4 bg-shivraj-100 rounded w-5/6" />
            <div className="h-4 bg-shivraj-100 rounded w-4/6" />
          </div>
        </div>
      </Layout>
    );
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
  const primaryTag = tags[0]?.name;
  const url = `https://shivraj-enterprise.lovable.app/#/blog/${post.slug}`;

  // Extract FAQ Q/A pairs from the article body for FAQPage schema.
  const faqs: Array<{ q: string; a: string }> = (() => {
    const html = post.content ?? "";
    const section = html.match(/<h2[^>]*>\s*[^<]*frequently asked[^<]*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i);
    if (!section) return [];
    const out: Array<{ q: string; a: string }> = [];
    const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h3[\s>]|$)/gi;
    let m: RegExpExecArray | null;
    while ((m = re.exec(section[1])) !== null) {
      const q = m[1].replace(/<[^>]+>/g, "").trim();
      const a = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
      if (q && a) out.push({ q, a });
    }
    return out;
  })();

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
        <meta name="twitter:card" content={post.cover_image_url ? "summary_large_image" : "summary"} />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt ?? post.title} />
        {post.cover_image_url && <meta name="twitter:image" content={post.cover_image_url} />}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt ?? undefined,
            image: post.cover_image_url ?? undefined,
            datePublished: post.published_at,
            dateModified: post.published_at,
            author: { "@type": "Organization", name: "Shivraj Enterprise" },
            publisher: {
              "@type": "Organization",
              name: "Shivraj Enterprise",
              logo: { "@type": "ImageObject", url: "https://shivraj-enterprise.lovable.app/placeholder.svg" },
            },
            mainEntityOfPage: url,
            keywords: tags.map((t) => t.name).join(", ") || undefined,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://shivraj-enterprise.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://shivraj-enterprise.lovable.app/#/blog" },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          })}
        </script>
        {faqs.length > 0 && (
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            })}
          </script>
        )}
      </Helmet>

      <ReadingProgress targetRef={articleRef} />

      <article ref={articleRef} className="bg-white">
        {/* Hero */}
        <header className="relative overflow-hidden bg-gradient-to-b from-shivraj-50 via-white to-white pt-14 pb-10 md:pt-20 md:pb-14">
          <div
            className="absolute inset-0 opacity-[0.4] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 15% 0%, rgba(37,99,235,0.12), transparent 45%), radial-gradient(circle at 85% 10%, rgba(37,99,235,0.10), transparent 40%)",
            }}
            aria-hidden
          />
          <div className="relative container mx-auto px-4 max-w-4xl">
            <Breadcrumbs items={[{ label: "Blog", to: "/blog" }, { label: post.title }]} />
            <Link to="/blog" className="inline-flex items-center text-sm text-shivraj-700 hover:text-shivraj-900 mb-8 group">
              <ArrowLeft size={14} className="mr-1 transition-transform group-hover:-translate-x-0.5" /> Back to blog
            </Link>

            <FadeContent>
              {primaryTag && (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-shivraj-100 text-shivraj-700 mb-5">
                  {primaryTag}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-shivraj-900 leading-[1.1] tracking-tight mb-6">
                {post.title}
              </h1>
              {post.excerpt && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">
                  {post.excerpt}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 border-t border-b border-shivraj-100 py-4">
                <span className="inline-flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-shivraj-600 to-shivraj-800 text-white flex items-center justify-center text-xs font-bold">SE</span>
                  <span><span className="text-shivraj-800 font-medium">Shivraj Enterprise</span> · Editorial</span>
                </span>
                {post.published_at && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-shivraj-500" />
                    {new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "long" })}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-shivraj-500" />
                  {readTime} min read
                </span>
                <div className="ml-auto hidden md:block">
                  <ShareButtons url={url} title={post.title} />
                </div>
              </div>
            </FadeContent>
          </div>
        </header>

        {/* Cover */}
        <div className="container mx-auto px-4 max-w-5xl -mt-2 mb-10 md:mb-16">
          <FadeContent>
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl ring-1 ring-shivraj-100 aspect-[16/9] bg-shivraj-50">
              {post.cover_image_url ? (
                <img src={post.cover_image_url} alt={post.title} loading="eager" className="w-full h-full object-cover" />
              ) : (
                <CoverPlaceholder title={post.title} category={primaryTag} className="w-full h-full" />
              )}
            </div>
          </FadeContent>
        </div>

        {/* Content + sidebar */}
        <div className="container mx-auto px-4 max-w-6xl pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
            <div ref={contentRef} className="max-w-[760px] mx-auto w-full">
              <RichTextRenderer html={post.content} />

              {/* Tags + share */}
              <div className="mt-14 pt-8 border-t border-shivraj-100 flex flex-wrap items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {tags.map((t) => (
                    <span key={t.slug} className="px-3 py-1 rounded-full text-xs font-medium bg-shivraj-50 text-shivraj-700 border border-shivraj-100">
                      #{t.name}
                    </span>
                  ))}
                </div>
                <div className="ml-auto">
                  <ShareButtons url={url} title={post.title} />
                </div>
              </div>

              {/* Author card */}
              <div className="mt-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-shivraj-50 to-white border border-shivraj-100 flex items-start gap-4">
                <div className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-br from-shivraj-600 to-shivraj-800 text-white flex items-center justify-center font-bold shadow-md">
                  <User size={22} />
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-1">Written by</div>
                  <h3 className="text-lg font-bold text-shivraj-800 mb-1">Shivraj Enterprise Editorial</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Practical playbooks on manpower supply, compliance and workforce operations — informed by two decades of on-ground work across Vapi GIDC.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-8">
                <TableOfContents containerRef={contentRef} />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-3">Share this post</div>
                  <ShareButtons url={url} title={post.title} />
                </div>
                <NewsletterCard />
              </div>
            </aside>
          </div>
        </div>

        {/* CTA banner */}
        <section className="relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl pb-16">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-shivraj-800 via-shivraj-700 to-shivraj-900 text-white p-8 md:p-14 shadow-xl">
              <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" aria-hidden />
              <div className="absolute -bottom-20 -left-10 w-72 h-72 rounded-full bg-shivraj-500/30 blur-3xl" aria-hidden />
              <div className="relative flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
                <div className="flex-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 ring-1 ring-white/20 text-xs font-medium uppercase tracking-wider mb-4">
                    <MessageSquare size={14} /> Let's talk
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">Need reliable manpower in Vapi GIDC?</h2>
                  <p className="text-shivraj-100 leading-relaxed max-w-2xl">
                    From housekeeping to skilled labour and full facility management — Shivraj Enterprise delivers compliant, on-time workforce solutions for engineering and chemical plants.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <a href="/#/contact" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-shivraj-800 font-semibold hover:bg-shivraj-50 hover:-translate-y-0.5 transition-all shadow-lg">
                    Request a quote <ArrowRight size={16} />
                  </a>
                  <a href="/#/services" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/25 text-white font-semibold hover:bg-white/20 transition-all">
                    Explore services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>

      <RelatedPosts currentSlug={post.slug} currentTagSlugs={tags.map((t) => t.slug)} />
      <ScrollTopButton />
    </Layout>
  );
};

export default BlogPost;
