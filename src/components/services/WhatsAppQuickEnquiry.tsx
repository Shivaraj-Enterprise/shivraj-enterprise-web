import { useState } from "react";
import { Link } from "react-router-dom";
import { MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { servicePages } from "@/data/servicePages";
import { pushDataLayer } from "@/lib/gtm";
import {
  ENQUIRY_AREAS, MAX_WORKERS, SHIFT_OPTIONS, START_OPTIONS,
  clampWorkers, quickEnquiry, quoteEnquiry, whatsappEnquiry,
} from "@/lib/enquiryLinks";

const fieldClass = "mt-1 h-11 w-full rounded-md border border-shivraj-200 bg-white px-3 text-sm text-shivraj-900 focus:outline-none focus:ring-2 focus:ring-shivraj-500";

type Props = { service?: string; area?: string; title?: string };

/** Visitors pick headcount, area, shift and start; WhatsApp opens with a complete enquiry. */
export default function WhatsAppQuickEnquiry({ service: fixedService, area: defaultArea, title }: Props) {
  const [service, setService] = useState(fixedService ?? servicePages[0]?.navLabel ?? "Industrial Manpower");
  const [area, setArea] = useState<string>(defaultArea ?? ENQUIRY_AREAS[0]);
  const [workers, setWorkers] = useState("10");
  const [shift, setShift] = useState<string>(SHIFT_OPTIONS[0]);
  const [start, setStart] = useState<string>(START_OPTIONS[0]);

  const count = clampWorkers(Number(workers));
  const message = quickEnquiry({ service, area, workers: count, shift, start });

  const track = (channel: string) =>
    pushDataLayer("quick_enquiry", { channel, service, area, workers: count, shift, start, page_path: window.location.pathname });

  return (
    <section className="py-12 bg-white" aria-labelledby="quick-enquiry-title">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="rounded-2xl border border-shivraj-100 bg-shivraj-50 p-6 md:p-8 shadow-sm">
          <h2 id="quick-enquiry-title" className="text-2xl font-bold text-shivraj-800">{title ?? "Quick WhatsApp enquiry"}</h2>
          <p className="text-muted-foreground mt-1 mb-6">Choose your requirement and we receive a complete message — no typing needed.</p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {!fixedService && (
              <label className="text-sm font-medium text-shivraj-800 sm:col-span-2 lg:col-span-4">Service
                <select className={fieldClass} value={service} onChange={(e) => setService(e.target.value)}>
                  {servicePages.map((p) => <option key={p.slug}>{p.navLabel}</option>)}
                </select>
              </label>
            )}
            <label className="text-sm font-medium text-shivraj-800">Workers needed
              <input className={fieldClass} type="number" inputMode="numeric" min={1} max={MAX_WORKERS} value={workers}
                onChange={(e) => setWorkers(e.target.value)} onBlur={() => setWorkers(String(count))} />
            </label>
            <label className="text-sm font-medium text-shivraj-800">Location
              <select className={fieldClass} value={area} onChange={(e) => setArea(e.target.value)}>
                {ENQUIRY_AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-shivraj-800">Shift
              <select className={fieldClass} value={shift} onChange={(e) => setShift(e.target.value)}>
                {SHIFT_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-sm font-medium text-shivraj-800">Start
              <select className={fieldClass} value={start} onChange={(e) => setStart(e.target.value)}>
                {START_OPTIONS.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
          </div>

          <p className="mt-5 rounded-md border border-dashed border-shivraj-200 bg-white p-3 text-sm text-gray-700" aria-live="polite">{message}</p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700">
              <a href={whatsappEnquiry(message)} target="_blank" rel="noopener noreferrer" onClick={() => track("whatsapp")}>
                <MessageCircle size={18} className="mr-2" />Send on WhatsApp
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to={quoteEnquiry(message)} onClick={() => track("quote_form")}>
                <FileText size={18} className="mr-2" />Send as quote request
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
