import { QRCodeSVG } from "qrcode.react";
import { Copy, MessageCircle, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { REVIEW_URL, reviewRequest } from "@/lib/enquiryLinks";

export default function ReviewRequests() {
  return <section className="py-8 border-y mb-6">
    <h2 className="text-xl font-semibold text-shivraj-800 mb-4">Request a client review</h2>
    <div className="flex flex-col sm:flex-row items-start gap-6">
      <div className="bg-card p-3 border rounded-lg"><QRCodeSVG value={REVIEW_URL} size={132} title="Review Shivraj Enterprise on Google" /></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-muted-foreground mb-4">{reviewRequest}</p>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={async () => { try { await navigator.clipboard.writeText(reviewRequest); toast.success("Review request copied"); } catch { toast.error("Could not copy review request"); } }}><Copy size={16} className="mr-2" />Copy request</Button>
          <Button asChild variant="outline"><a href={`https://wa.me/?text=${encodeURIComponent(reviewRequest)}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={16} className="mr-2" />Share on WhatsApp</a></Button>
          <Button asChild variant="outline"><a href={REVIEW_URL} target="_blank" rel="noopener noreferrer"><Star size={16} className="mr-2" />Google review</a></Button>
        </div>
      </div>
    </div>
  </section>;
}