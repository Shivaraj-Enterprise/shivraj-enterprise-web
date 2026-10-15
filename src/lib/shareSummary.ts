// Builds a ready-made share text (summary + hashtags + link) for blog articles.

const BRAND_TAGS = ["ShivrajEnterprise", "ManpowerSupply", "VapiGIDC"];

// "vapi-gidc" | "Vapi GIDC" | "EPF & ESI" -> "VapiGIDC" / "EpfEsi"
export const toHashtag = (tag: string): string =>
  tag
    .replace(/&/g, " and ")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

export const buildHashtags = (tags: string[] = []): string[] => {
  const all = [...tags.map(toHashtag), ...BRAND_TAGS].filter(Boolean);
  return [...new Set(all)].slice(0, 6);
};

export interface ShareTextInput {
  title: string;
  url: string;
  excerpt?: string;
  tags?: string[];
}

// Full share text: hook + who it's for + link + hashtags.
export const buildShareText = ({ title, url, excerpt, tags = [] }: ShareTextInput): string => {
  const hashtags = buildHashtags(tags).map((h) => `#${h}`);
  const lines = [
    title,
    excerpt ? `\n${excerpt}` : "",
    `\nRead the full guide: ${url}`,
    `\n${hashtags.join(" ")}`,
  ];
  return lines.filter(Boolean).join("\n");
};

// Twitter/X limits tweets to 280 chars; trim the excerpt if needed.
export const buildTweetText = (input: ShareTextInput): string => {
  const full = buildShareText(input);
  if (full.length <= 280) return full;
  const hashtags = buildHashtags(input.tags).map((h) => `#${h}`).join(" ");
  const suffix = `\n${input.url}\n${hashtags}`;
  const room = 280 - suffix.length - 1;
  const trimmed = input.title.length > room ? input.title.slice(0, Math.max(0, room - 1)) + "…" : input.title;
  return `${trimmed}${suffix}`;
};
