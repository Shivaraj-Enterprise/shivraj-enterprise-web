
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

const PageHeader = () => {
  return (
    <motion.section 
      className="bg-shivraj-800 text-white py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-white rounded-full p-3 shadow-md">
            <img src={logo} alt="Shivraj Enterprise logo" className="h-12 w-12 object-contain" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
          Get in touch with our team for inquiries, quotes, or any questions
        </p>
      </div>
    </motion.section>
  );
};

export default PageHeader;
