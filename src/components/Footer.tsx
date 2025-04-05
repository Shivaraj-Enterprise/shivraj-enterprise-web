
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-shivraj-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">SHIVRAJ ENTERPRISE PVT. LTD.</h2>
            <p className="text-shivraj-100 mb-4">
              A trusted name in manpower supply and staffing solutions with over 10+ years of experience in the industry.
            </p>
            <div className="flex space-x-4 mt-4">
              {/* Social media icons would go here */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-shivraj-100 hover:text-white">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-shivraj-100 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link to="/services" className="text-shivraj-100 hover:text-white">Our Services</Link>
              </li>
              <li>
                <Link to="/contact" className="text-shivraj-100 hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 flex-shrink-0" />
                <span>Vapi, Gujarat, India</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-2 flex-shrink-0" />
                <a href="tel:+919998498311" className="hover:text-shivraj-200">+91 99984 98311</a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-2 flex-shrink-0" />
                <a href="mailto:shivrajenterprise1234@gmail.com" className="hover:text-shivraj-200 break-all">
                  shivrajenterprise1234@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-shivraj-700 mt-8 pt-8 text-center">
          <p className="text-sm text-shivraj-300">
            © {currentYear} SHIVRAJ ENTERPRISE PVT. LTD. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
