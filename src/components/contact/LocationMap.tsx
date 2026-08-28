
import { motion } from "framer-motion";

const LocationMap = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-shivraj-800 mb-8 text-center">Find Us</h2>
        <div className="h-96 rounded-lg overflow-hidden shadow-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3739.934290018317!2d72.9276453!3d20.385598999999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0cf55ca2a6cc5%3A0xa3379cf63d9b0966!2sShivraj%20Enterprise!5e0!3m2!1sen!2sin!4v1787908166059!5m2!1sen!2sin"
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Shivraj Enterprise Location"
            className="w-full h-full"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;
