import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SalesChatWidget from "./SalesChatWidget";
import { PageTransition, ScrollProgress } from "./motion";
import { useLocation } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      {!pathname.startsWith("/blog/") && <ScrollProgress />}
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
      <div className="print:hidden">
        <SalesChatWidget />
      </div>
    </div>
  );
};

export default Layout;
