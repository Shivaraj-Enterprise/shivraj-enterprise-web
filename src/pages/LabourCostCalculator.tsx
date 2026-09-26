import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Calculator, RotateCcw, Printer, Info, ChevronDown, MessageCircle, Phone, Plus, X } from "lucide-react";
import { calculateCost, CostInputs, CustomCharge, DEFAULT_INPUTS, inr } from "@/lib/costing";

const URL = "https://shivraj-enterprise.lovable.app/labour-cost-calculator";

const explain = [
  ["Basic Salary", "The fixed daily wage paid to the worker. It should never be below the state minimum wage for that skill level."],
  ["Dearness Allowance (D.A.)", "An extra amount added to wages to offset inflation. Government revises it twice a year (April & October)."],
  ["Overtime (4 hours)", "Extra 4 hours of work. In this sheet it is priced at half a day's gross wage. By law (Factories Act) overtime is paid at twice the ordinary rate per hour."],
  ["Leave Charges", "Money set aside so the worker can take paid leave (earned leave / holidays) without losing income."],
  ["PF (Provident Fund)", "Employer's retirement savings contribution for the worker (EPF + EPS + admin charges ≈ 13%)."],
  ["ESIC", "Employer's share of medical & insurance cover under ESI scheme (3.25%). Worker pays 0.75% separately."],
  ["Bonus", "Statutory annual bonus. Minimum 8.33% of wages under the Payment of Bonus Act, set aside every day."],
  ["Service Charge", "The agency's fee for recruiting, supervising, paying salaries, handling compliance and replacements."],
  ["CGST + SGST", "Goods & Services Tax on manpower supply — 18% total (9% central + 9% state), charged on the bill amount."],
];

const facts = [
  "PF is often calculated only on wages up to ₹15,000/month (wage ceiling), unless employer chooses to pay on full wages.",
  "ESIC applies only if a worker's gross monthly wage is ₹21,000 or less.",
  "Bonus is payable to workers earning up to ₹21,000/month; minimum 8.33%, maximum 20%.",
  "Minimum wages differ by state, zone and skill (unskilled, semi-skilled, skilled). Gujarat revises them regularly.",
  "GST on manpower supply is 18%. For some government/body-corporate clients, reverse charge (RCM) may apply.",
  "Clients may deduct TDS under Section 194C (1% / 2%) on contractor payments.",
];

const faqs = [
  ["Why is the manpower cost much higher than the worker's salary?", "Because the client pays for statutory benefits (PF, ESIC, bonus, leave), the agency's service charge and 18% GST on top of wages. Typically the billed cost is 1.6–1.9× the basic wage."],
  ["Is this the final quotation?", "No. This is an estimate. Final rates depend on skill level, shift, location, minimum wage notifications and contract terms. Contact us for an exact quote."],
  ["Can I claim GST input credit?", "Registered businesses can usually claim input tax credit on GST paid for manpower supply, subject to GST rules."],
  ["How is monthly cost calculated?", "Daily grand total × working days (usually 26) × number of workers."],
];

