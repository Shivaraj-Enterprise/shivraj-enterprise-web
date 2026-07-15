import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type NavRef = { slug: string; title: string };

const PrevNextNav = ({ prev, next }: { prev?: NavRef; next?: NavRef }) => {
  if (!prev && !next) return null;
  return (
    <nav
      aria-label="Post navigation"
      className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 mt-14 pt-10 border-t border-shivraj-100"
    >
      {prev ? (
        <Link
          to={`/blog/${prev.slug}`}
          className="group flex flex-col rounded-2xl bg-white border border-shivraj-100 p-6 hover:border-shivraj-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-2">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" /> Previous
          </span>
          <span className="text-shivraj-900 font-semibold leading-snug group-hover:text-shivraj-700 transition-colors line-clamp-2">
            {prev.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          to={`/blog/${next.slug}`}
          className="group flex flex-col md:items-end md:text-right rounded-2xl bg-white border border-shivraj-100 p-6 hover:border-shivraj-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-2">
            Next <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </span>
          <span className="text-shivraj-900 font-semibold leading-snug group-hover:text-shivraj-700 transition-colors line-clamp-2">
            {next.title}
          </span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
};

export default PrevNextNav;
