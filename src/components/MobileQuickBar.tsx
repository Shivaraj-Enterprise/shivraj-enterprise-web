import { Phone, MessageCircle } from "lucide-react";

const WA = "https://wa.me/919998498311?text=" + encodeURIComponent("Hello Shivraj Enterprise, I need manpower for my factory. Please share details and rates.");

const MobileQuickBar = () => (
  <div className="md:hidden print:hidden fixed bottom-5 left-4 z-[90] flex gap-2">
    <a href="tel:+919998498311" aria-label="Call Shivraj Enterprise" className="flex h-12 items-center gap-1.5 rounded-full bg-shivraj-700 px-4 text-sm font-semibold text-white shadow-lg">
      <Phone size={18} /> Call
    </a>
    <a href={WA} target="_blank" rel="noopener noreferrer" aria-label="Get a quote on WhatsApp" className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white shadow-lg">
      <MessageCircle size={20} />
    </a>
  </div>
);

export default MobileQuickBar;
