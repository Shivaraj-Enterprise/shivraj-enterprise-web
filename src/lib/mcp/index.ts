import { defineMcp } from "@lovable.dev/mcp-js";
import listBlogPostsTool from "./tools/list-blog-posts";
import getBlogPostTool from "./tools/get-blog-post";
import getRateCardTool from "./tools/get-rate-card";
import getCompanyInfoTool from "./tools/get-company-info";

export default defineMcp({
  name: "shivraj-enterprise-mcp",
  title: "Shivraj Enterprise MCP",
  version: "0.1.0",
  instructions:
    "Public tools for Shivraj Enterprise Pvt. Ltd. — a manpower supply, outsourcing and industrial housekeeping company in Vapi GIDC, Gujarat. Use `get_company_info` for services, compliance and contact details; `get_rate_card` for public per-shift manpower rates; `list_blog_posts` and `get_blog_post` for published compliance guides (GST, TDS, ESI/EPF).",
  tools: [getCompanyInfoTool, getRateCardTool, listBlogPostsTool, getBlogPostTool],
});
