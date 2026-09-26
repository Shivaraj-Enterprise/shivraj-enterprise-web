
import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SalesChatWidget from "./SalesChatWidget";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="print:hidden">
        <Header />
      </div>
      <main className="flex-grow">{children}</main>
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
