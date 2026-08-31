import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import DOMPurify from "dompurify";
import Layout from "@/components/Layout";
import StaticArticleShell from "@/components/blog/StaticArticleShell";
import RelatedPosts from "@/components/blog/RelatedPosts";
import FaqAccordion from "@/components/blog/FaqAccordion";
import KeyTakeawaysCard from "@/components/blog/KeyTakeawaysCard";
import { supabase } from "@/integrations/supabase/client";

const PURIFY_CONFIG = {
  ALLOWED_TAGS: ["p","br","strong","em","u","s","h1","h2","h3","h4","ul","ol","li","blockquote","a","img","code","pre","hr","table","thead","tbody","tr","th","td"],
  ALLOWED_ATTR: ["href","src","alt","title","target","rel","loading","class","id"],
};

// Extracts the FAQ block (an <h2> "Frequently Asked..." section with <h3> Q&A pairs)
// from a post's HTML so it can be rendered as the shared premium FaqAccordion card design.
const extractFaqSection = (html: string): { bodyHtml: string; faqs: Array<{ q: string; aHtml: string; aText: string }> } => {
  const section = /<h2[^>]*>\s*[^<]*frequently asked[^<]*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i.exec(html);
  if (!section) return { bodyHtml: html, faqs: [] };
  const faqs: Array<{ q: string; aHtml: string; aText: string }> = [];
  const re = /<h3[^>]*>([\s\S]*?)<\/h3>\s*([\s\S]*?)(?=<h3[\s>]|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section[1])) !== null) {
    const q = m[1].replace(/<[^>]+>/g, "").trim();
    const aHtml = DOMPurify.sanitize(m[2], PURIFY_CONFIG).trim();
    const aText = m[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    if (q && aText) faqs.push({ q, aHtml, aText });
  }
  if (faqs.length === 0) return { bodyHtml: html, faqs: [] };
  return { bodyHtml: html.replace(section[0], ""), faqs };
};

// Extracts a "Key Takeaways" section (an <h2> "Key Takeaways" heading followed by a
// list) so it can be rendered as the shared premium KeyTakeawaysCard design.
const extractTakeawaysSection = (html: string): { bodyHtml: string; takeaways: string[] } => {
  const section = /<h2[^>]*>\s*[^<]*key takeaway[^<]*<\/h2>([\s\S]*?)(?=<h2[\s>]|$)/i.exec(html);
  if (!section) return { bodyHtml: html, takeaways: [] };
  const takeaways: string[] = [];
  const re = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(section[1])) !== null) {
    const item = DOMPurify.sanitize(m[1].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
    if (item) takeaways.push(item);
  }
  if (takeaways.length === 0) return { bodyHtml: html, takeaways: [] };
  return { bodyHtml: html.replace(section[0], ""), takeaways };
};

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

  const faqResult = useMemo(() => (post ? extractFaqSection(post.content ?? "") : { bodyHtml: "", faqs: [] }), [post]);

  const takeawaysResult = useMemo(
    () => extractTakeawaysSection(faqResult.bodyHtml),
    [faqResult]
  );

  const sanitizedContent = useMemo(
    () => (post ? DOMPurify.sanitize(takeawaysResult.bodyHtml, PURIFY_CONFIG) : ""),
    [post, takeawaysResult]
  );

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
  const url = `https://shivraj-enterprise.lovable.app/blog/${post.slug}`;

  const faqs = faqResult.faqs;

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
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://shivraj-enterprise.lovable.app/blog" },
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
                acceptedAnswer: { "@type": "Answer", text: f.aText },
              })),
            })}
          </script>
        )}
      </Helmet>

      <StaticArticleShell
        title={post.title}
        excerpt={post.excerpt ?? undefined}
        category={primaryTag}
        tags={tags.map((t) => t.name)}
        publishedLabel={
          post.published_at
            ? new Date(post.published_at).toLocaleDateString(undefined, { dateStyle: "long" })
            : undefined
        }
        readMinutes={readTime}
        url={url}
        breadcrumbLabel={post.title}
        coverImageUrl={post.cover_image_url ?? undefined}
        slug={post.slug}
      >
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        {faqs.length > 0 && (
          <FaqAccordion
            id="post-faq"
            title="Frequently asked questions"
            subtitle="Quick answers on this topic from the Shivraj Enterprise editorial team."
            items={faqs.map((f) => ({
              q: f.q,
              a: <div dangerouslySetInnerHTML={{ __html: f.aHtml }} />,
            }))}
          />
        )}
      </StaticArticleShell>

      <RelatedPosts currentSlug={post.slug} currentTagSlugs={tags.map((t) => t.slug)} />
    </Layout>
  );
};

export default BlogPost;
