
import { Phone, Mail, MapPin, CheckCircle, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const ContactInformation = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <h2 className="text-2xl font-bold text-shivraj-800 mb-6">Get In Touch</h2>
      <p className="text-gray-600 mb-8">
        Have questions about our services? Looking for staffing solutions? 
        Our team is ready to assist you. Contact us using any of the methods below 
        or fill out the form and we'll get back to you as soon as possible.
      </p>
      
      <div className="space-y-6 mb-8">
        <motion.div 
          className="flex items-start"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
            <Phone size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-shivraj-800 text-lg">Phone</h3>
            <a href="tel:+919998498311" className="text-gray-600 hover:text-shivraj-600 transition-colors">
              +91 99984 98311
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-4 flex-shrink-0">
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-shivraj-800 text-lg">WhatsApp</h3>
            <a href="https://wa.me/919998498311" className="text-gray-600 hover:text-green-600 transition-colors">
              +91 99984 98311
            </a>
            <p className="text-xs text-gray-500 mt-1">Message us on WhatsApp for quick responses</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
            <Mail size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-shivraj-800 text-lg">Email</h3>
            <a href="mailto:shivrajenterprise1234@gmail.com" className="text-gray-600 hover:text-shivraj-600 transition-colors break-all">
              shivrajenterprise1234@gmail.com
            </a>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex items-start"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mr-4 flex-shrink-0">
            <MapPin size={22} />
          </div>
          <div>
            <h3 className="font-semibold text-shivraj-800 text-lg">Location</h3>
            <p className="text-gray-600">Plot No. 228, A/303, Ved Vihar,<br/>Near Oswal Samaj Hall, Chharwada,<br/>Vapi, Gujarat – 396191</p>
          </div>
        </motion.div>
      </div>
      
      <div className="bg-shivraj-50 p-6 rounded-lg border border-shivraj-100 shadow-sm">
        <h3 className="text-xl font-semibold text-shivraj-800 mb-4">Our Service Areas</h3>
        <ul className="space-y-3">
          {["GIDC Vapi", "Daman", "Dadra and Nagar Haveli", "Daman and Diu"].map((area, index) => (
            <motion.li 
              key={area} 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + (index * 0.1), duration: 0.4 }}
            >
              <CheckCircle size={18} className="text-shivraj-600 mr-2" />
              <span>{area}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default ContactInformation;
