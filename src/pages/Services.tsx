
import { CheckCircle, Users, Briefcase, Search, UserCheck, ClipboardCheck } from "lucide-react";
import Layout from "@/components/Layout";

const Services = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-shivraj-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            Comprehensive manpower solutions to meet your business needs
          </p>
        </div>
      </section>

      {/* Service Introduction */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-shivraj-800 mb-4">Tailored Workforce Solutions</h2>
            <p className="text-lg text-gray-600">
              At Shivraj Enterprise, we provide a wide range of manpower supply and staffing services 
              designed to meet the diverse needs of businesses across various industries.
            </p>
          </div>

          {/* Services List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Service 1 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-shivraj-50 p-6">
                <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-4">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Temporary Staffing</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Flexible workforce solutions for short-term projects, seasonal demands, or peak periods. 
                  We quickly provide qualified personnel to maintain your productivity without long-term commitments.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Short-term project support</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Seasonal workforce management</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Rapid deployment capabilities</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 2 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-shivraj-50 p-6">
                <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-4">
                  <Briefcase size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Contract Labor</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Reliable workforce solutions for contractual requirements with complete legal compliance. 
                  We handle all aspects of labor management including documentation and regulatory compliance.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Full regulatory compliance</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Contract management services</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Documentation handling</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 3 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-shivraj-50 p-6">
                <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-4">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Recruitment Services</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Expert talent acquisition services to identify and onboard qualified candidates for your 
                  specific industry requirements, saving you time and resources.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Candidate screening and verification</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Industry-specific talent sourcing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Skill assessment and matching</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 4 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-shivraj-50 p-6">
                <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-4">
                  <UserCheck size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Industrial Workforce Management</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Comprehensive industrial workforce solutions including skilled, semi-skilled, and unskilled labor 
                  for manufacturing, production, and other industrial operations.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Skilled technical personnel</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Production line staffing</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Industrial safety compliance</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service 5 */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="bg-shivraj-50 p-6">
                <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-4">
                  <ClipboardCheck size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Customized Workforce Solutions</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-4">
                  Tailored manpower strategies designed for your specific business needs, industry requirements, 
                  and operational challenges to optimize workforce efficiency.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Industry-specific solutions</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Scalable workforce planning</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                    <span className="text-gray-700">Operational efficiency consulting</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Industries Served */}
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-8 text-center">Industries We Serve</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="bg-shivraj-50 p-4 rounded-lg text-center">
                <p className="font-medium">Manufacturing</p>
              </div>
              <div className="bg-shivraj-50 p-4 rounded-lg text-center">
                <p className="font-medium">Construction</p>
              </div>
              <div className="bg-shivraj-50 p-4 rounded-lg text-center">
                <p className="font-medium">Logistics</p>
              </div>
              <div className="bg-shivraj-50 p-4 rounded-lg text-center">
                <p className="font-medium">Chemicals</p>
              </div>
              <div className="bg-shivraj-50 p-4 rounded-lg text-center">
                <p className="font-medium">Pharmaceuticals</p>
              </div>
              <div className="bg-shivraj-50 p-4 rounded-lg text-center">
                <p className="font-medium">Textiles</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-shivraj-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need a Customized Staffing Solution?</h2>
          <p className="text-lg mb-8 text-shivraj-100 max-w-3xl mx-auto">
            Contact us today to discuss your specific requirements. Our team will work with you 
            to develop a tailored manpower solution for your business.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-shivraj-800 px-8 py-3 rounded-lg font-medium hover:bg-shivraj-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
