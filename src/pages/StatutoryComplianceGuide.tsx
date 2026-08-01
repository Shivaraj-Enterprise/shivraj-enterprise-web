import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import RelatedPosts from "@/components/blog/RelatedPosts";
import StaticArticleShell from "@/components/blog/StaticArticleShell";
import { Callout, PullQuote, StatGrid, SectionDivider } from "@/components/blog/Callouts";
import FaqAccordion from "@/components/blog/FaqAccordion";
import ArticleImage from "@/components/blog/ArticleImage";

const url =
  "https://shivraj-enterprise.lovable.app/blog/statutory-compliance-manpower-supply-guide";
const title = "Statutory Compliance for Manpower Supply";
const description =
  "EPF, ESI, GST and labour law compliance for manpower supply in India — what to check before hiring a manpower agency or consultancy for your industrial plant.";
const publishedAt = "2026-08-01";

const faqs = [
  {
    q: "What statutory compliances must a manpower supply agency maintain?",
    a: "A compliant manpower agency in India must hold GST registration, EPF and ESIC employer codes, a Contract Labour (R&A) Act Labour Licence for 20+ workmen at a site, Professional Tax registration, and PAN/TAN. It must also maintain muster rolls, wages registers, overtime records and file Form XXIV half-yearly returns.",
  },
  {
    q: "Who is liable if a manpower consultancy fails to deposit PF or ESI?",
    a: "The principal employer. Under Section 21 of the EPF Act and the Contract Labour (R&A) Act 1970, the client company is vicariously liable for a contractor's PF and ESIC default, and can be issued recovery notices. Verify the contractor's monthly ECR and challans before releasing invoice payment.",
  },
  {
    q: "What are the EPF and ESI rates applicable to contract manpower in 2026?",
    a: "EPF: 12% employee and 12% employer on basic wages, with 8.33% diverted to EPS subject to the ₹15,000 wage ceiling, plus admin charges. ESI: 0.75% employee and 3.25% employer, applicable where gross monthly wages are up to ₹21,000 (₹25,000 for persons with disability).",
  },
  {
    q: "What GST rate applies to manpower supply services?",
    a: "Manpower supply is taxed at 18% GST under SAC 998513/998519 on forward charge for supplies to private-sector clients. Reverse charge applies only for security services supplied by a non-body-corporate to a registered person. TDS under Section 194C applies at 1% (individual/HUF) or 2% (others) on the value excluding GST.",
  },
  {
    q: "What documents should I collect from a manpower agency every month?",
    a: "A monthly compliance pack: PF ECR and challan, ESIC contribution challan, wages register and muster roll extract, bank transfer proof of wages, overtime register, and a GST-compliant invoice. Annually collect the Labour Licence renewal, Form V, Form XXIV/XXV returns and insurance cover notes.",
  },
  {
    q: "Is a Labour Licence always required for manpower supply?",
    a: "Under the Contract Labour (R&A) Act, a contractor deploying 20 or more workmen at a single establishment needs a Labour Licence from the state Labour Commissioner. The principal employer separately needs a Registration Certificate (Form I) covering the maximum contract workmen engaged on any day.",
  },
];

