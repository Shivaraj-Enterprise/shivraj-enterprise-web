import CompanyProfileDownload from "@/components/CompanyProfileDownload";
import { ArrowRight, Users, Sparkles, PackageCheck, CheckCircle, Award, Shield, GraduationCap, Download, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import TextType from "@/components/TextType";
import PostCard from "@/components/blog/PostCard";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import logo from "@/assets/logo.webp";
import { useCompanyProfileUrl } from "@/hooks/useCompanyProfileUrl";
import auroriumLogo from "@/assets/clients/aurorium.png.asset.json";
import vertellusLogo from "@/assets/clients/vertellus.jpg.asset.json";
import microOrgoLogo from "@/assets/clients/micro-orgo-chem.jpg.asset.json";
import hexacellLogo from "@/assets/clients/hexacell.jpg.asset.json";
import vpiLogo from "@/assets/clients/vpi.jpg.asset.json";
import AuroraBackground from "@/components/three/AuroraBackground";
import BlurText from "@/components/reactbits/BlurText";
import TiltedCard from "@/components/reactbits/TiltedCard";
import GradientText from "@/components/reactbits/GradientText";
import Marquee from "@/components/reactbits/Marquee";
import { Magnetic, Reveal, TextColourSweep } from "@/components/motion";
import { MagicCard } from "@/components/ui/magic-card";
import { BorderBeam } from "@/components/ui/border-beam";

const Index = () => {
  const profileUrl = useCompanyProfileUrl();
  const { posts: latestPosts } = useBlogPosts({ limit: 3 });
  return (
    <Layout>
      <Helmet>
        <title>Shivraj Enterprise – Manpower & Housekeeping in Vapi GIDC</title>
        <meta name="description" content="Skilled, semi-skilled & unskilled manpower and housekeeping services across Vapi GIDC, Gujarat. Serving engineering, pharma, chemical & packaging industries." />
        <link rel="preload" as="image" href={logo} fetchPriority="high" />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/" />
        <meta property="og:title" content="Shivraj Enterprise – Manpower & Housekeeping in Vapi GIDC" />
        <meta property="og:description" content="Skilled, semi-skilled & unskilled manpower and housekeeping services across Vapi GIDC, Gujarat." />
        <meta property="og:url" content="https://shivraj-enterprise.lovable.app/" />
      </Helmet>
      <div className="homepage-motion">
      {/* Hero Section */}
      <section className="home-hero relative overflow-hidden bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-900 text-white">
        <AuroraBackground intensity="bold" />
        <div className="container relative z-10 mx-auto px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="home-logo bg-card rounded-full p-4 shadow-lg">
                <img src={logo} alt="Shivraj Enterprise logo" width={80} height={80} loading="eager" fetchPriority="high" decoding="async" className="h-16 w-16 md:h-20 md:w-20 object-contain" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" aria-label="Trusted Manpower & Housekeeping Services in Vapi GIDC, Gujarat">
              <BlurText as="span" text="Trusted Manpower & Housekeeping Services in" delay={0.1} />
              <BlurText
                as="span"
                text="Vapi GIDC, Gujarat"
                delay={0.55}
                className="[&>span]:bg-gradient-to-r [&>span]:from-shivraj-200 [&>span]:via-white [&>span]:to-shivraj-300 [&>span]:bg-clip-text [&>span]:text-transparent [&>span]:bg-[length:200%_auto] [&>span]:animate-[gradientShift_6s_linear_infinite]"
              />
            </h1>
            <p className="text-xl mb-8 text-shivraj-100">
              <TextType
                as="span"
                text="Over a decade of expertise supplying skilled, semi-skilled and unskilled labour to Engineering, Pharmaceutical, Chemical and Packaging industries across Vapi GIDC, Chala, Balitha, Chhiri, Salvav, Chharwada and surrounding villages of Valsad District, Gujarat."
                typingSpeed={30}
                pauseDuration={2500}
                showCursor={false}
                loop={false}
              />
            </p>
            <div className="home-actions flex flex-wrap justify-center gap-4">
              <Magnetic strength={0.12}>
              <Button asChild size="lg" className="bg-white text-shivraj-800 hover:bg-shivraj-50">
                <Link to="/services">Our Services</Link>
              </Button>
              </Magnetic>
              <Magnetic strength={0.12}>
              <Button asChild size="lg" variant="outline" className="border-white text-shivraj-900 font-medium hover:bg-white/10 hover:text-white">
                <Link to="/contact">Contact Us</Link>
              </Button>
              </Magnetic>
              <CompanyProfileDownload size="lg" className="border-white text-shivraj-900 font-medium hover:bg-white/10 hover:text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className="bg-white border-b border-shivraj-100">
        <div className="container mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "10+", label: "Years Experience" },
            { value: "1,500+", label: "Workers Deployed" },
            { value: "50+", label: "Industrial Clients" },
            { value: "24/7", label: "Support Availability" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="home-stat">
                <p className="text-3xl md:text-4xl font-bold">
                  <GradientText>{s.value}</GradientText>
                </p>
                <p className="text-sm md:text-base text-gray-600 mt-1">{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* About Summary Section */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="section-title"><TextColourSweep text="About Shivraj Enterprise" /></h2>
            <p className="section-subtitle">
              A reliable manpower & housekeeping company with over a decade of industry experience
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <Reveal>
              <p className="text-gray-600 mb-6">
                Shivraj Enterprise is a trusted name in manpower supply and housekeeping services, with over 10 years of industry experience. We provide skilled, semi-skilled, and unskilled labour to industries such as Engineering, Pharmaceuticals, Chemicals, and Packaging.
              </p>
              <p className="text-gray-600 mb-6">
                Known for reliability and tailored solutions, we ensure operational efficiency for both short-term projects and long-term staffing needs — making us your dependable partner in workforce outsourcing.
              </p>
              <Button asChild className="bg-shivraj-600 hover:bg-shivraj-700">
                <Link to="/about" className="flex items-center">
                  Read our company story <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </Reveal>
            <Reveal delay={0.15} className="home-lift bg-shivraj-50 p-6 rounded-lg border border-shivraj-100">
              <h3 className="text-2xl font-semibold text-shivraj-800 mb-4">Our Presence</h3>
              <p className="text-gray-600 mb-6">
                We provide services across many cities of Gujarat, mainly in:
              </p>
              <ul className="space-y-2">
                {["GIDC Vapi", "Daman", "Dadra and Nagar Haveli", "Daman and Diu"].map((area) => (
                  <li key={area} className="flex items-center">
                    <CheckCircle size={18} className="text-shivraj-600 mr-2" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="section bg-shivraj-50 relative overflow-hidden">
        <AuroraBackground intensity="subtle" className="opacity-40" />
        <div className="container relative mx-auto">
          <Reveal className="text-center mb-12">
            <h2 className="section-title"><TextColourSweep text="Our Core Services" /></h2>
            <p className="section-subtitle">
              A comprehensive suite of manpower, housekeeping and auxiliary services
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1200px]">
            {[
              { icon: Users, title: "Manpower Outsourcing", desc: "Flexible access to skilled, semi-skilled and unskilled labour with strict vetting for productivity and reliability." },
              { icon: Sparkles, title: "Housekeeping Solutions", desc: "Industrial, commercial and event housekeeping that keeps your workspace clean, safe and welcoming." },
              { icon: PackageCheck, title: "Auxiliary Services", desc: "Loading & unloading, material handling, dispatch and quality & packaging inspectors." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <Reveal key={title} delay={i * 0.1}>
                <TiltedCard className="bg-white rounded-xl shadow-md p-6 hover:shadow-2xl transition-shadow border border-shivraj-100/50 h-full">
                  <div className="home-service-icon w-12 h-12 rounded-full bg-gradient-to-br from-shivraj-500 to-shivraj-700 text-white flex items-center justify-center mb-4 shadow-lg shadow-shivraj-500/30">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-shivraj-800">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </TiltedCard>
              </Reveal>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild className="bg-shivraj-600 hover:bg-shivraj-700">
              <Link to="/services">View All Services & Rates</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title"><TextColourSweep text="Why Choose Shivraj Enterprise?" /></h2>
            <p className="section-subtitle">What sets us apart as a workforce partner</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: Award, title: "Proven Experience", desc: "10+ years serving leading industries." },
              { icon: CheckCircle, title: "Quality & Reliability", desc: "Trained workforce with strong attendance." },
              { icon: Shield, title: "Full Compliance", desc: "PF, ESIC, GST and labour-law adherence." },
              { icon: Users, title: "Skilled & Flexible", desc: "Tailored short or long-term staffing." },
              { icon: GraduationCap, title: "Continuous Training", desc: "Safety and operational best practices." },
            ].map(({ icon: Icon, title, desc }) => (
              <Reveal key={title} className="h-full">
                <MagicCard className="h-full rounded-xl" gradientColor="hsl(210 100% 92%)" gradientFrom="hsl(210 90% 55%)" gradientTo="hsl(200 90% 70%)">
                  <div className="text-center p-5 transition-transform duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 mx-auto rounded-full bg-shivraj-100 text-shivraj-700 flex items-center justify-center mb-3">
                      <Icon size={26} />
                    </div>
                    <h3 className="font-semibold text-shivraj-800 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{desc}</p>
                  </div>
                </MagicCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-shivraj-50">
        <div className="container mx-auto">
          <Reveal className="text-center mb-8">
            <h2 className="section-title"><TextColourSweep text="What Our Clients Say" /></h2>
            <p className="section-subtitle">Trusted by leading companies across industries</p>
          </Reveal>

          {/* Client logo marquee */}
          <Marquee speed={28} className="mb-10 py-4 [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
            {[
              { logo: auroriumLogo, name: "Aurorium India Pvt. Ltd." },
              { logo: vertellusLogo, name: "Vertellus Specialty Pvt. Ltd." },
              { logo: microOrgoLogo, name: "Micro Orgo Chem Pvt. Ltd." },
              { logo: hexacellLogo, name: "Hexacell Packaging Pvt. Ltd." },
              { logo: vpiLogo, name: "Vapi Products Industries Pvt. Ltd." },
            ].map(({ logo: l, name }, i) => (
              <img
                key={i}
                src={l.url}
                alt={`${name} logo`}
                loading="lazy"
                width={120}
                height={64}
                decoding="async"
                className="h-14 md:h-16 w-auto object-contain grayscale hover:grayscale-0 transition-all opacity-80 hover:opacity-100"
              />
            ))}
          </Marquee>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { quote: "Partnering with Shivraj Enterprise has transformed our productivity. Their skilled labour solutions seamlessly integrated with our operations, and the professionalism of their staff has significantly elevated our output.", name: "Ms. Dhara Dangarwala", role: "HR, Aurorium India Pvt. Ltd.", logo: auroriumLogo.url },
              { quote: "We rely on SHIVRAJ for our housekeeping services, and they never disappoint. Their attention to hygiene is unparalleled, ensuring that our facilities meet the highest health standards.", name: "Mr. Vivek Patel", role: "HR, Vertellus Specialty Pvt. Ltd.", logo: vertellusLogo.url },
              { quote: "The flexibility SHIVRAJ provides in manpower supply is exceptional. Their ability to adjust workforce levels during peak periods has been invaluable, boosting our operational efficiency.", name: "Mrs. Nimish Sawant", role: "HR, Micro Orgo Chem Pvt. Ltd.", logo: microOrgoLogo.url },
              { quote: "SHIVRAJ's customer service is top-notch. The accessibility and responsiveness of their team have made our collaboration effortless and successful.", name: "Ms. Anjali Mehta", role: "Supply Chain Director, Hexacell Packaging Pvt. Ltd.", logo: hexacellLogo.url },
              { quote: "Shivraj Enterprise has been a reliable manpower partner for our operations. Their team is professional, punctual and consistently delivers quality workforce that meets our production needs.", name: "Mr. Dhruv Parmar", role: "HR Leader, Vapi Products Industries Pvt. Ltd.", logo: vpiLogo.url },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="home-lift bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow border border-shivraj-100/60 h-full">
                  <div className="flex items-start gap-4 mb-3">
                    <img src={t.logo} alt={`${t.role} logo`} loading="lazy" width={64} height={64} decoding="async" className="w-16 h-16 rounded-full object-contain bg-white border border-shivraj-100 p-1 flex-shrink-0" />
                    <Quote size={24} className="text-shivraj-300 mt-2" />
                  </div>
                  <p className="text-gray-700 italic mb-4">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-shivraj-800">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Service Areas - Local SEO */}
      <section className="section bg-shivraj-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="section-title"><TextColourSweep text="Service Areas Across Vapi GIDC & Surrounding Villages" /></h2>
            <p className="section-subtitle">
              Vapi GIDC is one of Asia's largest industrial hubs — covering over 1,140 hectares across four phases in Valsad District, Gujarat. With 1,500+ units in chemicals, pharmaceuticals, engineering and packaging, we proudly serve clients across the entire estate and nearby villages.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal className="home-lift bg-card rounded-lg p-6 shadow-sm border border-shivraj-100">
              <h3 className="text-xl font-semibold text-shivraj-800 mb-4">Vapi GIDC Industrial Phases We Serve</h3>
              <ul className="space-y-3 text-gray-700">
                <li><strong>Phase 1</strong> — GIDC Office Road area; chemicals & light engineering.</li>
                <li><strong>Phase 2</strong> — Imran Nagar / Chala Road; MSME and mixed industrial units.</li>
                <li><strong>Phase 3</strong> — Major chemical & pharmaceutical hub (Aarti Industries, Accra Pac, Dipak Engineering).</li>
                <li><strong>Phase 4</strong> — Large manufacturing units and varied industries.</li>
              </ul>
            </Reveal>

            <Reveal delay={0.12} className="home-lift bg-card rounded-lg p-6 shadow-sm border border-shivraj-100">
              <h3 className="text-xl font-semibold text-shivraj-800 mb-4">Villages & Areas Covered Near Vapi</h3>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-gray-700">
                {["Ambheti","Balitha","Chala","Chandor","Chhiri","Karaya","Koparli","Morai","Mota Pondha","Namdha","Ozar","Pandor","Rata","Salvav","Vatar","Chanod","Chharwada","Dabhel","Dungra","Karvad","Chanvai"].map((v) => (
                  <div key={v} className="flex items-center"><CheckCircle size={14} className="text-shivraj-600 mr-2 flex-shrink-0" />{v}</div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.24} className="home-lift bg-card rounded-lg p-6 shadow-sm border border-shivraj-100">
              <h3 className="text-xl font-semibold text-shivraj-800 mb-4">Pin Codes We Operate In</h3>
              <ul className="space-y-2 text-gray-700">
                <li><strong>396195</strong> — Chanod Colony / GIDC Area / Gunjan</li>
                <li><strong>396191</strong> — Vapi / Chhiri / Balitha</li>
                <li><strong>396030</strong> — Chharwada</li>
                <li><strong>396415</strong> — Dabhel</li>
                <li><strong>396193</strong> — Dungra / Karvad</li>
                <li><strong>396020</strong> — Chanvai</li>
              </ul>
            </Reveal>
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline" className="border-shivraj-600 text-shivraj-700 hover:bg-shivraj-100">
              <Link to="/locations" className="flex items-center">
                View full coverage map <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News */}
      {latestPosts.length > 0 && (
        <section className="section bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-title"><TextColourSweep text="Latest News & Updates" /></h2>
              <p className="section-subtitle">Recent posts from our team</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {latestPosts.map((p, i) => <Reveal key={p.id} delay={i * 0.12} className="home-lift h-full"><PostCard post={p} /></Reveal>)}
            </div>
            <div className="text-center mt-10">
              <Button asChild className="bg-shivraj-600 hover:bg-shivraj-700">
                <Link to="/blog" className="flex items-center">
                  View all posts <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      )}


      {/* Call to Action */}
      <section className="home-cta py-16 bg-shivraj-800 text-white">
        <div className="container mx-auto px-4 text-center relative overflow-hidden rounded-2xl border border-white/10 py-10">
          <BorderBeam size={120} duration={8} colorFrom="hsl(200 100% 75%)" colorTo="hsl(0 0% 100%)" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Work With Us?</h2>
          <p className="text-xl mb-8 text-shivraj-100 max-w-3xl mx-auto">
            Whether you need short-term staffing or long-term workforce management,
            we're here to provide reliable solutions for your business.
          </p>
<Magnetic>
          <Button asChild size="lg" className="bg-white text-shivraj-800 hover:bg-shivraj-50">
            <Link to="/contact">Contact Us Today</Link>
          </Button>
          </Magnetic>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default Index;
