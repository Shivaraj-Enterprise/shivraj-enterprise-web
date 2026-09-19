import CompanyProfileDownload from "@/components/CompanyProfileDownload";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CheckCircle, Download, MapPin, Phone, MessageCircle, ShieldCheck, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import FaqSection from "@/components/FaqSection";
import AuroraBackground from "@/components/three/AuroraBackground";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useRateCard } from "@/hooks/useRateCard";
import { SERVICE_AREAS, servicePages, type ServicePage } from "@/data/servicePages";

const SITE = "https://shivraj-enterprise.lovable.app";

const fallbackRates = [
  { service: "Supervisor", unit8: "Per month", rate8: "₹25,000", unit12: "—", rate12: "—" },
  { service: "Skilled (Operator) Labour", unit8: "Per 8 hrs", rate8: "₹600", unit12: "Per 12 hrs", rate12: "₹1,300" },
  { service: "Semi-Skilled Labour", unit8: "Per 8 hrs", rate8: "₹550", unit12: "Per 12 hrs", rate12: "₹1,020" },
  { service: "Unskilled Labour", unit8: "Per 8 hrs", rate8: "₹502", unit12: "Per 12 hrs", rate12: "₹800" },
  { service: "Housekeeping", unit8: "Per 8 hrs", rate8: "₹620", unit12: "—", rate12: "—" },
  { service: "Fitter Labour", unit8: "Per 8 hrs", rate8: "₹1,100", unit12: "—", rate12: "—" },
  { service: "Loading / Unloading", unit8: "Per Tonne", rate8: "₹200", unit12: "—", rate12: "—" },
];

