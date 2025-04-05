
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <Link to="/" className="flex items-center">
            <h1 className="text-xl md:text-2xl font-bold text-shivraj-800">
              SHIVRAJ ENTERPRISE <span className="text-shivraj-600 text-sm md:text-base">PVT. LTD.</span>
            </h1>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-shivraj-700 hover:text-shivraj-500 font-medium">Home</Link>
            <Link to="/about" className="text-shivraj-700 hover:text-shivraj-500 font-medium">About Us</Link>
            <Link to="/services" className="text-shivraj-700 hover:text-shivraj-500 font-medium">Services</Link>
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
              aria-label="Toggle menu"
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
                <Link 
                  to="/services" 
                  className="block text-shivraj-700 hover:text-shivraj-500 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="block text-shivraj-700 hover:text-shivraj-500 font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
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
