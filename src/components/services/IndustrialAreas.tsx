import { Link } from "react-router-dom";
import { MapPin, Calculator, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { serviceEnquiry, whatsappEnquiry } from "@/lib/enquiryLinks";

const areas = [
  ["Vapi GIDC", "Chemical, pharmaceutical and engineering plants: discuss role screening, shift coverage and statutory documentation for your site."],
  ["Sarigam GIDC", "Factory support requirements: discuss helpers, packing staff and industrial housekeeping alongside your production schedule."],
  ["Umbergaon", "Manufacturing and warehouse requirements: specify loading tasks, skill level and day or night shifts for an accurate staffing enquiry."],
  ["Silvassa", "Industrial operations: share worker numbers, site induction requirements and the applicable wage jurisdiction before finalising deployment."],
  ["Daman", "Plant and warehouse staffing: confirm work location, shift hours and contractor responsibilities for your industrial site."],
];

export default function IndustrialAreas({ service = "Industrial Manpower" }: { service?: string }) {
  return <section className="py-12 border-y border-shivraj-100 bg-shivraj-50">
    <div className="container mx-auto px-4 max-w-5xl">
      <h2 className="text-2xl font-bold text-shivraj-800 mb-6">{service} across the industrial belt</h2>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6">
        {areas.map(([area, description]) => <div key={area}>
          <h3 className="font-semibold text-shivraj-800 flex items-center gap-2"><MapPin size={16} />{area}</h3>
          <p className="text-muted-foreground text-sm mt-2 mb-3">{description}</p>
          <Button asChild size="sm" variant="outline"><a href={whatsappEnquiry(serviceEnquiry(service, area))} target="_blank" rel="noopener noreferrer"><MessageCircle size={15} className="mr-2" />Enquire for {area}</a></Button>
        </div>)}
      </div>
      <Button asChild className="mt-8"><Link to="/labour-cost-calculator"><Calculator size={16} className="mr-2" />Estimate labour costs</Link></Button>
    </div>
  </section>;
}