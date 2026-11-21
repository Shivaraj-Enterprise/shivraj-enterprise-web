import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { gaPageView } from "@/lib/gtm";

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
    // Let the page set its title before reporting the view.
    const t = setTimeout(() => gaPageView(pathname), 300);
    return () => clearTimeout(t);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
