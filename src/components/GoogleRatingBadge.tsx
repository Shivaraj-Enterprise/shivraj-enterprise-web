import { Star } from "lucide-react";

export const GOOGLE_MAPS_URL = "https://maps.google.com/maps?cid=11761041533310798182";
export const GOOGLE_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJxWwqylXP4DsRZgmbPfacN6M";

const GoogleRatingBadge = () => (
  <a
    href={GOOGLE_MAPS_URL}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm text-white backdrop-blur hover:bg-white/20 transition-colors"
    aria-label="See Shivraj Enterprise 5-star reviews on Google Maps"
  >
    <span className="flex text-yellow-300" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
    </span>
    <span className="font-semibold">5.0 on Google</span>
    <span className="hidden sm:inline text-shivraj-100">· Verified business · Since 2016</span>
  </a>
);

export default GoogleRatingBadge;
