import { motion } from "framer-motion";
import logo from "@/assets/logo.png";
import AuroraBackground from "@/components/three/AuroraBackground";
import BlurText from "@/components/reactbits/BlurText";

const PageHeader = () => {
  return (
    <motion.section
      className="relative overflow-hidden bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-900 text-white py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AuroraBackground intensity="bold" />
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          className="flex justify-center mb-4"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: "backOut" }}
        >
          <div className="bg-white rounded-full p-3 shadow-2xl shadow-shivraj-500/40 ring-2 ring-white/20">
            <img src={logo} alt="Shivraj Enterprise logo" className="h-12 w-12 object-contain" />
          </div>
        </motion.div>
        <BlurText as="h1" text="Contact Shivraj Enterprise – Vapi GIDC, Gujarat" className="text-4xl md:text-5xl font-bold mb-4" />
        <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
          Reach our team in Vapi for manpower & housekeeping inquiries across Vapi GIDC Phases 1–4 and surrounding villages
        </p>
      </div>
    </motion.section>
  );
};

export default PageHeader;
