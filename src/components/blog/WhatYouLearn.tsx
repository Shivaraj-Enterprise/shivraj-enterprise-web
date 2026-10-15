import { HelpCircle } from "lucide-react";

const WhatYouLearn = ({ questions }: { questions: string[] }) => {
  if (!questions.length) return null;
  return (
    <div className="not-prose mb-10 p-6 rounded-2xl bg-gradient-to-br from-shivraj-50 to-white border border-shivraj-100 shadow-sm">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-shivraj-600 mb-3">
        <HelpCircle size={16} /> 🎯 What you'll get answered
      </div>
      <ul className="space-y-2">
        {questions.slice(0, 3).map((q) => (
          <li key={q} className="flex gap-2 text-shivraj-900 font-medium">
            <span aria-hidden>✅</span> {q}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WhatYouLearn;
