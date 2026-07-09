import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
}

const FaqSection = ({
  title = "Frequently Asked Questions",
  subtitle,
  items,
}: FaqSectionProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="py-16 bg-shivraj-50">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 mb-4">
              <HelpCircle size={24} />
            </div>
            <h2 className="text-3xl font-bold text-shivraj-800 mb-3">{title}</h2>
            {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
          </div>

          <div className="space-y-4">
            {items.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg border transition-colors ${
                    isOpen ? "border-shivraj-300 shadow-md" : "border-shivraj-100 shadow-sm"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between p-5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-shivraj-500 rounded-lg"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span className="font-semibold text-shivraj-800 pr-4">{item.question}</span>
                    <ChevronDown
                      size={20}
                      className={`text-shivraj-600 flex-shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    id={`faq-answer-${index}`}
                    className={`overflow-hidden transition-all ${
                      isOpen ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-5 pb-5 text-gray-600 leading-relaxed">{item.answer}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
