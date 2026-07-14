import DOMPurify from "dompurify";
import { useMemo } from "react";

const RichTextRenderer = ({ html }: { html: string }) => {
  const clean = useMemo(
    () =>
      DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ["p","br","strong","em","u","s","h1","h2","h3","h4","ul","ol","li","blockquote","a","img","code","pre","hr","table","thead","tbody","tr","th","td"],
        ALLOWED_ATTR: ["href","src","alt","title","target","rel","loading","class"],
      }),
    [html]
  );
  return (
    <div
      className="blog-prose prose prose-lg max-w-none prose-headings:text-shivraj-800 prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h2:mt-14 prose-h2:mb-6 prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:text-[1.125rem] prose-p:leading-[1.8] prose-p:text-gray-700 prose-p:my-6 prose-a:text-shivraj-700 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-strong:text-shivraj-900 prose-blockquote:border-l-4 prose-blockquote:border-shivraj-500 prose-blockquote:bg-shivraj-50 prose-blockquote:not-italic prose-blockquote:rounded-r-xl prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:text-shivraj-900 prose-li:my-2 prose-li:text-[1.0625rem] prose-li:leading-[1.75] prose-img:rounded-2xl prose-img:shadow-lg prose-img:my-10 prose-hr:my-12 prose-hr:border-shivraj-100 prose-code:bg-shivraj-50 prose-code:text-shivraj-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none prose-pre:bg-shivraj-900 prose-pre:text-shivraj-50 prose-pre:rounded-xl prose-table:rounded-xl prose-table:overflow-hidden prose-th:bg-shivraj-50 prose-th:text-shivraj-800 prose-th:p-3 prose-td:p-3 prose-td:border-shivraj-100"
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  );
};

export default RichTextRenderer;
