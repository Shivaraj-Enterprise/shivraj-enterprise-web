
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Terms from "./pages/Terms";
import Locations from "./pages/Locations";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

import AdminLogin from "./pages/AdminLogin";
import AdminResetPassword from "./pages/AdminResetPassword";
import AdminSubmissions from "./pages/AdminSubmissions";
import AdminAuditLog from "./pages/AdminAuditLog";
import AdminRoles from "./pages/AdminRoles";
import AdminCompanyProfile from "./pages/AdminCompanyProfile";
import AdminBlogList from "./pages/AdminBlogList";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminRateCard from "./pages/AdminRateCard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />

            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/reset-password" element={<AdminResetPassword />} />
            <Route path="/admin/submissions" element={<AdminSubmissions />} />
            <Route path="/admin/audit-log" element={<AdminAuditLog />} />
            <Route path="/admin/roles" element={<AdminRoles />} />
            <Route path="/admin/company-profile" element={<AdminCompanyProfile />} />
            <Route path="/admin/blog" element={<AdminBlogList />} />
            <Route path="/admin/blog/new" element={<AdminBlogEditor />} />
            <Route path="/admin/blog/:id/edit" element={<AdminBlogEditor />} />
            <Route path="/admin/rate-card" element={<AdminRateCard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
