export const validatePost = (content: unknown, link: unknown) => {
  if (typeof content !== "string" || !content.trim() || content.trim().length > 1500) throw new Error("Update must contain 1–1500 characters");
  if (typeof link !== "string") throw new Error("Website link required");
  const url = new URL(link);
  if (url.origin !== "https://shivraj-enterprise.lovable.app" || url.username || url.password) throw new Error("Choose a link on the published Shivraj Enterprise website");
  return { content: content.trim(), link: url.toString() };
};
export const canRetry = (status: string) => status === "failed";

export { mondayKey } from "../_shared/monday-key.ts";

export function weeklyDraft(trend: { topic?: string; faqs?: unknown } | null) {
  const faq = Array.isArray(trend?.faqs) ? trend.faqs[0] : null;
  const clean = (s: string) => s.replace(/<[^>]*>/g, "").trim();
  const question = typeof faq?.question === "string" ? clean(faq.question).slice(0, 200) : "";
  const answer = typeof faq?.answer === "string" ? clean(faq.answer).slice(0, 700) : "";
  const opening = question && answer ? `${question}\n\n${answer}` : "Planning your factory workforce? Shivraj Enterprise provides industrial manpower supply for factory owners, plant managers and HR teams.";
  return validatePost(`${opening}\n\nShivraj Enterprise — industrial manpower supply across Vapi GIDC, Sarigam, Umbergaon, Daman and Silvassa.\n\nDiscuss your workforce requirements or estimate your labour budget on our website.`, "https://shivraj-enterprise.lovable.app/labour-cost-calculator?utm_source=google&utm_medium=organic&utm_campaign=monday_business_update");
}