import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle, MapPin } from "lucide-react";
import Layout from "@/components/Layout";
import LocationMap from "@/components/contact/LocationMap";
import { Button } from "@/components/ui/button";

const Locations = () => {
  return (
    <Layout>
      <Helmet>
        <title>Service Areas in Vapi GIDC – Shivraj Enterprise</title>
        <meta
          name="description"
          content="Manpower & housekeeping coverage across Vapi GIDC Phases 1–4, surrounding villages and pin codes in Valsad, Gujarat."
        />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/#/locations" />
        <meta property="og:title" content="Service Areas in Vapi GIDC – Shivraj Enterprise" />
        <meta property="og:description" content="Manpower & housekeeping coverage across Vapi GIDC and nearby villages." />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Shivraj Enterprise",
            areaServed: [
              "Vapi GIDC", "Chala", "Balitha", "Chhiri", "Salvav", "Chharwada",
              "Daman", "Dadra and Nagar Haveli", "Valsad",
            ],
            address: {
              "@type": "PostalAddress",
              streetAddress: "Plot No. 228, A/303, Ved Vihar, Chharwada",
              addressLocality: "Vapi",
              addressRegion: "Gujarat",
              postalCode: "396191",
              addressCountry: "IN",
            },
          })}
        </script>
      </Helmet>

      <section className="bg-gradient-to-br from-shivraj-800 to-shivraj-900 text-white py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <MapPin size={32} />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Service Areas</h1>
          <p className="text-lg md:text-xl text-shivraj-100 max-w-3xl mx-auto">
            Reliable manpower & housekeeping across Vapi GIDC, surrounding villages and pin codes of Valsad District, Gujarat.
          </p>
        </div>
      </section>

      <section className="section bg-shivraj-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-shivraj-100">
              <h2 className="text-xl font-semibold text-shivraj-800 mb-4">Vapi GIDC Industrial Phases We Serve</h2>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Phase 1</strong> — GIDC Office Road area; chemicals & light engineering.</li>
                <li><strong>Phase 2</strong> — Imran Nagar / Chala Road; MSME and mixed industrial units.</li>
                <li><strong>Phase 3</strong> — Major chemical & pharmaceutical hub (Aarti Industries, Accra Pac, Dipak Engineering).</li>
                <li><strong>Phase 4</strong> — Large manufacturing units and varied industries.</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-shivraj-100">
              <h2 className="text-xl font-semibold text-shivraj-800 mb-4">Villages & Areas Covered Near Vapi</h2>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-gray-700">
                {["Ambheti","Balitha","Chala","Chandor","Chhiri","Karaya","Koparli","Morai","Mota Pondha","Namdha","Ozar","Pandor","Rata","Salvav","Vatar","Chanod","Chharwada","Dabhel","Dungra","Karvad","Chanvai"].map((v) => (
                  <div key={v} className="flex items-center"><CheckCircle size={14} className="text-shivraj-600 mr-2 flex-shrink-0" />{v}</div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-shivraj-100">
              <h2 className="text-xl font-semibold text-shivraj-800 mb-4">Pin Codes We Operate In</h2>
              <ul className="space-y-2 text-gray-700">
                <li><strong>396195</strong> — Chanod Colony / GIDC Area / Gunjan</li>
                <li><strong>396191</strong> — Vapi / Chhiri / Balitha</li>
                <li><strong>396030</strong> — Chharwada</li>
                <li><strong>396415</strong> — Dabhel</li>
                <li><strong>396193</strong> — Dungra / Karvad</li>
                <li><strong>396020</strong> — Chanvai</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <LocationMap />

      <section className="py-16 bg-shivraj-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Need manpower in your area?</h2>
          <p className="text-shivraj-100 mb-6 max-w-2xl mx-auto">
            Get a quote within 24 hours for any location across Vapi GIDC and surrounding districts.
          </p>
          <Button asChild size="lg" className="bg-white text-shivraj-800 hover:bg-shivraj-50">
            <Link to="/contact">Request a Quote</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Locations;