const ServicePageShell = ({ page }: { page: ServicePage }) => {
  const { items, loading } = useRateCard();
  const source = items.length > 0 ? items : fallbackRates;
  const rates =
    page.rateFilter.length > 0
      ? source.filter((r) => page.rateFilter.includes(r.service))
      : source;

  const url = `${SITE}/services/${page.slug}`;
  const related = page.related
    .map((slug) => servicePages.find((p) => p.slug === slug))
    .filter(Boolean) as ServicePage[];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.navLabel,
    serviceType: page.navLabel,
    description: page.metaDescription,
    url,
    provider: {
      "@type": "Organization",
      name: "SHIVRAJ ENTERPRISE PVT. LTD.",
      url: SITE,
    },
    areaServed: SERVICE_AREAS.map((a) => ({ "@type": "Place", name: a })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE },
      { "@type": "ListItem", position: 2, name: "Services", item: `${SITE}/services` },
      { "@type": "ListItem", position: 3, name: page.navLabel, item: url },
    ],
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <Layout>
      <Helmet>
        <title>{page.metaTitle}</title>
        <meta name="description" content={page.metaDescription} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={page.metaTitle} />
        <meta property="og:description" content={page.metaDescription} />
        <meta property="og:url" content={url} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={page.metaTitle} />
        <meta name="twitter:description" content={page.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(serviceSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      </Helmet>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-900 text-white py-16 md:py-20">
        <AuroraBackground intensity="bold" />
        <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5">{page.h1}</h1>
          <p className="text-lg text-shivraj-100">{page.heroSubtitle}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild className="bg-white text-shivraj-800 hover:bg-shivraj-50">
              <Link to="/contact">Get a Quote</Link>
            </Button>
            <CompanyProfileDownload className="border-white/40 bg-white/10 text-white hover:bg-white/20" />
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <Breadcrumbs items={[{ label: "Services", to: "/services" }, { label: page.navLabel }]} />

          {/* Intro */}
          <div className="space-y-4 text-lg leading-relaxed text-gray-700">
            {page.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>

          {/* Body sections */}
          {page.sections.map((s) => (
            <div key={s.heading} className="mt-12">
              <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-4">{s.heading}</h2>
              {s.paragraphs?.map((p) => (
                <p key={p.slice(0, 40)} className="text-gray-700 leading-relaxed mb-4">{p}</p>
              ))}
              {s.bullets && (
                <ul className="space-y-2 mt-2">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <CheckCircle size={18} className="text-shivraj-600 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {/* Rate card */}
          <div className="mt-14">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-4">Indicative Rates</h2>
            <p className="text-gray-600 mb-6">
              Transparent per-shift, per-month and per-tonne rates. Rates are indicative and change with government
              wage notifications, headcount and site conditions.
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
                  {loading && items.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-6 text-muted-foreground">Loading rates…</TableCell></TableRow>
                  ) : rates.map((r) => (
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
            <p className="text-xs text-gray-500 mt-3">
              See the full <Link to="/services" className="text-shivraj-600 underline">rate card</Link> and our{" "}
              <Link to="/terms" className="text-shivraj-600 underline">Terms &amp; Conditions</Link> for statutory
              obligations and service charges.
            </p>
          </div>

          {/* Compliance */}
          <div className="mt-14 rounded-xl border border-shivraj-100 bg-shivraj-50 p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-10 h-10 rounded-full bg-white text-shivraj-700 flex items-center justify-center">
                <ShieldCheck size={20} />
              </span>
              <h2 className="text-2xl font-bold text-shivraj-800">Statutory Compliance We Handle</h2>
            </div>
            <ul className="space-y-2 mb-4">
              {[
                "EPF — registration, deduction and monthly deposit, with challans shared",
                "ESIC — contributions for eligible workers as per applicable thresholds",
                "Contract Labour (Regulation and Abolition) Act obligations of the contractor",
                "Minimum wages as per applicable Gujarat wage notifications",
                "GST at 18% shown separately on a compliant tax invoice",
                "TDS under Section 194C — 1% for individuals/HUF, 2% for companies and firms",
              ].map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <CheckCircle size={18} className="text-shivraj-600 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">{b}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-gray-600">
              Read the detail in our guides on{" "}
              <Link to="/blog/statutory-compliance-manpower-supply-guide" className="text-shivraj-600 underline">statutory compliance</Link>,{" "}
              <Link to="/blog/gst-tds-manpower-supply-guide" className="text-shivraj-600 underline">GST &amp; TDS</Link> and the{" "}
              <Link to="/blog/hr-compliance-checklist-vapi-gidc" className="text-shivraj-600 underline">HR compliance checklist</Link>.
            </p>
          </div>

          {/* Service areas */}
          <div className="mt-14">
            <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-4">Areas We Serve</h2>
            <p className="text-gray-600 mb-5">
              We deploy across Vapi GIDC and the surrounding industrial belt. See all{" "}
              <Link to="/locations" className="text-shivraj-600 underline">locations we cover</Link>.
            </p>
            <div className="flex flex-wrap gap-2">
              {SERVICE_AREAS.map((a) => (
                <span key={a} className="inline-flex items-center gap-1 rounded-full bg-shivraj-50 border border-shivraj-100 px-3 py-1.5 text-sm text-shivraj-800">
                  <MapPin size={14} className="text-shivraj-600" /> {a}
                </span>
              ))}
            </div>
          </div>

          {/* Related services */}
          {related.length > 0 && (
            <div className="mt-14">
              <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-5">Related Services</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/services/${r.slug}`}
                    className="group block rounded-lg border border-shivraj-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-shivraj-300 transition-all"
                  >
                    <h3 className="font-semibold text-shivraj-800 mb-2 group-hover:text-shivraj-600">{r.navLabel}</h3>
                    <p className="text-sm text-gray-600">{r.cardBlurb}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-sm text-shivraj-600">
                      Learn more <span className="sr-only">about {r.navLabel}</span><ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <FaqSection
        title={`${page.navLabel} — FAQs`}
        subtitle="Answers to the questions Vapi GIDC plants ask us most often."
        items={page.faqs}
      />

      {/* CTA */}
      <section className="py-16 bg-shivraj-700 text-white">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl font-bold mb-4">Need {page.navLabel} at Your Site?</h2>
          <p className="text-lg mb-8 text-shivraj-100">
            Share your role, headcount and shift pattern — we will confirm rates and availability, and mobilise
            screened workers, usually within 24 to 48 hours for standard roles.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact" className="inline-block bg-white text-shivraj-800 px-7 py-3 rounded-lg font-medium hover:bg-shivraj-100 transition-colors">
              Get a Quote
            </Link>
            <a href="tel:+919998498311" className="inline-flex items-center gap-2 border border-white/40 bg-white/10 px-7 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
              <Phone size={18} /> Call Us
            </a>
            <a href="https://wa.me/919998498311" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white/40 bg-white/10 px-7 py-3 rounded-lg font-medium hover:bg-white/20 transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicePageShell;
