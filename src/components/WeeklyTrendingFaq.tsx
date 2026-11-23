import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import FaqSection, { type FaqItem } from "@/components/FaqSection";

// Shows the latest weekly Q&A written by the Monday growth engine from real Google searches.
const WeeklyTrendingFaq = () => {
  const [data, setData] = useState<{ topic: string; faqs: FaqItem[] } | null>(null);

  useEffect(() => {
    supabase
      .from("weekly_trending_content")
      .select("topic, faqs")
      .eq("active", true)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data && Array.isArray(data.faqs) && data.faqs.length) {
          setData({ topic: data.topic, faqs: data.faqs as unknown as FaqItem[] });
        }
      });
  }, []);

  useEffect(() => {
    if (!data) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = "weekly-trending-faq";
    el.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: data.faqs.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
    document.head.appendChild(el);
    return () => el.remove();
  }, [data]);

  if (!data) return null;
  return (
    <div>
      <div className="flex justify-center pt-10 bg-shivraj-50">
        <span className="inline-flex items-center gap-2 rounded-full bg-shivraj-100 px-4 py-1.5 text-sm font-medium text-shivraj-700">
          <TrendingUp size={16} /> Trending in Vapi GIDC industry this week
        </span>
      </div>
      <FaqSection title={data.topic} subtitle="Questions factory managers are searching for right now" items={data.faqs} />
    </div>
  );
};

export default WeeklyTrendingFaq;
