
import { Users, Shield, Award, BarChart } from "lucide-react";
import Layout from "@/components/Layout";

const About = () => {
  return (
    <Layout>
      {/* Page Header */}
      <section className="bg-shivraj-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Us</h1>
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            Learn more about our company, our values, and our expertise in manpower supply
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-6">Our Story</h2>
            
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                SHIVRAJ ENTERPRISE PVT. LTD. is a trusted name in manpower supply and staffing solutions, 
                providing skilled, semi-skilled, and unskilled labor to industries across various sectors. 
              </p>
              
              <p className="mb-4">
                With a strong focus on reliability, efficiency, and client satisfaction, we specialize in 
                temporary staffing, contract labor, recruitment services, and industrial workforce management. 
                Our team ensures timely deployment, compliance with labor laws, and customized workforce 
                solutions tailored to meet each client's operational needs.
              </p>
              
              <p className="mb-4">
                Whether for short-term projects or long-term staffing support, SHIVRAJ ENTERPRISE is your 
                dependable partner in human resource outsourcing. We are in this manpower supply/labor 
                contractor industry for over 10+ years.
              </p>
              
              <p className="mb-4">
                We have contractors in many industries, one of which is AURORIUM. We provide services in 
                many cities of Gujarat, mainly in GIDC Vapi, Daman, Dadra and Nagar Haveli, and Daman and Diu.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-10 text-center">Our Core Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Value 1 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-shivraj-100 text-shivraj-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Reliability</h3>
                <p className="text-gray-600">We deliver on our promises and ensure consistent service quality</p>
              </div>
              
              {/* Value 2 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-shivraj-100 text-shivraj-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Client Satisfaction</h3>
                <p className="text-gray-600">We prioritize our clients' needs and work to exceed expectations</p>
              </div>
              
              {/* Value 3 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-shivraj-100 text-shivraj-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Expertise</h3>
                <p className="text-gray-600">We leverage our industry knowledge to provide optimal staffing solutions</p>
              </div>
              
              {/* Value 4 */}
              <div className="text-center">
                <div className="w-16 h-16 bg-shivraj-100 text-shivraj-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BarChart size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-shivraj-800">Efficiency</h3>
                <p className="text-gray-600">We optimize processes to deliver timely and effective results</p>
              </div>
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-8 text-center">Why Choose Shivraj Enterprise?</h2>
            
            <div className="bg-shivraj-50 rounded-lg p-8 border border-shivraj-100">
              <ul className="space-y-4">
                <li className="flex">
                  <span className="text-shivraj-600 font-bold mr-2">1.</span>
                  <span className="text-gray-700"><strong>Decade of Experience:</strong> Over 10+ years in the manpower supply industry</span>
                </li>
                <li className="flex">
                  <span className="text-shivraj-600 font-bold mr-2">2.</span>
                  <span className="text-gray-700"><strong>Wide Network:</strong> Established presence across major industrial areas in Gujarat</span>
                </li>
                <li className="flex">
                  <span className="text-shivraj-600 font-bold mr-2">3.</span>
                  <span className="text-gray-700"><strong>Compliance Focused:</strong> Strict adherence to labor laws and regulations</span>
                </li>
                <li className="flex">
                  <span className="text-shivraj-600 font-bold mr-2">4.</span>
                  <span className="text-gray-700"><strong>Customized Solutions:</strong> Tailored workforce management strategies for each client</span>
                </li>
                <li className="flex">
                  <span className="text-shivraj-600 font-bold mr-2">5.</span>
                  <span className="text-gray-700"><strong>Quality Assurance:</strong> Rigorous screening process for all personnel</span>
                </li>
                <li className="flex">
                  <span className="text-shivraj-600 font-bold mr-2">6.</span>
                  <span className="text-gray-700"><strong>Timely Deployment:</strong> Efficient processes to meet urgent staffing needs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
