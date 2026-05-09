
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Helmet>
          <meta name="description" content="Trusted manpower supply and staffing services company in Gujarat, India. Providing skilled, semi-skilled and unskilled labor across various industries." />
          <meta name="keywords" content="manpower supply, staffing services, labour contractor, Vapi, Gujarat, industrial workforce, temporary staffing" />
          <link rel="canonical" href="https://shivrajenterprise.com" />
          <meta property="og:title" content="Shivraj Enterprise Pvt. Ltd. - Manpower Supply & Staffing Solutions" />
          <meta property="og:description" content="Trusted manpower supply and staffing services company in Gujarat, India. Providing skilled, semi-skilled and unskilled labor across various industries." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://shivrajenterprise.com" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Shivraj Enterprise Pvt. Ltd. - Manpower Supply & Staffing Solutions" />
          <meta name="twitter:description" content="Trusted manpower supply and staffing services company in Gujarat, India." />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
