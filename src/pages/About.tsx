import { Users, Shield, Award, BarChart, FileCheck } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";
import AuroraBackground from "@/components/three/AuroraBackground";
import BlurText from "@/components/reactbits/BlurText";

const About = () => {
  return (
    <Layout>
      <Helmet>
        <title>About Shivraj Enterprise – 10+ Years in Manpower Supply</title>
        <meta name="description" content="Learn about Shivraj Enterprise: a decade of experience supplying skilled labour and housekeeping staff to industries across Vapi GIDC, Gujarat." />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/#/about" />
        <meta property="og:title" content="About Shivraj Enterprise" />
        <meta property="og:description" content="A decade of experience supplying skilled labour and housekeeping staff to industries in Vapi GIDC." />
        <meta property="og:url" content="https://shivraj-enterprise.lovable.app/#/about" />
      </Helmet>
      {/* Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-900 text-white py-20">
        <AuroraBackground intensity="bold" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-2xl shadow-shivraj-500/40 ring-2 ring-white/20">
              <img src={logo} alt="Shivraj Enterprise logo" className="h-12 w-12 object-contain" />
            </div>
          </div>
          <BlurText as="h1" text="About Shivraj Enterprise – Manpower Supplier in Vapi GIDC" className="text-4xl md:text-5xl font-bold mb-4" />
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            Trusted partner for manpower & housekeeping across Vapi GIDC Phases 1–4, Chala, Balitha, Chhiri, Salvav, Chharwada and nearby villages of Valsad District, Gujarat.
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
                Shivraj Enterprise is a trusted name in manpower supply and housekeeping services,
                with over 10 years of industry experience serving <strong>Vapi GIDC (Phases 1–4)</strong> and surrounding villages including Ambheti, Balitha, Chala, Chandor, Chhiri, Karaya, Koparli, Morai, Mota Pondha, Namdha, Ozar, Pandor, Rata, Salvav, Vatar, Chanod, Chharwada, Dabhel, Dungra, Karvad and Chanvai. We provide skilled, semi-skilled, and
                unskilled labour to industries such as Engineering, Pharmaceuticals, Chemicals, and Packaging.
              </p>
              <p className="mb-4">
                Known for reliability and tailored solutions, we ensure operational efficiency for both
                short-term projects and long-term staffing needs, making us your dependable partner in
                workforce outsourcing.
              </p>
              <p className="mb-4">
                We believe in fostering long-term partnerships with our clients. By maintaining open
                lines of communication and actively seeking feedback, we refine our services to meet
                evolving needs — solidifying trust and contributing to the sustainability of operations
                within the industries we serve.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mt-16">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-10 text-center">Our Core Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Shield, title: "Reliability", desc: "We deliver on our promises and ensure consistent service quality" },
                { icon: Users, title: "Client Satisfaction", desc: "We prioritize our clients' needs and work to exceed expectations" },
                { icon: Award, title: "Expertise", desc: "We leverage our industry knowledge to provide optimal staffing solutions" },
                { icon: BarChart, title: "Efficiency", desc: "We optimize processes to deliver timely and effective results" },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="text-center">
                  <div className="w-16 h-16 bg-shivraj-100 text-shivraj-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-shivraj-800">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-8 text-center">Why Choose Shivraj Enterprise?</h2>

            <div className="bg-shivraj-50 rounded-lg p-8 border border-shivraj-100">
              <ul className="space-y-4">
                {[
                  ["Proven Experience", "10+ years serving leading industries with manpower and housekeeping solutions."],
                  ["Quality & Reliability", "Trained workforce with strong attendance and punctuality systems."],
                  ["Full Compliance", "Adherence to PF, ESIC, GST and all labour laws for client safety and transparency."],
                  ["Skilled & Flexible Workforce", "Tailored solutions for short-term or long-term requirements."],
                  ["Continuous Training", "Staff equipped with safety, operational, and service best practices."],
                ].map(([title, desc], i) => (
                  <li key={title} className="flex">
                    <span className="text-shivraj-600 font-bold mr-2">{i + 1}.</span>
                    <span className="text-gray-700"><strong>{title}:</strong> {desc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Licenses & Registrations */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-8 text-center">Licenses & Registrations</h2>
            <p className="text-gray-600 text-center mb-8">
              We hold all critical licenses and registrations confirming our compliance with industry regulations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["PAN", "AERPY4658M"],
                ["GSTIN", "24AERPY4658M1ZF"],
                ["Provident Fund (PF) Registration", "1448586"],
                ["ESIC Registration", "39000538650000300"],
                ["Labour Law Compliance Certificates", "Active"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-start bg-white border border-shivraj-100 rounded-lg p-4 shadow-sm">
                  <FileCheck size={22} className="text-shivraj-600 mr-3 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">{label}</p>
                    <p className="font-semibold text-shivraj-800 break-all">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
