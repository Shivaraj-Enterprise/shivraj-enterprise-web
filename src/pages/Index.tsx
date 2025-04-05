
import { ArrowRight, Users, Briefcase, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-shivraj-800 to-shivraj-900 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Your Trusted Partner in Manpower Solutions
            </h1>
            <p className="text-xl mb-8 text-shivraj-100 animate-slide-up">
              Providing skilled, semi-skilled, and unskilled labor to industries across various sectors for over 10+ years.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="bg-white text-shivraj-800 hover:bg-shivraj-50">
                <Link to="/services">Our Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Summary Section */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">About Shivraj Enterprise</h2>
            <p className="section-subtitle">
              A reliable manpower supply company with a decade of industry experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="text-gray-600 mb-6">
                SHIVRAJ ENTERPRISE PVT. LTD. is a trusted name in manpower supply and staffing solutions, 
                providing skilled, semi-skilled, and unskilled labor to industries across various sectors. 
                With a strong focus on reliability, efficiency, and client satisfaction, we specialize in 
                temporary staffing, contract labor, recruitment services, and industrial workforce management.
              </p>
              <p className="text-gray-600 mb-6">
                Our team ensures timely deployment, compliance with labor laws, and customized workforce 
                solutions tailored to meet each client's operational needs.
              </p>
              <Button asChild className="bg-shivraj-600 hover:bg-shivraj-700">
                <Link to="/about" className="flex items-center">
                  Learn More <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <div className="bg-shivraj-50 p-6 rounded-lg border border-shivraj-100">
              <h3 className="text-2xl font-semibold text-shivraj-800 mb-4">Our Presence</h3>
              <p className="text-gray-600 mb-6">
                We provide services in many cities of Gujarat, mainly in:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle size={18} className="text-shivraj-600 mr-2" />
                  <span>GIDC Vapi</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={18} className="text-shivraj-600 mr-2" />
                  <span>Daman</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={18} className="text-shivraj-600 mr-2" />
                  <span>Dadra and Nagar Haveli</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle size={18} className="text-shivraj-600 mr-2" />
                  <span>Daman and Diu</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section bg-shivraj-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">Our Services</h2>
            <p className="section-subtitle">
              Comprehensive staffing and manpower solutions for various industries
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mb-4">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-shivraj-800">Temporary Staffing</h3>
              <p className="text-gray-600">
                Flexible workforce solutions for short-term projects and seasonal demands.
              </p>
            </div>
            
            {/* Service Card 2 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mb-4">
                <Briefcase size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-shivraj-800">Contract Labor</h3>
              <p className="text-gray-600">
                Reliable workforce for contractual requirements with complete legal compliance.
              </p>
            </div>
            
            {/* Service Card 3 */}
            <div className="bg-white rounded-lg shadow-md p-6 transition-transform hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-600 flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-shivraj-800">Specialized Recruitment</h3>
              <p className="text-gray-600">
                Industry-specific skilled workforce tailored to your operational needs.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-shivraj-600 hover:bg-shivraj-700">
              <Link to="/services">
                View All Services
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-shivraj-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8 text-shivraj-100 max-w-3xl mx-auto">
            Whether you need short-term staffing or long-term workforce management, 
            we're here to provide reliable solutions for your business.
          </p>
          <Button asChild size="lg" className="bg-white text-shivraj-800 hover:bg-shivraj-50">
            <Link to="/contact">Contact Us Today</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
