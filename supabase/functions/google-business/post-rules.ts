export const validatePost = (content: unknown, link: unknown) => {
  if (typeof content !== "string" || !content.trim() || content.trim().length > 1500) throw new Error("Update must contain 1–1500 characters");
  if (typeof link !== "string") throw new Error("Website link required");
  const url = new URL(link);
  if (url.origin !== "https://shivraj-enterprise.lovable.app" || url.username || url.password) throw new Error("Choose a link on the published Shivraj Enterprise website");
  return { content: content.trim(), link: url.toString() };
};
export const canRetry = (status: string) => status === "failed";