const NumField = ({ id, label, value, onChange, suffix, hint }: { id: string; label: string; value: number; onChange: (v: number) => void; suffix?: string; hint?: string }) => (
  <div>
    <Label htmlFor={id} className="text-shivraj-800">{label}</Label>
    <div className="relative mt-1">
      <Input id={id} type="number" inputMode="decimal" min={0} step="any" value={Number.isFinite(value) ? value : ""}
        onChange={(e) => onChange(parseFloat(e.target.value))} className="pr-10" />
      {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">{suffix}</span>}
    </div>
    {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
  </div>
);

const Row = ({ label, calc, value, bold, tone }: { label: string; calc?: string; value: number; bold?: boolean; tone?: string }) => (
  <tr className={`border-b border-shivraj-100 ${tone ?? ""}`}>
    <td className={`py-2 px-3 ${bold ? "font-semibold" : ""}`}>{label}</td>
    <td className="py-2 px-3 text-sm text-muted-foreground hidden sm:table-cell">{calc}</td>
    <td className={`py-2 px-3 text-right tabular-nums ${bold ? "font-semibold" : ""}`}>{inr(value)}</td>
  </tr>
);

const Section = ({ title }: { title: string }) => (
  <tr className="bg-shivraj-50"><td colSpan={3} className="py-2 px-3 font-bold text-shivraj-800">{title}</td></tr>
);

const LabourCostCalculator = () => {
  const [inp, setInp] = useState<CostInputs>(DEFAULT_INPUTS);
  const [adv, setAdv] = useState(false);
  const r = useMemo(() => calculateCost(inp), [inp]);
  const customCharges = inp.customCharges ?? [];
  const generatedOn = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  const set = (k: keyof CostInputs) => (v: number) => setInp((s) => ({ ...s, [k]: v }));
  const setCharge = (idx: number, patch: Partial<CustomCharge>) =>
    setInp((s) => ({ ...s, customCharges: s.customCharges.map((c, i) => (i === idx ? { ...c, ...patch } : c)) }));
  const addCharge = () => setInp((s) => ({ ...s, customCharges: [...s.customCharges, { name: "", amount: 0 }] }));
  const removeCharge = (idx: number) =>
    setInp((s) => ({ ...s, customCharges: s.customCharges.filter((_, i) => i !== idx) }));

  const parts = [
    { label: "Wages (A)", v: r.a, cls: "bg-shivraj-700" },
    { label: "Statutory (B)", v: r.b, cls: "bg-shivraj-500" },
    { label: "Service charge", v: r.service, cls: "bg-shivraj-300" },
    { label: "GST", v: r.cgst + r.sgst, cls: "bg-shivraj-200" },
  ];

  const faqLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
  };

  return (
    <Layout>
      <Helmet>
        <title>Labour Cost Calculator – Manpower Costing | Shivraj</title>
        <meta name="description" content="Free manpower cost calculator: enter wages and get daily & monthly labour cost with PF, ESIC, bonus, leave, service charge and GST explained simply." />
        <link rel="canonical" href={URL} />
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      <section className="bg-gradient-to-br from-shivraj-800 to-shivraj-600 text-white py-14 print:hidden">
        <div className="container mx-auto px-4 text-center">
          <Calculator className="mx-auto mb-3" size={40} aria-hidden="true" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Labour Cost Calculator</h1>
          <p className="max-w-3xl mx-auto text-shivraj-100 text-lg">
            See exactly what one worker costs per day and per month. Change the wage, and PF, ESIC, bonus, leave, service charge and GST are calculated automatically.
          </p>
        </div>
      </section>

      <section className="hidden print:block print-report-header">
        <p className="print-company-name">SHIVRAJ ENTERPRISE PVT. LTD.</p>
        <h1>Labour Cost Estimate</h1>
        <p>Generated on {generatedOn}</p>
      </section>

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-[360px_1fr] gap-8 print:py-0 print:px-0 print:block print-report">
        <aside className="bg-white rounded-xl border border-shivraj-100 shadow-sm p-5 h-fit lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:overscroll-contain print:hidden">
          <h2 className="text-xl font-bold text-shivraj-800 mb-4">1. Enter your details</h2>
          <div className="space-y-4">
            <NumField id="basic" label="Basic salary per day" value={inp.basic} onChange={set("basic")} suffix="₹" />
            <NumField id="da" label="Dearness Allowance per day" value={inp.da} onChange={set("da")} suffix="₹" />
            <div className="flex items-center gap-2">
              <Checkbox id="ot" checked={inp.overtime} onCheckedChange={(c) => setInp((s) => ({ ...s, overtime: !!c }))} />
              <Label htmlFor="ot">Include overtime (4 hours/day)</Label>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NumField id="workers" label="Workers" value={inp.workers} onChange={set("workers")} />
              <NumField id="days" label="Days / month" value={inp.days} onChange={set("days")} />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-shivraj-800">Custom charges (per day)</Label>
                <Button type="button" variant="outline" size="sm" onClick={addCharge}>
                  <Plus size={14} className="mr-1" /> Add
                </Button>
              </div>
              {customCharges.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">e.g. Transport ₹50 per worker per day</p>
              )}
              <div className="space-y-2 mt-2">
                {customCharges.map((c, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <Input placeholder="Charge name" value={c.name}
                      onChange={(e) => setCharge(idx, { name: e.target.value })} className="flex-1" />
                    <div className="relative w-24">
                      <Input type="number" inputMode="decimal" min={0} step="any" value={Number.isFinite(c.amount) ? c.amount : ""}
                        onChange={(e) => setCharge(idx, { amount: parseFloat(e.target.value) })} className="pr-7" />
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
                    </div>
                    <button type="button" onClick={() => removeCharge(idx)} aria-label={`Remove ${c.name || "charge"}`}
                      className="text-muted-foreground hover:text-destructive"><X size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
            <button type="button" onClick={() => setAdv(!adv)} aria-expanded={adv}
              className="flex w-full items-center justify-between text-sm font-medium text-shivraj-700">
              Advanced rates (%) <ChevronDown size={16} className={`transition-transform ${adv ? "rotate-180" : ""}`} />
            </button>
            {adv && (
              <div className="grid grid-cols-2 gap-3">
                <NumField id="leave" label="Leave" value={inp.leave} onChange={set("leave")} suffix="%" />
                <NumField id="pf" label="PF" value={inp.pf} onChange={set("pf")} suffix="%" />
                <NumField id="esic" label="ESIC" value={inp.esic} onChange={set("esic")} suffix="%" />
                <NumField id="bonus" label="Bonus" value={inp.bonus} onChange={set("bonus")} suffix="%" />
                <NumField id="service" label="Service" value={inp.service} onChange={set("service")} suffix="%" />
                <NumField id="cgst" label="CGST" value={inp.cgst} onChange={set("cgst")} suffix="%" />
                <NumField id="sgst" label="SGST" value={inp.sgst} onChange={set("sgst")} suffix="%" />
              </div>
            )}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setInp(DEFAULT_INPUTS)}><RotateCcw size={16} className="mr-1" /> Reset</Button>
              <Button variant="outline" className="flex-1" onClick={() => window.print()}><Printer size={16} className="mr-1" /> Print / PDF</Button>
            </div>
          </div>
        </aside>

        <div className="space-y-8">
          <section className="hidden print:block print-input-summary">
            <h2>Entered details</h2>
            <dl>
              <div><dt>Basic salary / day</dt><dd>{inr(inp.basic || 0)}</dd></div>
              <div><dt>D.A. / day</dt><dd>{inr(inp.da || 0)}</dd></div>
              <div><dt>Overtime (4 hours)</dt><dd>{inp.overtime ? "Included" : "Not included"}</dd></div>
              <div><dt>Workers</dt><dd>{inp.workers || 0}</dd></div>
              <div><dt>Working days / month</dt><dd>{inp.days || 0}</dd></div>
              <div><dt>Leave</dt><dd>{inp.leave || 0}%</dd></div>
              <div><dt>PF</dt><dd>{inp.pf || 0}%</dd></div>
              <div><dt>ESIC</dt><dd>{inp.esic || 0}%</dd></div>
              <div><dt>Bonus</dt><dd>{inp.bonus || 0}%</dd></div>
              <div><dt>Service charge</dt><dd>{inp.service || 0}%</dd></div>
              <div><dt>CGST</dt><dd>{inp.cgst || 0}%</dd></div>
              <div><dt>SGST</dt><dd>{inp.sgst || 0}%</dd></div>
              {customCharges.map((charge, idx) => (
                <div key={idx}>
                  <dt>{charge.name.trim() || `Custom charge ${idx + 1}`} / day</dt>
                  <dd>{inr(charge.amount || 0)}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="grid sm:grid-cols-3 gap-4 print-summary">
            {[["Daily cost / worker", r.daily], [`Monthly / worker (${inp.days || 0} days)`, r.monthly], [`Monthly for ${inp.workers || 0} worker(s)`, r.monthlyAll]].map(([l, v], i) => (
              <div key={l as string} className={`rounded-xl p-5 border ${i === 2 ? "bg-shivraj-700 text-white border-shivraj-700" : "bg-white border-shivraj-100"}`}>
                <p className={`text-sm ${i === 2 ? "text-shivraj-100" : "text-muted-foreground"}`}>{l}</p>
                <p className="text-2xl font-bold tabular-nums mt-1">{inr(v as number)}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-shivraj-100 p-5 print-breakdown">
            <h2 className="font-bold text-shivraj-800 mb-3">Where the money goes</h2>
            <div className="flex h-4 rounded-full overflow-hidden" role="img" aria-label="Cost breakdown bar">
              {parts.map((p) => <div key={p.label} className={p.cls} style={{ width: `${r.daily ? (p.v / r.daily) * 100 : 0}%` }} />)}
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm">
              {parts.map((p) => (
                <span key={p.label} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-sm ${p.cls}`} /> {p.label}: {r.daily ? ((p.v / r.daily) * 100).toFixed(1) : 0}%
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-shivraj-100 overflow-hidden print-cost-table">
            <h2 className="text-xl font-bold text-shivraj-800 p-5 pb-3">2. Costing table (per worker, per day)</h2>
            <table className="w-full text-shivraj-900">
              <thead><tr className="bg-shivraj-700 text-white text-left text-sm">
                <th className="py-2 px-3">Particulars</th><th className="py-2 px-3 hidden sm:table-cell print:table-cell">Calculation</th><th className="py-2 px-3 text-right">Amount</th>
              </tr></thead>
              <tbody>
                <Section title="Wages" />
                <Row label="Basic Salary" calc="Per day" value={inp.basic || 0} />
                <Row label="Dearness Allowance (D.A.)" calc="Per day" value={inp.da || 0} />
                <Row label="Gross Wages" calc="Basic + D.A." value={r.gross} bold />
                <Row label="Overtime (4 hours)" calc={inp.overtime ? "Gross ÷ 2" : "Not included"} value={r.ot} />
                <Row label="Subtotal (A)" value={r.a} bold tone="bg-shivraj-50/50" />
                <Section title="Statutory & Additional Charges" />
                <Row label={`Leave Charges @ ${inp.leave}%`} calc="On Basic + D.A." value={r.leave} />
                <Row label={`PF Employer @ ${inp.pf}%`} calc="On Basic + D.A." value={r.pf} />
                <Row label={`ESIC Employer @ ${inp.esic}%`} calc="On Subtotal (A)" value={r.esic} />
                <Row label={`Bonus @ ${inp.bonus}%`} calc="On Basic + D.A." value={r.bonus} />
                {customCharges.map((c, idx) => (
                  <Row key={idx} label={c.name.trim() || `Custom charge ${idx + 1}`} calc="Per day" value={c.amount || 0} />
                ))}
                <Row label="Additional Charges Total (B)" value={r.b} bold tone="bg-shivraj-50/50" />
                <Section title="Service Charges & GST" />
                <Row label="Gross Total (A + B)" value={r.grossTotal} bold />
                <Row label={`Service Charges @ ${inp.service}%`} calc="On (A + B)" value={r.service} />
                <Row label="Subtotal (C)" value={r.c} bold />
                <Row label={`CGST @ ${inp.cgst}%`} calc="On Subtotal (C)" value={r.cgst} />
                <Row label={`SGST @ ${inp.sgst}%`} calc="On Subtotal (C)" value={r.sgst} />
                <tr className="bg-shivraj-800 text-white">
                  <td className="py-3 px-3 font-bold" colSpan={2}>Grand Total Per Day</td>
                  <td className="py-3 px-3 text-right font-bold tabular-nums">{inr(r.daily)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <section className="print:hidden">
            <h2 className="text-2xl font-bold text-shivraj-800 mb-4">3. What each line means</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {explain.map(([t, d]) => (
                <div key={t} className="bg-white rounded-xl border border-shivraj-100 p-4">
                  <h3 className="font-semibold text-shivraj-700 mb-1">{t}</h3>
                  <p className="text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-shivraj-50 rounded-xl p-6 border border-shivraj-100 print:hidden">
            <h2 className="text-2xl font-bold text-shivraj-800 mb-3 flex items-center gap-2"><Info size={22} aria-hidden="true" /> Good to know</h2>
            <ul className="list-disc pl-5 space-y-2 text-shivraj-900">{facts.map((f) => <li key={f}>{f}</li>)}</ul>
            <p className="text-xs text-muted-foreground mt-4">General information as of 2026. Rules change — confirm with a labour-law consultant or read our{" "}
              <Link to="/blog/statutory-compliance-manpower-supply-guide" className="underline">statutory compliance guide</Link> and{" "}
              <Link to="/blog/gst-tds-manpower-supply-guide" className="underline">GST & TDS guide</Link>.</p>
          </section>

          <section className="print:hidden">
            <h2 className="text-2xl font-bold text-shivraj-800 mb-4">Frequently asked questions</h2>
            <div className="space-y-3">
              {faqs.map(([q, a]) => (
                <details key={q} className="bg-white rounded-xl border border-shivraj-100 p-4">
                  <summary className="font-semibold text-shivraj-800 cursor-pointer">{q}</summary>
                  <p className="mt-2 text-muted-foreground">{a}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-gradient-to-r from-shivraj-700 to-shivraj-600 text-white p-6 text-center print:hidden">
            <h2 className="text-2xl font-bold mb-2">Need an exact quotation?</h2>
            <p className="text-shivraj-100 mb-4">Tell us the number of workers, skill and shift — we'll send a detailed rate sheet.</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild className="bg-white text-shivraj-800 hover:bg-shivraj-50"><Link to="/contact">Get a Quote</Link></Button>
              <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10"><a href="https://wa.me/919998498311" target="_blank" rel="noopener noreferrer"><MessageCircle size={16} className="mr-1" /> WhatsApp</a></Button>
              <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10"><a href="tel:+919998498311"><Phone size={16} className="mr-1" /> Call</a></Button>
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default LabourCostCalculator;
