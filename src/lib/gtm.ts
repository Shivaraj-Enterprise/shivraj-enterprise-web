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
