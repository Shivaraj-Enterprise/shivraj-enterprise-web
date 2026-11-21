import { Star, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion";
import { GOOGLE_MAPS_URL, GOOGLE_REVIEW_URL } from "./GoogleRatingBadge";

const reviews = [
  { name: "Vedant Baviskar", text: "One of the best in vapi regions" },
  { name: "Vinay Kumar", text: "Had a great experience" },
  { name: "Vilas Baisane", text: "Great response" },
];

const GoogleReviewsSection = () => (
  <section className="section bg-white" aria-labelledby="google-reviews-heading">
    <div className="container mx-auto px-4">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-shivraj-600">Google Reviews</p>
        <h2 id="google-reviews-heading" className="text-3xl md:text-4xl font-bold text-shivraj-900 mt-2">What Our Clients Say on Google</h2>
        <p className="mt-3 text-gray-600">Rated 5.0 out of 5 by clients on our verified Google Business Profile.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {reviews.map((r, i) => (
          <Reveal key={r.name} delay={i * 0.08}>
            <figure className="h-full rounded-2xl border border-shivraj-100 bg-shivraj-50 p-6 shadow-sm">
              <div className="flex text-yellow-500 mb-3" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} fill="currentColor" />)}
              </div>
              <blockquote className="text-lg text-gray-800">“{r.text}”</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-shivraj-800">{r.name} · Google review</figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild variant="outline">
          <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer">Read all reviews <ExternalLink size={14} className="ml-1" /></a>
        </Button>
        <Button asChild>
          <a href={GOOGLE_REVIEW_URL} target="_blank" rel="noopener noreferrer">Worked with us? Leave a review</a>
        </Button>
      </div>
    </div>
  </section>
);

export default GoogleReviewsSection;
