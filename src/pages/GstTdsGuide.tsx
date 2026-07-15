import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";
import RelatedPosts from "@/components/blog/RelatedPosts";
import StaticArticleShell from "@/components/blog/StaticArticleShell";
import { Callout, PullQuote, StatGrid, SectionDivider } from "@/components/blog/Callouts";

const url = "https://shivraj-enterprise.lovable.app/#/blog/gst-tds-manpower-supply-guide";
const title = "GST & TDS on Manpower Supply Services in India: 2026 Compliance Guide";
const description =
  "A practical guide to GST (RCM vs Forward Charge) and TDS Section 194C on manpower supply services in India for procurement and HR managers in engineering, pharma and chemical sectors.";

const GstTdsGuide = () => {
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
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            datePublished: "2026-07-03",
            author: { "@type": "Organization", name: "Shivraj Enterprise" },
            publisher: { "@type": "Organization", name: "Shivraj Enterprise" },
            mainEntityOfPage: url,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "What is the GST rate on manpower supply services in India?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Manpower supply and labour supply services (SAC 998519) attract GST at 18% under Forward Charge. Pure labour services to government bodies for certain public functions may be exempt under Notification 12/2017.",
                },
              },
              {
                "@type": "Question",
                name: "When does Reverse Charge Mechanism (RCM) apply to manpower supply?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "RCM applies when a non-body-corporate supplier (proprietor/partnership) provides security services to a registered body corporate. Ordinary manpower supply from a registered private limited company like Shivraj Enterprise Pvt. Ltd. is billed under Forward Charge at 18% GST.",
                },
              },
              {
                "@type": "Question",
                name: "Which TDS section applies to manpower supply contracts?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "TDS is deducted under Section 194C of the Income Tax Act at 1% for individual/HUF contractors and 2% for companies and firms, on the invoice value excluding GST (if GST is shown separately).",
                },
              },
              {
                "@type": "Question",
                name: "Is TDS deducted on the GST portion of the invoice?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "No. As per CBDT Circular 23/2017, when GST is indicated separately on the invoice, TDS under Section 194C is deducted only on the taxable value, not on the GST component.",
                },
              },
            ],
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://shivraj-enterprise.lovable.app/" },
              { "@type": "ListItem", position: 2, name: "Blog", item: "https://shivraj-enterprise.lovable.app/#/blog" },
              { "@type": "ListItem", position: 3, name: "GST & TDS on Manpower Supply", item: url },
            ],
          })}
        </script>
      </Helmet>

      <StaticArticleShell
        title="GST & TDS on Manpower Supply Services in India: 2026 Compliance Guide"
        excerpt="Procurement and HR managers in Vapi GIDC's engineering, pharma, chemical and packaging plants routinely outsource shop-floor and housekeeping headcount. This guide explains how GST and TDS work on those manpower supply contracts so your compliance stays clean."
        category="Compliance"
        tags={["Compliance", "GST", "TDS"]}
        publishedLabel="July 3, 2026"
        readMinutes={9}
        url={url}
        breadcrumbLabel="GST & TDS on Manpower Supply"
        slug="gst-tds-manpower-supply-guide"
        prev={{
          slug: "manpower-outsourcing-vs-in-house-hiring",
          title: "Manpower Outsourcing vs In-House Hiring in Vapi GIDC: A 2026 Cost-Benefit Guide",
        }}
      >
        <>
            <Callout variant="key" title="Key Takeaways">
              <ul className="list-disc pl-5 space-y-1.5 marker:text-white/60">
                <li>Manpower supply is billed at <strong>18% GST under Forward Charge</strong> (SAC 998519) — full ITC available.</li>
                <li><strong>RCM does NOT apply</strong> to regular manpower supply from a private limited contractor; it applies only to security services from non-body-corporates.</li>
                <li><strong>TDS under Section 194C</strong>: 1% (individual/HUF) or 2% (companies), on the taxable value only — never on the GST amount.</li>
                <li>Pay within <strong>180 days</strong> to retain Input Tax Credit under Section 16.</li>
              </ul>
            </Callout>

            <h2>1. What counts as "manpower supply services"?</h2>
            <p>
              Under GST, manpower supply, labour supply and staff-augmentation contracts fall under SAC
              <strong> 998519 – Other employment &amp; labour supply services n.e.c.</strong> This covers skilled,
              semi-skilled and unskilled workmen deployed at the client site where the client controls day-to-day
              work but the workers remain on the contractor's payroll (ESIC, PF, wages, statutory compliance).
            </p>

            <h2>2. GST on manpower supply: Forward Charge is the default</h2>
            <p>
              Manpower supply services are taxable at <strong>18% GST</strong> under Forward Charge. A registered
              contractor (body corporate) raises a tax invoice charging CGST + SGST or IGST at 18% on the taxable
              value (wages + service charge + statutory contributions billed).
            </p>
            <p>
              The client takes full <strong>Input Tax Credit (ITC)</strong> of that GST, subject to Section 16 —
              invoice on GSTR-2B, payment within 180 days, and use in the course of business.
            </p>

            <StatGrid
              items={[
                { value: "18%", label: "GST rate", hint: "Forward Charge on SAC 998519 taxable value" },
                { value: "1–2%", label: "TDS u/s 194C", hint: "On taxable value only — never on GST amount" },
                { value: "180 days", label: "ITC retention window", hint: "Pay contractor within this to keep Input Tax Credit" },
              ]}
            />

            <h2>3. When does RCM apply?</h2>
            <p>
              Reverse Charge Mechanism (RCM) under Notification 13/2017-CT (Rate) is <em>limited</em> for manpower:
            </p>
            <ul>
              <li>
                <strong>Security services</strong> supplied by any person <em>other than a body corporate</em> to a
                registered body corporate — recipient pays GST under RCM at 18%.
              </li>
              <li>
                Regular manpower supply from a <strong>private limited company</strong> (such as Shivraj Enterprise
                Pvt. Ltd.) is <strong>NOT</strong> under RCM. It is billed under Forward Charge at 18%.
              </li>
              <li>
                Pure labour services for construction of a single residential unit, or certain services to
                government/local authorities, may be exempt under Notification 12/2017.
              </li>
            </ul>

            <Callout variant="tip" title="Pro Tip">
              Prefer a <strong>private limited</strong> manpower contractor over a proprietorship. Forward Charge billing is cleaner, the balance sheet is stronger, and your finance team never has to figure out whether RCM applies on a given invoice.
            </Callout>

            <SectionDivider />

            <h2>4. TDS under Section 194C of the Income Tax Act</h2>
            <p>
              A manpower supply contract is a <strong>works contract for supply of labour</strong> and is squarely
              covered by <strong>Section 194C</strong>. The client (deductor) must deduct TDS at the time of credit
              or payment, whichever is earlier:
            </p>
            <ul>
              <li><strong>1%</strong> where the contractor is an individual or HUF</li>
              <li><strong>2%</strong> where the contractor is a company, firm, LLP or any other person</li>
            </ul>
            <p>
              Threshold: no TDS if a single invoice is ≤ ₹30,000 <em>and</em> aggregate payments in the financial
              year are ≤ ₹1,00,000.
            </p>

            <h2>5. Is TDS deducted on the GST amount?</h2>
            <p>
              <strong>No.</strong> As per <strong>CBDT Circular No. 23/2017 dated 19-July-2017</strong>, if GST on
              services is shown separately in the invoice, TDS under Chapter XVII-B is deducted on the amount
              <em> excluding the GST component</em>. So a ₹1,00,000 service value + ₹18,000 GST invoice attracts
              2% TDS on ₹1,00,000 = ₹2,000 only.
            </p>

            <Callout variant="warning" title="Common mistake">
              Deducting TDS on the <em>invoice total including GST</em> is a frequent audit finding. Always split taxable value and GST clearly on the invoice, and apply Section 194C only on the taxable value.
            </Callout>

            <h2>6. GST TDS under Section 51 of CGST Act</h2>
            <p>
              A separate <strong>GST TDS at 2%</strong> (1% CGST + 1% SGST) applies only where the recipient is a
              government department, local authority, PSU or notified body <em>and</em> the contract value exceeds
              ₹2.5 lakh. It does not apply to private manufacturers.
            </p>

            <h2>7. Sample invoice math</h2>
            <table>
              <thead>
                <tr><th>Line</th><th>Amount (₹)</th></tr>
              </thead>
              <tbody>
                <tr><td>Wages + PF + ESIC + service charge (taxable value)</td><td>5,00,000</td></tr>
                <tr><td>Add: CGST @ 9%</td><td>45,000</td></tr>
                <tr><td>Add: SGST @ 9%</td><td>45,000</td></tr>
                <tr><td><strong>Invoice total</strong></td><td><strong>5,90,000</strong></td></tr>
                <tr><td>Less: TDS u/s 194C @ 2% on ₹5,00,000</td><td>(10,000)</td></tr>
                <tr><td><strong>Net payable to contractor</strong></td><td><strong>5,80,000</strong></td></tr>
              </tbody>
            </table>

            <h2>8. Compliance checklist for the client (buyer)</h2>
            <ul>
              <li>Verify contractor's GSTIN and PAN before onboarding</li>
              <li>Collect Labour Licence, PF &amp; ESIC codes and monthly challans</li>
              <li>Match invoices with GSTR-2B before claiming ITC</li>
              <li>Deduct 194C TDS on taxable value only; deposit by the 7th of the next month</li>
              <li>Issue Form 16A quarterly</li>
              <li>Pay contractor within 180 days to retain ITC</li>
            </ul>

            <h2>9. Compliance checklist for the manpower contractor</h2>
            <ul>
              <li>Register under GST, PF, ESIC, Contract Labour (R&amp;A) Act and PSARA (if security)</li>
              <li>Raise tax invoice with SAC 998519 and 18% GST under Forward Charge</li>
              <li>File GSTR-1 &amp; GSTR-3B monthly; reconcile with client's GSTR-2B</li>
              <li>Deposit PF &amp; ESIC by the 15th; share challans with the client</li>
              <li>Reconcile TDS credits in Form 26AS every quarter</li>
            </ul>

            <h2>10. Why this matters in Vapi GIDC</h2>
            <p>
              Vapi's engineering, pharma, chemical and packaging units run high-headcount shifts where a single
              non-compliant contractor can freeze the client's ITC or trigger principal-employer liability under
              the Contract Labour Act. Working with a GST-registered <em>private limited</em> manpower partner that
              bills under Forward Charge, files GSTR on time and shares PF/ESIC challans keeps procurement,
              finance and HR audits clean. Explore our{" "}
              <Link to="/services" className="text-shivraj-700 underline">manpower &amp; housekeeping services</Link>,{" "}
              learn more{" "}
              <Link to="/about" className="text-shivraj-700 underline">about Shivraj Enterprise</Link>, or{" "}
              <Link to="/contact" className="text-shivraj-700 underline">contact our team</Link> for a compliant quote.
            </p>

            <div className="not-prose bg-shivraj-50 border border-shivraj-100 rounded-xl p-6 md:p-8 my-10">
              <h2 className="text-2xl md:text-3xl font-bold text-shivraj-800 mb-3">
                Need compliant manpower or housekeeping services in Vapi GIDC?
              </h2>
              <p className="text-gray-600 mb-6">
                Shivraj Enterprise Pvt. Ltd. is a GST-registered, private limited manpower contractor. We bill under Forward Charge, handle PF/ESIC and labour licence, and issue Section 194C-ready invoices so your finance and HR audits stay clean.
              </p>
              <ul className="grid sm:grid-cols-2 gap-3 mb-8 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-shivraj-600 mt-0.5 shrink-0" />
                  18% GST invoices with SAC 998519
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-shivraj-600 mt-0.5 shrink-0" />
                  PF, ESIC, labour licence &amp; statutory compliance
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-shivraj-600 mt-0.5 shrink-0" />
                  Section 194C-ready TDS on taxable value only
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={16} className="text-shivraj-600 mt-0.5 shrink-0" />
                  Skilled, semi-skilled &amp; unskilled workforce
                </li>
              </ul>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link to="/contact" className="inline-flex items-center gap-2">
                    Request a Quote <ArrowRight size={18} />
                  </Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <a href="tel:+919998498311" className="inline-flex items-center gap-2">
                    <Phone size={18} /> +91 99984 98311
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="https://wa.me/919998498311" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2">
                    <MessageSquare size={18} /> WhatsApp
                  </a>
                </Button>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Free consultation for engineering, pharma, chemical &amp; packaging units in Vapi GIDC.
              </p>
            </div>


            <p className="text-xs text-muted-foreground mt-8">
              Disclaimer: This article is a general guide as of July 2026 and is not tax or legal advice. GST
              rates, RCM notifications and TDS thresholds can change; please consult your tax advisor for
              transaction-specific positions.
            </p>
        </>
      </StaticArticleShell>
      <RelatedPosts
        currentSlug="gst-tds-manpower-supply-guide"
        currentTagSlugs={["compliance", "gst", "tds"]}
      />
    </Layout>
  );
};

export default GstTdsGuide;
