import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const ScrollTopButton = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 left-6 z-40 w-11 h-11 rounded-full bg-white/90 backdrop-blur border border-shivraj-100 shadow-lg text-shivraj-700 flex items-center justify-center hover:bg-shivraj-600 hover:text-white hover:-translate-y-0.5 transition-all animate-fade-in"
    >
      <ArrowUp size={18} />
    </button>
  );
};

export default ScrollTopButton;
