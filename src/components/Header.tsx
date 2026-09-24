
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Mail, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.webp";
import { servicePages } from "@/data/servicePages";

const topServiceSlugs = [
  "manpower-supply-services",
  "manpower-outsourcing-services",
  "industrial-housekeeping-services",
];

const topServices = servicePages.filter((p) => topServiceSlugs.includes(p.slug));
const moreServices = servicePages.filter((p) => !topServiceSlugs.includes(p.slug));

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top contact bar */}
      <div className="bg-shivraj-800 text-white py-2">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-4">
            <a href="mailto:shivrajenterprise1234@gmail.com" className="flex items-center text-sm hover:text-shivraj-200">
              <Mail size={14} className="mr-1" />
              <span className="hidden sm:inline">shivrajenterprise1234@gmail.com</span>
              <span className="inline sm:hidden">Email Us</span>
            </a>
            <a href="tel:+919998498311" className="flex items-center text-sm hover:text-shivraj-200">
              <Phone size={14} className="mr-1" />
              <span>+91 99984 98311</span>
            </a>
          </div>
          <div>
            <span className="text-sm hidden sm:inline">Vapi, Gujarat, India</span>
          </div>
        </div>
      </div>

      {/* Main navbar */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Shivraj Enterprise logo" width={48} height={48} loading="eager" decoding="async" className="h-10 md:h-12 w-auto" />
            <span className="text-xl md:text-2xl font-bold text-shivraj-800">
              Shivraj Enterprise
            </span>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="text-shivraj-700 hover:text-shivraj-500 font-medium">Home</Link>
            <Link to="/about" className="text-shivraj-700 hover:text-shivraj-500 font-medium">About</Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-shivraj-700 hover:text-shivraj-500 font-medium outline-none focus-visible:ring-2 focus-visible:ring-shivraj-400 rounded">
                  Services <ChevronDown size={16} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 bg-white border-shivraj-100">
                <DropdownMenuLabel className="text-shivraj-800">Top Services</DropdownMenuLabel>
                {topServices.map((p) => (
                  <DropdownMenuItem key={p.slug} asChild className="cursor-pointer text-shivraj-700 hover:text-shivraj-600 focus:bg-shivraj-50">
                    <Link to={`/services/${p.slug}`}>{p.navLabel}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-shivraj-800">All Services</DropdownMenuLabel>
                {moreServices.map((p) => (
                  <DropdownMenuItem key={p.slug} asChild className="cursor-pointer text-shivraj-700 hover:text-shivraj-600 focus:bg-shivraj-50">
                    <Link to={`/services/${p.slug}`}>{p.navLabel}</Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer text-shivraj-700 focus:bg-shivraj-50">
                  <Link to="/labour-cost-calculator">Labour Cost Calculator</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer text-shivraj-600 font-medium focus:bg-shivraj-50">
                  <Link to="/services">View All Services</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link to="/locations" className="text-shivraj-700 hover:text-shivraj-500 font-medium">Locations</Link>
            <Link to="/blog" className="text-shivraj-700 hover:text-shivraj-500 font-medium">Blog</Link>
            <Link to="/contact" className="text-shivraj-700 hover:text-shivraj-500 font-medium">Contact</Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button asChild className="bg-shivraj-600 hover:bg-shivraj-700">
              <Link to="/contact">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 border-t mt-4 animate-fade-in">
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/" 
                  className="block text-shivraj-700 hover:text-shivraj-500 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  className="block text-shivraj-700 hover:text-shivraj-500 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About Us
                </Link>
              </li>
              <li>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  aria-expanded={mobileServicesOpen}
                  aria-label={mobileServicesOpen ? "Hide services list" : "Show services list"}
                  className="flex items-center justify-between w-full text-shivraj-700 hover:text-shivraj-500 font-medium"
                >
                  Services
                  <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileServicesOpen && (
                  <ul className="mt-2 ml-3 pl-3 border-l-2 border-shivraj-200 space-y-2">
                    <li>
                      <span className="text-xs font-semibold text-shivraj-500 uppercase tracking-wide">Top Services</span>
                    </li>
                    {topServices.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to={`/services/${p.slug}`}
                          className="block text-shivraj-700 hover:text-shivraj-500 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {p.navLabel}
                        </Link>
                      </li>
                    ))}
                    <li className="pt-1">
                      <span className="text-xs font-semibold text-shivraj-500 uppercase tracking-wide">All Services</span>
                    </li>
                    {moreServices.map((p) => (
                      <li key={p.slug}>
                        <Link
                          to={`/services/${p.slug}`}
                          className="block text-shivraj-700 hover:text-shivraj-500 text-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {p.navLabel}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/labour-cost-calculator" className="block text-shivraj-700 hover:text-shivraj-500 text-sm" onClick={() => setMobileMenuOpen(false)}>
                        Labour Cost Calculator
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services"
                        className="block text-shivraj-600 font-medium text-sm"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        View All Services
                      </Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/locations" className="block text-shivraj-700 hover:text-shivraj-500 font-medium" onClick={() => setMobileMenuOpen(false)}>Locations</Link>
              </li>
              <li>
                <Link to="/blog" className="block text-shivraj-700 hover:text-shivraj-500 font-medium" onClick={() => setMobileMenuOpen(false)}>Blog</Link>
              </li>
              <li>
                <Link to="/contact" className="block text-shivraj-700 hover:text-shivraj-500 font-medium" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              </li>
              <li className="pt-2">
                <Button asChild className="w-full bg-shivraj-600 hover:bg-shivraj-700">
                  <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </li>
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

