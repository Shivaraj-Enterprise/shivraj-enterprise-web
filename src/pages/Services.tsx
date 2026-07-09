import { CheckCircle, Users, Sparkles, PackageCheck, Truck, ClipboardCheck, Download } from "lucide-react";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import logo from "@/assets/logo.png";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRateCard } from "@/hooks/useRateCard";
import AuroraBackground from "@/components/three/AuroraBackground";
import BlurText from "@/components/reactbits/BlurText";
import FaqSection from "@/components/FaqSection";
import type { FaqItem } from "@/components/FaqSection";

const coreServices = [
  {
    icon: Users,
    title: "Manpower Outsourcing",
    desc: "Flexible access to skilled, semi-skilled and unskilled labour while reducing the burden of recruitment and management.",
    bullets: ["Cost-effective recruitment & training", "Scalable workforce to match demand", "Strict vetting for productivity & reliability"],
  },
  {
    icon: Sparkles,
    title: "Housekeeping Solutions",
    desc: "Clean, safe and welcoming environments for industrial, commercial and event settings.",
    bullets: ["Industrial housekeeping with safety compliance", "Commercial cleaning that boosts productivity", "Pre & post event cleaning services"],
  },
];

const auxiliaryServices = [
  { icon: Truck, title: "Loading & Unloading", desc: "Safe and efficient material handling with minimal risk." },
  { icon: PackageCheck, title: "Material Handling & Dispatch", desc: "Smooth inventory flow and supply chain efficiency." },
  { icon: ClipboardCheck, title: "Quality & Packaging Inspectors", desc: "Skilled staff to ensure products meet required standards." },
];

const rateCard = [
  { service: "Supervisor", unit8: "Per month", rate8: "₹25,000", unit12: "—", rate12: "—" },
  { service: "Skilled (Operator) Labour", unit8: "Per 8 hrs", rate8: "₹600", unit12: "Per 12 hrs", rate12: "₹1,300" },
  { service: "Semi-Skilled Labour", unit8: "Per 8 hrs", rate8: "₹550", unit12: "Per 12 hrs", rate12: "₹1,020" },
  { service: "Unskilled Labour", unit8: "Per 8 hrs", rate8: "₹502", unit12: "Per 12 hrs", rate12: "₹800" },
  { service: "Housekeeping", unit8: "Per 8 hrs", rate8: "₹620", unit12: "—", rate12: "—" },
  { service: "Fitter Labour", unit8: "Per 8 hrs", rate8: "₹1,100", unit12: "—", rate12: "—" },
  { service: "Loading / Unloading", unit8: "Per Tonne", rate8: "₹200", unit12: "—", rate12: "—" },
];

