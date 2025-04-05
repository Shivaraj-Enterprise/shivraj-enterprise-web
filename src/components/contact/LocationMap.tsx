
import { motion } from "framer-motion";

const LocationMap = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-shivraj-800 mb-8 text-center">Find Us</h2>
        <div className="h-96 rounded-lg overflow-hidden shadow-md">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59940.32068729654!2d72.87068389221193!3d20.371612300000012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be0ce6b7f146def%3A0xc11695a453f24ab8!2sVapi%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1712336964509!5m2!1sen!2sin"
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
