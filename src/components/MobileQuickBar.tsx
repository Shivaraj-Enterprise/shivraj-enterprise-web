import { useLocation } from "react-router-dom";
import { Phone, MessageCircle } from "lucide-react";
import { servicePages } from "@/data/servicePages";
import { pageEnquiry, whatsappEnquiry } from "@/lib/enquiryLinks";

const serviceLabels = Object.fromEntries(servicePages.map((p) => [p.slug, p.navLabel]));

const MobileQuickBar = () => {
  const { pathname } = useLocation();
  return (
    <div className="md:hidden print:hidden fixed bottom-5 left-4 z-[90] flex gap-2">
      <a href="tel:+919998498311" aria-label="Call Shivraj Enterprise" className="flex h-12 items-center gap-1.5 rounded-full bg-shivraj-700 px-4 text-sm font-semibold text-white shadow-lg">
        <Phone size={18} /> Call
      </a>
      <a href={whatsappEnquiry(pageEnquiry(pathname, serviceLabels))} target="_blank" rel="noopener noreferrer" aria-label="Get a quote on WhatsApp" className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
        <MessageCircle size={20} />
      </a>
    </div>
  );
};

export default MobileQuickBar;
