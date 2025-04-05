
import { motion } from "framer-motion";

const PageHeader = () => {
  return (
    <motion.section 
      className="bg-shivraj-800 text-white py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
          Get in touch with our team for inquiries, quotes, or any questions
        </p>
      </div>
    </motion.section>
  );
};

export default PageHeader;
