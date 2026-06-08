import DOMPurify from "dompurify";
import { useMemo } from "react";

const RichTextRenderer = ({ html }: { html: string }) => {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p","br","strong","em","u","s","h1","h2","h3","h4","ul","ol","li","blockquote","a","img","code","pre","hr"],
        ALLOWED_ATTR: ["href","src","alt","title","target","rel"],
      }),
    [html]
  );
  return (
    <div
      className="prose prose-shivraj max-w-none prose-headings:text-shivraj-800 prose-a:text-shivraj-700"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichTextRenderer;
