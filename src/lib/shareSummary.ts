// Builds ready-made, click-worthy share text (hook + questions + link + hashtags) for blog articles.

const BRAND_TAGS = ["ShivrajEnterprise", "ManpowerSupply", "VapiGIDC"];
export const SITE_ORIGIN = "https://shivraj-enterprise.lovable.app";

export type ShareTone = "professional" | "catchy" | "teaser";

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

const TOPICS: { re: RegExp; emoji: string; cover: string }[] = [
  { re: /gst|tds|tax|cost|wage|salary|rate|price/i, emoji: "💰", cover: "tax" },
  { re: /security|guard/i, emoji: "🛡️", cover: "security" },
  { re: /housekeep|facility|clean/i, emoji: "🏭", cover: "housekeeping" },
  { re: /complian|epf|esi|labour law|statutory|checklist|hr/i, emoji: "⚖️", cover: "compliance" },
];

const topicOf = (text: string) => TOPICS.find((t) => t.re.test(text));
export const topicEmoji = (text: string) => topicOf(text)?.emoji ?? "🚀";

// Auto cover image (absolute URL so social previews work).
export const coverFor = (title: string, slug = "") =>
  `${SITE_ORIGIN}/covers/${topicOf(`${slug} ${title}`)?.cover ?? "manpower"}.jpg`;

export interface ShareTextInput {
  title: string;
  url: string;
  excerpt?: string;
  tags?: string[];
  questions?: string[];
  readMinutes?: number;
  tone?: ShareTone;
}

const tagLine = (tags?: string[]) => buildHashtags(tags).map((h) => `#${h}`).join(" ");

export const buildShareText = ({
  title, url, excerpt, tags = [], questions = [], readMinutes, tone = "professional",
}: ShareTextInput): string => {
  const e = topicEmoji(title);
  const qs = questions.slice(0, 3);
  const read = readMinutes ? `⏱️ ${readMinutes}-min read` : "";
  if (tone === "catchy") {
    return [
      `${e} ${title}`,
      excerpt ? `\n${excerpt.split(/(?<=[.!?])\s/)[0]}` : "",
      qs[0] ? `\n🤔 ${qs[0]}` : "",
      `\n👇 Read it here: ${url}`,
      `\n${tagLine(tags)}`,
    ].filter(Boolean).join("\n");
  }
  if (tone === "teaser") {
    const hook = qs[0] ? `🤔 Do you know: ${qs[0]}` : `🤔 Do you really know ${title.toLowerCase()}?`;
    return [
      hook,
      "\nMost factory owners in Vapi GIDC get this wrong. We broke it down simply 👇",
      `\n${e} ${title}`,
      read ? `${read}` : "",
      `\n👉 Find out: ${url}`,
      `\n${tagLine(tags)}`,
    ].filter(Boolean).join("\n");
  }
  return [
    `${e} ${title}`,
    excerpt ? `\n${excerpt}` : "",
    qs.length ? `\n❓ What you'll find answered:\n${qs.map((q) => `✅ ${q}`).join("\n")}` : "",
    `\n👷 Who it's for: factory owners, HR & purchase teams in Vapi GIDC`,
    read,
    `\n👉 Read the full guide: ${url}`,
    `\n${tagLine(tags)}`,
  ].filter(Boolean).join("\n");
};

// Twitter/X limit: 280 chars.
export const buildTweetText = (input: ShareTextInput): string => {
  const tags = tagLine(input.tags);
  const e = topicEmoji(input.title);
  const qs = (input.questions ?? []).slice(0, 2);
  const tail = `\n\n👉 ${input.url}\n${tags}`;
  let body = `${e} ${input.title}${qs.length ? "\n\n" + qs.map((q) => `✅ ${q}`).join("\n") : ""}`;
  while (body.length + tail.length > 280 && qs.length) {
    qs.pop();
    body = `${e} ${input.title}${qs.length ? "\n\n" + qs.map((q) => `✅ ${q}`).join("\n") : ""}`;
  }
  if (body.length + tail.length > 280) body = body.slice(0, 280 - tail.length - 1) + "…";
  return body + tail;
};