const serviceFaqs: FaqItem[] = [
  {
    question: "What is manpower supply services?",
    answer:
      "Manpower supply services provide businesses with skilled, semi-skilled and unskilled workers on a temporary, contract or project basis. Shivraj Enterprise handles recruitment, onboarding, payroll, statutory compliance (PF, ESIC, wages) and replacements, so you can scale your workforce without the overhead of direct employment.",
  },
  {
    question: "What is TDS applicable for service contract for manpower supply?",
    answer:
      "For manpower supply or labour work contracts, TDS under Section 194C applies at 1% when paying an individual or HUF, and 2% for companies, firms or other entities. TDS is deducted when a single payment exceeds ₹30,000 or aggregate payments exceed ₹1,00,000 in a financial year. GST is excluded from TDS if it is shown separately on the invoice.",
  },
  {
    question: "What is the GST rate on manpower supply services?",
    answer:
      "Manpower supply services generally attract 18% GST. It is usually charged under forward charge, meaning the manpower supplier issues a tax invoice and the client can claim input tax credit. Reverse Charge Mechanism (RCM) applies only in specific notified cases, which our team can clarify during billing setup.",
  },
  {
    question: "Do you provide housekeeping, loading and inspection staff too?",
    answer:
      "Yes. Along with industrial manpower, we supply housekeeping staff, loading and unloading labour, material handlers and quality/packaging inspectors for factories, warehouses and commercial sites across Vapi GIDC and surrounding areas.",
  },
  {
    question: "How quickly can workers be deployed?",
    answer:
      "We can usually mobilize screened workers within 24–48 hours for standard roles, depending on the skill category, headcount and site readiness. Supervisors and specialized roles may require a little more lead time.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: serviceFaqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

const Services = () => {
  const { items: dbRateCard, loading: rateCardLoading } = useRateCard();
  const displayedRateCard = dbRateCard.length > 0
    ? dbRateCard.map((r) => ({ service: r.service, unit8: r.unit8, rate8: r.rate8, unit12: r.unit12, rate12: r.rate12 }))
    : rateCard;
  return (
    <Layout>
      <Helmet>
        <title>Services & Rate Card – Shivraj Enterprise Manpower Supply</title>
        <meta name="description" content="Manpower outsourcing, housekeeping, loading & unloading and quality inspection services with transparent rate card. Serving Vapi GIDC industries." />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/#/services" />
        <meta property="og:title" content="Services & Rate Card – Shivraj Enterprise" />
        <meta property="og:description" content="Manpower, housekeeping and auxiliary services with transparent rates." />
        <meta property="og:url" content="https://shivraj-enterprise.lovable.app/#/services" />
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
          <BlurText as="h1" text="Manpower & Housekeeping Services in Vapi GIDC" className="text-4xl md:text-5xl font-bold mb-4" />
          <p className="text-lg text-shivraj-100 max-w-3xl mx-auto">
            Comprehensive manpower, housekeeping and auxiliary solutions for businesses across Vapi GIDC Phases 1–4, Chala, Balitha, Salvav, Chharwada and surrounding villages.
          </p>
          <div className="mt-6">
            <Button asChild className="bg-white text-shivraj-800 hover:bg-shivraj-50">
              <a href={`${import.meta.env.BASE_URL}SHIVRAJ_Enterprise_Company_Profile.pdf`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Download size={18} /> Download Company Profile
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Services */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold text-shivraj-800 mb-4">Core Services</h2>
            <p className="text-lg text-gray-600">
              Tailored to meet the diverse needs of clients across Engineering, Pharmaceuticals, Chemicals and Packaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {coreServices.map(({ icon: Icon, title, desc, bullets }) => (
              <div key={title} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="bg-shivraj-50 p-6">
                  <div className="w-12 h-12 rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-shivraj-800">{title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{desc}</p>
                  <ul className="space-y-2">
                    {bullets.map((b) => (
                      <li key={b} className="flex items-center">
                        <CheckCircle size={16} className="text-shivraj-600 mr-2" />
                        <span className="text-gray-700">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Auxiliary Services */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-shivraj-800 mb-4 text-center">Auxiliary Services</h2>
            <p className="text-gray-600 text-center mb-10 max-w-3xl mx-auto">
              Support services that enhance operations and keep your supply chain running smoothly.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {auxiliaryServices.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="bg-shivraj-50 border border-shivraj-100 rounded-lg p-6">
                  <div className="w-12 h-12 rounded-full bg-white text-shivraj-700 flex items-center justify-center mb-4">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-semibold text-shivraj-800 mb-2">{title}</h3>
                  <p className="text-gray-600 text-sm">{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Card */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-shivraj-800 mb-4 text-center">Rate Card</h2>
            <p className="text-gray-600 text-center mb-8 max-w-3xl mx-auto">
              Transparent and flexible pricing for our manpower and housekeeping services.
            </p>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-shivraj-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-shivraj-50">
                    <TableHead className="text-shivraj-800 font-semibold">Service Type</TableHead>
                    <TableHead className="text-shivraj-800 font-semibold">Unit</TableHead>
                    <TableHead className="text-shivraj-800 font-semibold">Rate (INR)</TableHead>
                    <TableHead className="text-shivraj-800 font-semibold">Unit</TableHead>
                    <TableHead className="text-shivraj-800 font-semibold">Rate (INR)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rateCardLoading && dbRateCard.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Loading rates…</TableCell></TableRow>
                  ) : displayedRateCard.map((r) => (
                    <TableRow key={r.service}>
                      <TableCell className="font-medium">{r.service}</TableCell>
                      <TableCell>{r.unit8}</TableCell>
                      <TableCell>{r.rate8}</TableCell>
                      <TableCell>{r.unit12}</TableCell>
                      <TableCell>{r.rate12}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-xs text-gray-500 mt-4 max-w-3xl mx-auto text-center">
              Note: Rates are indicative and subject to change based on government wage notifications, client requirements and market conditions. Please contact us for a tailored quote. See our{" "}
              <Link to="/terms" className="text-shivraj-600 underline">Terms & Conditions</Link> for statutory obligations and service charges.
            </p>
          </div>

          {/* Industries Served */}
          <div className="mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-8 text-center">Industries We Serve</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {["Engineering", "Pharmaceuticals", "Chemicals", "Packaging", "Manufacturing", "Logistics"].map((i) => (
                <div key={i} className="bg-shivraj-50 p-4 rounded-lg text-center">
                  <p className="font-medium">{i}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-shivraj-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Need a Customized Quote?</h2>
          <p className="text-lg mb-8 text-shivraj-100 max-w-3xl mx-auto">
            Contact us today to discuss your specific requirements. Our team will work with you
            to develop a tailored manpower solution for your business.
          </p>
          <Link
            to="/contact"
            className="inline-block bg-white text-shivraj-800 px-8 py-3 rounded-lg font-medium hover:bg-shivraj-100 transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