const StatutoryComplianceGuide = () => {
  return (
    <Layout>
      <Helmet>
        <title>{title} – Shivraj Enterprise</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: "Statutory Compliance for Manpower Supply in India: 2026 Guide",
            description,
            datePublished: publishedAt,
            dateModified: publishedAt,
            author: { "@type": "Organization", name: "Shivraj Enterprise" },
            publisher: { "@type": "Organization", name: "Shivraj Enterprise" },
            mainEntityOfPage: url,
            keywords:
              "statutory compliance manpower supply, manpower agency, manpower consultancy, EPF ESI compliance, contract labour act",
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://shivraj-enterprise.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://shivraj-enterprise.lovable.app/blog" },
              { "@type": "ListItem", position: 3, name: "Statutory Compliance for Manpower Supply", item: url },
            ],
          })}
        </script>
      </Helmet>

      <StaticArticleShell
        title="Statutory Compliance for Manpower Supply in India: The 2026 Buyer's Guide"
        excerpt="EPF, ESI, GST and labour law obligations that separate a compliant manpower agency from a risky one — with a month-by-month verification routine for industrial plants in Vapi GIDC and across Gujarat."
        category="Compliance"
        tags={["Compliance", "Manpower Agency", "EPF & ESI"]}
        publishedLabel="August 1, 2026"
        readMinutes={12}
        url={url}
        breadcrumbLabel="Statutory Compliance for Manpower Supply"
        slug="statutory-compliance-manpower-supply-guide"
        prev={{
          slug: "hr-compliance-checklist-vapi-gidc",
          title: "2026 HR Compliance Checklist for Industrial Plants in Vapi GIDC",
        }}
        next={{
          slug: "gst-tds-manpower-supply-guide",
          title: "GST & TDS on Manpower Supply Services in India – A Compliance Guide",
        }}
      >
        <>
          <Callout variant="key" title="Key Takeaways">
            <ul className="list-disc pl-5 space-y-1.5 marker:text-white/60">
              <li>Statutory compliance — not rate — is the real differentiator when choosing a <strong>manpower agency</strong>.</li>
              <li>The <strong>principal employer</strong> stays liable for a contractor's EPF and ESI defaults.</li>
              <li>Five registrations are non-negotiable: <strong>GST, EPF, ESIC, Labour Licence, Professional Tax</strong>.</li>
              <li>Run a <strong>monthly challan verification</strong> before releasing any manpower supply invoice.</li>
            </ul>
          </Callout>

          <h2>1. Why compliance decides your manpower partner</h2>
          <p>
            When engineering, chemical, pharma and packaging units search for a <strong>manpower consultancy</strong>,
            the shortlist usually starts with headcount and per-shift rate. It should start with statutory compliance.
            Under Indian labour law, outsourcing the workforce does not outsource the liability: if your contractor
            skips a PF challan or lets a Labour Licence lapse, the recovery notice, the inspection and the reputational
            damage land on your plant.
          </p>
          <p>
            This guide sets out the complete statutory compliance stack for manpower supply in India — EPF, ESI, GST,
            the Contract Labour Act and allied wage legislation — and turns it into a verification routine you can run
            every month. It complements our{" "}
            <Link to="/blog/hr-compliance-checklist-vapi-gidc">HR compliance checklist for Vapi GIDC plants</Link> and the{" "}
            <Link to="/blog/gst-tds-manpower-supply-guide">GST &amp; TDS guide for manpower supply</Link>.
          </p>

          <StatGrid
            items={[
              { value: "5", label: "Mandatory registrations", hint: "GST, EPF, ESIC, Labour Licence, Professional Tax" },
              { value: "15th", label: "PF & ESI deposit deadline", hint: "For the preceding wage month" },
              { value: "18%", label: "GST on manpower supply", hint: "Forward charge, SAC 998513 / 998519" },
            ]}
          />

          <h2>2. EPF compliance for contract manpower</h2>
          <p>
            The Employees' Provident Funds &amp; Miscellaneous Provisions Act 1952 applies to establishments with 20 or
            more employees, and contract workmen count towards that headcount. A genuine manpower agency holds its own
            EPF establishment code and enrols every deployed workman under a UAN.
          </p>
          <ul>
            <li>Employee contribution <strong>12%</strong> of basic + DA; employer contribution <strong>12%</strong> (8.33% to EPS up to the ₹15,000 ceiling).</li>
            <li>Monthly <strong>ECR upload and challan payment by the 15th</strong> of the following month.</li>
            <li>UAN generation and KYC seeding within 30 days of joining; no re-use of another worker's UAN.</li>
            <li>PF deducted on the wages actually paid — splitting wages into non-PF allowances to reduce cost is a common and audit-prone shortcut.</li>
            <li>Principal employer must retain contractor <strong>ECR + challan copies</strong> as evidence under Section 21.</li>
          </ul>

          <h2>3. ESI compliance and worker protection</h2>
          <p>
            The Employees' State Insurance Act 1948 covers workmen drawing gross wages up to <strong>₹21,000</strong> per
            month (₹25,000 for persons with disability) in notified areas, which includes Vapi and the wider Valsad
            industrial belt.
          </p>
          <ul>
            <li>Employer contribution <strong>3.25%</strong>, employee contribution <strong>0.75%</strong> of gross wages.</li>
            <li>Contribution deposited by the 15th; half-yearly returns by <strong>11 May and 11 November</strong>.</li>
            <li>Insurance number and Pehchan card issued to each workman before deployment.</li>
            <li>Accident Report (Form 12) filed within <strong>24 hours</strong> of any workplace injury.</li>
            <li>For hazardous chemical and pharma processes, ESI coverage sits alongside — not instead of — Employees' Compensation cover.</li>
          </ul>

          <ArticleImage
            slug="statutory-compliance-manpower-supply-guide"
            sectionKey="figure-1-compliance-pillars"
            alt="Illustration of the four statutory compliance pillars for manpower supply in India — EPF, ESI, GST and labour law"
            prompt="Clean modern editorial illustration for a business blog, four labelled pillars supporting a factory silhouette, small icons of a shield, rupee coin, hard hat and document, soft blue and white corporate palette, flat vector style, no readable text"
            label="Figure 1"
            caption="Four pillars of statutory compliance every manpower supply partner must stand on."
          />

          <SectionDivider />

          <h2>4. Contract Labour Act and labour licensing</h2>
          <p>
            The Contract Labour (Regulation &amp; Abolition) Act 1970 is where most manpower supply disputes originate.
            It creates parallel obligations for the contractor and the principal employer.
          </p>
          <table>
            <thead>
              <tr>
                <th>Obligation</th>
                <th>Manpower agency</th>
                <th>Principal employer</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Registration / Licence</td><td>Labour Licence for 20+ workmen</td><td>Registration Certificate (Form I)</td></tr>
              <tr><td>Authorisation</td><td>Receives Form V</td><td>Issues Form V</td></tr>
              <tr><td>Wage disbursement</td><td>Pays by bank transfer before the 7th</td><td>Witnesses / verifies disbursement</td></tr>
              <tr><td>Registers</td><td>Muster roll, wages, overtime, deductions</td><td>Register of contractors</td></tr>
              <tr><td>Returns</td><td>Form XXIV (half-yearly)</td><td>Form XXV (annual)</td></tr>
              <tr><td>Amenities</td><td>Provides PPE, ensures attendance</td><td>Canteen, restrooms, drinking water, first aid</td></tr>
            </tbody>
          </table>

          <h2>5. Wages, bonus and gratuity obligations</h2>
          <ul>
            <li><strong>Minimum Wages Act</strong> — Gujarat notification by zone and skill category, revised half-yearly; contract rates must absorb every revision.</li>
            <li><strong>Payment of Wages Act</strong> — wages before the 7th of the following month, paid into the workman's bank account.</li>
            <li><strong>Payment of Bonus Act</strong> — 8.33% minimum to 20% maximum on wages up to ₹21,000.</li>
            <li><strong>Payment of Gratuity Act</strong> — provisioned at roughly 4.81% of basic, payable after five years of continuous service.</li>
            <li><strong>Equal Remuneration</strong> and <strong>POSH</strong> obligations extend to contract workmen deployed at your site.</li>
          </ul>

          <h2>6. GST and TDS on manpower supply invoices</h2>
          <p>
            Manpower supply attracts <strong>18% GST</strong> under SAC 998513 (manpower recruitment / supply) or 998519,
            charged on forward charge for private-sector clients. Reverse charge is limited to security services supplied
            by a non-body-corporate. On the payment side, <strong>TDS under Section 194C</strong> applies at 1% for
            individual/HUF contractors and 2% for companies, computed on the invoice value excluding GST.
          </p>
          <Callout variant="tip" title="Invoice hygiene">
            Insist on a GST invoice that separately shows wages, statutory contributions and the service charge. It makes
            ITC claims clean, supports 194C computation, and gives you documentary proof of PF/ESI loading during an audit.
          </Callout>

          <PullQuote cite="Procurement Head, Vapi engineering unit">
            We stopped comparing manpower agencies on per-head rate. We compare them on whether the monthly challan pack
            arrives without being chased.
          </PullQuote>

          <h2>7. Your monthly compliance verification routine</h2>
          <table>
            <thead>
              <tr>
                <th>By this date</th>
                <th>Verify</th>
                <th>Evidence</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>7th</td><td>Wages disbursed to workmen</td><td>Bank transfer statement</td></tr>
              <tr><td>10th</td><td>Professional Tax deposited</td><td>Gujarat PT challan</td></tr>
              <tr><td>15th</td><td>EPF ECR uploaded &amp; paid</td><td>ECR + PF challan</td></tr>
              <tr><td>15th</td><td>ESI contribution deposited</td><td>ESIC challan</td></tr>
              <tr><td>20th</td><td>GST return filed on your invoice</td><td>GSTR-1 / 3B acknowledgement</td></tr>
              <tr><td>25th</td><td>Registers reconciled with headcount</td><td>Muster roll &amp; wages register</td></tr>
            </tbody>
          </table>

          <h2>8. Due-diligence checklist before you sign</h2>
          <ul>
            <li>Certificate of Incorporation, PAN and TAN</li>
            <li>GST registration certificate (active, forward charge)</li>
            <li>EPF and ESIC employer codes with last three months' challans</li>
            <li>Labour Licence for the specific site and workmen count</li>
            <li>Professional Tax registration (Gujarat)</li>
            <li>Employees' Compensation / group insurance cover notes</li>
            <li>Sample muster roll, wages register and Form XXIV return</li>
            <li>Written indemnity for statutory default in the service agreement</li>
          </ul>

          <Callout variant="warning" title="Red flags">
            Cash wage payment, no EPF/ESIC code, proprietorship without GST, refusal to share monthly challans, or a
            per-head rate materially below minimum wage + statutory loading. Each is a direct route to a
            principal-employer recovery notice.
          </Callout>

          <SectionDivider />

          <FaqAccordion
            id="statutory-compliance-faq"
            title="Frequently asked questions"
            subtitle="Practical answers on EPF, ESI, GST and labour licensing for outsourced manpower."
            items={faqs.map((f) => ({ q: f.q, a: f.a }))}
          />

          <div className="not-prose mt-12 rounded-2xl border border-shivraj-100 bg-shivraj-50/60 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-shivraj-800 mb-3">
              Need a fully compliant manpower supply partner in Vapi GIDC?
            </h2>
            <p className="text-gray-700 mb-5">
              Shivraj Enterprise Pvt. Ltd. supplies skilled, semi-skilled and unskilled manpower across Vapi GIDC and
              Valsad district with GST, EPF, ESIC and Labour Licence compliance handled end to end — and a monthly
              compliance pack delivered with every invoice.
            </p>
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/contact" className="inline-flex items-center gap-2">
                  Request a Compliance Pack <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="tel:+919998498311" className="inline-flex items-center gap-2">
                  <Phone size={18} /> +91 99984 98311
                </a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a
                  href="https://wa.me/919998498311"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2"
                >
                  <MessageSquare size={18} /> WhatsApp
                </a>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              See our <Link to="/services">manpower outsourcing services</Link> and rate card for deployment timelines.
            </p>
          </div>

          <p className="text-xs text-muted-foreground mt-8">
            Disclaimer: Rates, wage ceilings and forms are indicative as of August 2026 and change with central and
            Gujarat state notifications. This article is a general guide, not legal advice — consult your labour law
            advisor for site-specific positions.
          </p>
        </>
      </StaticArticleShell>

      <RelatedPosts
        currentSlug="statutory-compliance-manpower-supply-guide"
        currentTagSlugs={["compliance", "manpower-agency", "epf-esi"]}
      />
    </Layout>
  );
};

export default StatutoryComplianceGuide;
