import { ReactNode, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, ArrowRight, MessageSquare } from "lucide-react";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import ReadingProgress from "@/components/blog/ReadingProgress";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import NewsletterCard from "@/components/blog/NewsletterCard";
import ScrollTopButton from "@/components/blog/ScrollTopButton";
import CoverPlaceholder from "@/components/blog/CoverPlaceholder";
import FadeContent from "@/components/reactbits/FadeContent";
import PrevNextNav, { type NavRef } from "@/components/blog/PrevNextNav";
import SidebarExtras from "@/components/blog/SidebarExtras";

interface Props {
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  publishedLabel?: string;
  readMinutes?: number;
  url: string;
  breadcrumbLabel: string;
  coverImageUrl?: string;
  slug?: string;
  prev?: NavRef;
  next?: NavRef;
  children: ReactNode;
}

const StaticArticleShell = ({
  title,
  excerpt,
  category,
  tags = [],
  publishedLabel,
  readMinutes = 8,
  url,
  breadcrumbLabel,
  coverImageUrl,
  slug,
  prev,
  next,
  children,
}: Props) => {
  const articleRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
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
            <Breadcrumbs items={[{ label: "Blog", to: "/blog" }, { label: breadcrumbLabel }]} />
            <Link
              to="/blog"
              className="inline-flex items-center text-sm text-shivraj-700 hover:text-shivraj-900 mb-8 group"
            >
              <ArrowLeft size={14} className="mr-1 transition-transform group-hover:-translate-x-0.5" /> Back to blog
            </Link>

            <FadeContent>
              {category && (
                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-shivraj-100 text-shivraj-700 mb-5">
                  {category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-shivraj-900 leading-[1.1] tracking-tight mb-6">
                {title}
              </h1>
              {excerpt && (
                <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mb-8">{excerpt}</p>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-600 border-t border-b border-shivraj-100 py-4">
                <span className="inline-flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-gradient-to-br from-shivraj-600 to-shivraj-800 text-white flex items-center justify-center text-xs font-bold">
                    SE
                  </span>
                  <span>
                    <span className="text-shivraj-800 font-medium">Shivraj Enterprise</span> · Editorial
                  </span>
                </span>
                {publishedLabel && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-shivraj-500" />
                    {publishedLabel}
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={14} className="text-shivraj-500" />
                  {readMinutes} min read
                </span>
                <div className="ml-auto hidden md:block">
                  <ShareButtons url={url} title={title} />
                </div>
              </div>
            </FadeContent>
          </div>
        </header>

        {/* Cover */}
        <div className="container mx-auto px-4 max-w-5xl -mt-2 mb-10 md:mb-16">
          <FadeContent>
            <div className="rounded-2xl md:rounded-3xl overflow-hidden shadow-xl ring-1 ring-shivraj-100 aspect-[16/9] bg-shivraj-50">
              {coverImageUrl ? (
                <img src={coverImageUrl} alt={title} loading="eager" className="w-full h-full object-cover" />
              ) : (
                <CoverPlaceholder title={title} category={category} className="w-full h-full" />
              )}
            </div>
          </FadeContent>
        </div>

        {/* Content + sidebar */}
        <div className="container mx-auto px-4 max-w-6xl pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_280px] gap-12">
            <div ref={contentRef} className="max-w-[760px] mx-auto w-full">
              <div className="prose prose-slate prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:text-shivraj-900 prose-h2:text-3xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4 prose-h3:text-xl prose-p:leading-[1.8] prose-p:text-gray-700 prose-a:text-shivraj-700 prose-a:no-underline hover:prose-a:underline prose-strong:text-shivraj-900 prose-table:text-sm prose-th:bg-shivraj-50 prose-th:text-shivraj-800 prose-th:font-semibold prose-th:p-3 prose-td:p-3 prose-td:border-shivraj-100 prose-li:leading-[1.8]">
                {children}
              </div>

              {tags.length > 0 && (
                <div className="mt-14 pt-8 border-t border-shivraj-100 flex flex-wrap items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {tags.map((t) => (
                      <span
                        key={t}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-shivraj-50 text-shivraj-700 border border-shivraj-100"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <div className="ml-auto">
                    <ShareButtons url={url} title={title} />
                  </div>
                </div>
              )}

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
                  <ShareButtons url={url} title={title} />
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
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-3">
                    Need reliable manpower in Vapi GIDC?
                  </h2>
                  <p className="text-shivraj-100 leading-relaxed max-w-2xl">
                    From housekeeping to skilled labour and full facility management — Shivraj Enterprise delivers compliant, on-time workforce solutions for engineering and chemical plants.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
                  <a
                    href="/#/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-shivraj-800 font-semibold hover:bg-shivraj-50 hover:-translate-y-0.5 transition-all shadow-lg"
                  >
                    Request a quote <ArrowRight size={16} />
                  </a>
                  <a
                    href="/#/services"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/10 border border-white/25 text-white font-semibold hover:bg-white/20 transition-all"
                  >
                    Explore services
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </article>
      <ScrollTopButton />
    </>
  );
};

export default StaticArticleShell;
