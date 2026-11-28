export const REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJxWwqylXP4DsRZgmbPfacN6M";
export const reviewRequest = "Thank you for working with Shivraj Enterprise. Would you share an honest review of your experience with our industrial manpower services? " + REVIEW_URL;
export const whatsappEnquiry = (message: string) => `https://wa.me/919998498311?text=${encodeURIComponent(message)}`;
export const quoteEnquiry = (message: string) => `/contact?inquiry=quote&message=${encodeURIComponent(message)}`;

export const serviceEnquiry = (service: string, area?: string) => `Hello Shivraj Enterprise, I need ${service}${area ? ` in ${area}` : " for my factory"}. Location: ${area ?? ""}; Workers: ; Shift: ; Start date: . Please confirm availability and quotation.`;

// Quick WhatsApp enquiry: a complete, ready-to-send message built from the visitor's choices.
export const ENQUIRY_AREAS = ["Vapi GIDC", "Sarigam GIDC", "Umbergaon", "Silvassa", "Daman"] as const;
export const SHIFT_OPTIONS = ["Day shift (8 hrs)", "Night shift (8 hrs)", "12-hour shift", "Rotational shifts"] as const;
export const START_OPTIONS = ["Immediately", "Within a week", "Within a month"] as const;
export const MAX_WORKERS = 500;

export type QuickEnquiry = { service: string; area: string; workers: number; shift: string; start: string };

export const clampWorkers = (n: number) => (Number.isFinite(n) ? Math.min(MAX_WORKERS, Math.max(1, Math.round(n))) : 1);

export const quickEnquiry = ({ service, area, workers, shift, start }: QuickEnquiry) => {
  const count = clampWorkers(workers);
  return `Hello Shivraj Enterprise, I need ${count} ${count === 1 ? "worker" : "workers"} for ${service} in ${area}. Shift: ${shift}. Start: ${start}. Please confirm availability and quotation.`;
};

// Floating mobile WhatsApp button: carries the page's service or area context when there is one.
export const pageEnquiry = (path: string, serviceLabels: Record<string, string>) => {
  const slug = path.match(/^\/services\/([^/]+)/)?.[1];
  if (slug && serviceLabels[slug]) return serviceEnquiry(serviceLabels[slug]);
  if (path.startsWith("/locations")) return serviceEnquiry("Industrial Manpower", "the Vapi industrial belt");
  if (path.startsWith("/labour-cost-calculator")) return "Hello Shivraj Enterprise, I used your labour cost calculator and would like a quotation. Workers: ; Shift: ; Location: . Please confirm availability and rates.";
  return "Hello Shivraj Enterprise, I need manpower for my factory. Please share details and rates.";
};
