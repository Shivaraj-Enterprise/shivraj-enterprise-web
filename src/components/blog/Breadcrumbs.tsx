import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export type Crumb = { label: string; to?: string };

const Breadcrumbs = ({ items }: { items: Crumb[] }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <li className="flex items-center gap-1">
          <Link to="/" className="inline-flex items-center gap-1 hover:text-shivraj-700">
            <Home size={14} /> Home
          </Link>
        </li>
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            <ChevronRight size={14} className="text-shivraj-300" />
            {c.to && i < items.length - 1 ? (
              <Link to={c.to} className="hover:text-shivraj-700">{c.label}</Link>
            ) : (
              <span className="text-shivraj-800 font-medium" aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
