// Pushes conversion events to Google Tag Manager's dataLayer. Never include personal details.
type DL = Record<string, unknown>[];
export function pushDataLayer(event: string, params: Record<string, string | number | boolean> = {}) {
  const w = window as unknown as { dataLayer?: DL };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...params });
}

// One site-wide listener so every WhatsApp contact link is tracked (share links without a number are skipped).
export function trackWhatsAppClicks() {
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const m = a.href.match(/^https?:\/\/(?:wa\.me|api\.whatsapp\.com\/send)\/?(\d+)?/i);
    const num = m?.[1] || (a.href.includes("api.whatsapp.com") ? new URL(a.href).searchParams.get("phone") : null);
    if (!m || !num) return;
    pushDataLayer("whatsapp_click", { page_path: window.location.pathname, link_text: (a.textContent || "").trim().slice(0, 60) });
  }, true);
}

// Google Analytics 4: loads only when VITE_GA_MEASUREMENT_ID (G-XXXX) is set; page views are sent on route change.
const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID as string | undefined;
function gtag(..._args: unknown[]) {
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  // eslint-disable-next-line prefer-rest-params
  w.dataLayer.push(arguments);
}
export function initGA() {
  if (!GA_ID || !/^G-[A-Z0-9]+$/i.test(GA_ID)) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  gtag("js", new Date());
  gtag("config", GA_ID, { send_page_view: false });
  document.addEventListener("click", (e) => {
    const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!a) return;
    const page_path = window.location.pathname;
    if (a.href.startsWith("tel:")) gtag("event", "phone_click", { page_path });
    else if (a.href.startsWith("mailto:")) gtag("event", "email_click", { page_path });
    else if (/wa\.me|api\.whatsapp\.com/i.test(a.href)) gtag("event", "whatsapp_click", { page_path });
  }, true);
}
export function gaPageView(path: string) {
  if (!GA_ID) return;
  gtag("event", "page_view", { page_path: path, page_location: window.location.href, page_title: document.title });
}
