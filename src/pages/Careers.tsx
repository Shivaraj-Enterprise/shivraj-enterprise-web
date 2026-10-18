import { useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { Briefcase, Mail, MessageSquare, Phone, Download, Upload, ShieldCheck, TrendingUp, HardHat, IndianRupee, CheckCircle2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { jobRoles, SkillLevel } from "@/data/jobRoles";
import poster from "@/assets/hiring-poster.png.asset.json";

const PHONE = "919998498311";
const EMAIL = "shivrajenterprise1234@gmail.com";
const LEVELS: ("All" | SkillLevel)[] = ["All", "Skilled", "Semi-Skilled", "Unskilled"];

const schema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z.string().trim().regex(/^\+?[0-9\s-]{8,20}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email").max(255).or(z.literal("")),
  role: z.string().trim().min(2, "Choose a job"),
});

const faqs = [
  { q: "Do I need an ITI certificate?", a: "ITI or a technical trade certificate is preferred for skilled roles like electrician, fitter, welder and machinist. Semi-skilled and unskilled jobs do not need ITI." },
  { q: "Is there any fee to apply?", a: "No. Applying and joining Shivraj Enterprise is completely free. We never ask candidates for money." },
  { q: "What documents should I bring?", a: "Aadhaar card, PAN card (if available), bank passbook, passport-size photos and your ITI / education certificates." },
  { q: "Will I get PF and ESI?", a: "Yes. PF and ESI benefits are given as per government norms." },
  { q: "Where is the work?", a: "Mostly in Vapi GIDC and nearby industrial areas like Sarigam, Silvassa, Daman and Umbergaon." },
];

const Careers = () => {
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [sameWa, setSameWa] = useState(true);
  const [f, setF] = useState({ name: "", phone: "+91 ", whatsapp: "", email: "", role: "", skill_level: "Skilled" as SkillLevel, experience_years: "", qualification: "", current_location: "", message: "" });
  const [cv, setCv] = useState<File | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const pick = (title: string, lvl: SkillLevel) => {
    setF((p) => ({ ...p, role: title, skill_level: lvl }));
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const waText = encodeURIComponent(`Hello Shivraj Enterprise, I want to apply for the job of ${f.role || "[job]"}.\nName: ${f.name || ""}\nExperience: ${f.experience_years || ""} years\nI will send my CV here.`);
  const mailHref = `mailto:${EMAIL}?subject=${encodeURIComponent(`Job Application – ${f.role || "Worker"}`)}&body=${encodeURIComponent("Hello, please find my CV attached.\n\nName:\nPhone:\nJob:\nExperience:")}`;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = schema.safeParse(f);
    if (!v.success) { toast({ title: "Please check the form", description: v.error.errors[0].message, variant: "destructive" }); return; }
    if (cv && cv.size > 5 * 1024 * 1024) { toast({ title: "CV too large", description: "Max 5 MB", variant: "destructive" }); return; }
    setSending(true);
    try {
      const fd = new FormData();
      Object.entries({ ...f, whatsapp: sameWa ? f.phone : f.whatsapp }).forEach(([k, val]) => fd.append(k, String(val)));
      if (cv) fd.append("cv", cv);
      const { error } = await supabase.functions.invoke("job-apply", { body: fd });
      if (error) throw error;
      setDone(true);
      toast({ title: "Application sent! 🎉", description: "Our team will call you soon." });
    } catch {
      toast({ title: "Could not send", description: "Please try again or apply on WhatsApp.", variant: "destructive" });
    } finally { setSending(false); }
  };

  const shown = jobRoles.filter((r) => level === "All" || r.level === level);
  const jobLd = jobRoles.slice(0, 10).map((r) => ({
    "@context": "https://schema.org", "@type": "JobPosting", title: r.title,
    description: `${r.title} (${r.level}) job in Vapi GIDC. ${r.duties.join(". ")}. PF & ESI benefits.`,
    datePosted: "2026-10-18", validThrough: "2027-04-30", employmentType: "FULL_TIME",
    hiringOrganization: { "@type": "Organization", name: "Shivraj Enterprise", sameAs: "https://shivraj-enterprise.lovable.app" },
    jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: "Vapi", addressRegion: "Gujarat", postalCode: "396191", addressCountry: "IN" } },
  }));
  const faqLd = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map((x) => ({ "@type": "Question", name: x.q, acceptedAnswer: { "@type": "Answer", text: x.a } })) };
  const input = "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-shivraj-500";

  return (
    <Layout>
      <Helmet>
        <title>Jobs in Vapi GIDC – Careers at Shivraj Enterprise</title>
        <meta name="description" content="Apply for skilled, semi-skilled and unskilled jobs in Vapi GIDC: electrician, fitter, welder, plumber, helper. PF & ESI. Apply online, on WhatsApp or by email." />
        <link rel="canonical" href="https://shivraj-enterprise.lovable.app/careers" />
        <meta property="og:title" content="We're Hiring – Shivraj Enterprise Careers" />
        <meta property="og:description" content="Skilled, semi-skilled & unskilled jobs in Vapi GIDC. Apply with your CV today." />
        <script type="application/ld+json">{JSON.stringify(jobLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqLd)}</script>
      </Helmet>

      {/* Banner */}
      <section className="bg-gradient-to-br from-shivraj-900 via-shivraj-800 to-shivraj-600 text-white py-16 md:py-24">
        <div className="container mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block bg-yellow-400 text-shivraj-900 font-bold px-3 py-1 rounded mb-4">📢 Now hiring in Vapi GIDC</span>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">We're <span className="text-yellow-400">Hiring!</span></h1>
            <p className="text-xl mt-4 text-shivraj-100">Skilled, Semi-Skilled & Unskilled workers for industrial projects. <em>Your Skills, Our Strength.</em></p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Button onClick={() => formRef.current?.scrollIntoView({ behavior: "smooth" })} className="bg-yellow-400 text-shivraj-900 hover:bg-yellow-300 font-bold"><Briefcase size={18} /> Apply Now</Button>
              <Button asChild className="bg-green-600 hover:bg-green-700"><a href={`https://wa.me/${PHONE}?text=${waText}`} target="_blank" rel="noopener noreferrer"><MessageSquare size={18} /> Apply on WhatsApp</a></Button>
              <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white/10"><a href={mailHref}><Mail size={18} /> Email your CV</a></Button>
            </div>
          </div>
          <img src={poster.url} alt="Shivraj Enterprise hiring poster" width={1024} height={1536} className="rounded-xl shadow-2xl max-h-[520px] w-auto mx-auto hidden lg:block" />
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-shivraj-50 py-10">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[[IndianRupee, "Attractive Salary", "As per skill & experience"], [ShieldCheck, "PF & ESI Benefits", "As per government norms"], [HardHat, "Safe Work Place", "Safety gear & training"], [TrendingUp, "Long-Term Growth", "Skill development"]].map(([Icon, t, s]: any) => (
            <div key={t} className="flex items-start gap-3"><Icon className="text-shivraj-600 shrink-0" /><div><p className="font-semibold text-shivraj-800">{t}</p><p className="text-sm text-gray-600">{s}</p></div></div>
          ))}
        </div>
      </section>

      {/* Openings */}
      <section className="section bg-white">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-shivraj-800 mb-2">Job Openings</h2>
          <p className="text-gray-600 mb-6">Pick your skill level and tap Apply on the job you want.</p>
          <div className="flex flex-wrap gap-2 mb-8" role="tablist">
            {LEVELS.map((l) => (
              <button key={l} role="tab" aria-selected={level === l} onClick={() => setLevel(l)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition ${level === l ? "bg-shivraj-600 text-white border-shivraj-600" : "border-shivraj-200 text-shivraj-700 hover:bg-shivraj-50"}`}>{l}</button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map((r) => (
              <div key={r.title} className="rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:-translate-y-0.5 transition flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl" aria-hidden>{r.emoji}</span>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.level === "Skilled" ? "bg-shivraj-100 text-shivraj-700" : r.level === "Semi-Skilled" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-700"}`}>{r.level}</span>
                </div>
                <h3 className="font-bold text-lg text-shivraj-800">{r.title}</h3>
                <p className="text-xs text-gray-500 mb-2">📍 Vapi GIDC & nearby {r.iti && "· ITI preferred"}</p>
                <ul className="text-sm text-gray-600 space-y-1 mb-4 flex-1">{r.duties.map((d) => <li key={d}>• {d}</li>)}</ul>
                <Button onClick={() => pick(r.title, r.level)} className="bg-shivraj-600 hover:bg-shivraj-700 w-full">Apply for {r.title}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-shivraj-50">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-shivraj-800 mb-6 text-center">How hiring works</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["Apply online, WhatsApp or email", "We call you", "Document check & interview", "Join work"].map((s, i) => (
              <div key={s} className="bg-white rounded-xl p-5 text-center shadow-sm"><div className="w-10 h-10 mx-auto rounded-full bg-shivraj-600 text-white font-bold flex items-center justify-center mb-2">{i + 1}</div><p className="text-sm font-medium text-shivraj-800">{s}</p></div>
            ))}
          </div>
        </div>
      </section>

      {/* Apply */}
      <section className="section bg-white" id="apply">
        <div ref={formRef} className="container mx-auto grid lg:grid-cols-3 gap-8 scroll-mt-24">
          <div className="lg:col-span-2 rounded-xl border border-gray-100 shadow-md p-6 md:p-8">
            <h2 className="text-2xl font-bold text-shivraj-800 mb-1">Apply with your CV</h2>
            <p className="text-sm text-gray-600 mb-6">Takes 2 minutes. CV is optional.</p>
            {done ? (
              <div className="text-center py-10"><CheckCircle2 className="mx-auto text-green-600 mb-3" size={48} /><p className="text-xl font-semibold text-shivraj-800">Thank you, {f.name}!</p><p className="text-gray-600 mt-2">We received your application. Our team will call you soon.</p></div>
            ) : (
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
                <label className="text-sm">Full name *<input className={input} value={f.name} onChange={set("name")} maxLength={100} required /></label>
                <label className="text-sm">Phone number *<input className={input} value={f.phone} onChange={set("phone")} maxLength={20} required /></label>
                <div className="text-sm">
                  <label className="flex items-center gap-2 mb-1"><input type="checkbox" checked={sameWa} onChange={(e) => setSameWa(e.target.checked)} /> WhatsApp same as phone</label>
                  {!sameWa && <input className={input} placeholder="WhatsApp number" value={f.whatsapp} onChange={set("whatsapp")} maxLength={20} />}
                </div>
                <label className="text-sm">Email (optional)<input type="email" className={input} value={f.email} onChange={set("email")} maxLength={255} /></label>
                <label className="text-sm">Job *
                  <select className={input} value={f.role} onChange={(e) => { const r = jobRoles.find((x) => x.title === e.target.value); setF({ ...f, role: e.target.value, skill_level: r?.level ?? f.skill_level }); }} required>
                    <option value="">Choose a job</option>
                    {jobRoles.map((r) => <option key={r.title}>{r.title}</option>)}
                    <option>Other</option>
                  </select>
                </label>
                <label className="text-sm">Skill level *
                  <select className={input} value={f.skill_level} onChange={set("skill_level")}>{LEVELS.slice(1).map((l) => <option key={l}>{l}</option>)}</select>
                </label>
                <label className="text-sm">Experience (years)<input className={input} value={f.experience_years} onChange={set("experience_years")} maxLength={20} /></label>
                <label className="text-sm">Qualification / ITI trade<input className={input} value={f.qualification} onChange={set("qualification")} maxLength={100} placeholder="e.g. ITI Electrician, 10th pass" /></label>
                <label className="text-sm sm:col-span-2">Current location<input className={input} value={f.current_location} onChange={set("current_location")} maxLength={100} /></label>
                <label className="text-sm sm:col-span-2">Message<textarea className={input} rows={3} value={f.message} onChange={set("message")} maxLength={1000} /></label>
                <label className="sm:col-span-2 flex items-center gap-3 border-2 border-dashed border-shivraj-200 rounded-lg p-4 cursor-pointer hover:bg-shivraj-50">
                  <Upload className="text-shivraj-600" />
                  <span className="text-sm">{cv ? cv.name : "Upload CV (PDF, Word or photo, max 5 MB)"}</span>
                  <input type="file" className="sr-only" accept=".pdf,.doc,.docx,image/*" onChange={(e) => setCv(e.target.files?.[0] ?? null)} />
                </label>
                <Button type="submit" disabled={sending} className="sm:col-span-2 bg-shivraj-600 hover:bg-shivraj-700">{sending ? "Sending..." : "Submit Application"}</Button>
              </form>
            )}
          </div>
          <aside className="space-y-4">
            <h3 className="font-bold text-shivraj-800 text-lg">Other ways to apply</h3>
            <a href={`https://wa.me/${PHONE}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="flex gap-3 p-4 rounded-xl bg-green-50 border border-green-100 hover:shadow"><MessageSquare className="text-green-600" /><div><p className="font-semibold">WhatsApp</p><p className="text-sm text-gray-600">Send a message and attach your CV or a photo of it.</p></div></a>
            <a href={mailHref} className="flex gap-3 p-4 rounded-xl bg-shivraj-50 border border-shivraj-100 hover:shadow"><Mail className="text-shivraj-600" /><div><p className="font-semibold">Email</p><p className="text-sm text-gray-600 break-all">{EMAIL}</p></div></a>
            <a href="tel:+919998498311" className="flex gap-3 p-4 rounded-xl bg-yellow-50 border border-yellow-100 hover:shadow"><Phone className="text-yellow-700" /><div><p className="font-semibold">Call us</p><p className="text-sm text-gray-600">+91 99984 98311</p></div></a>
            <p className="text-xs text-gray-500">⚠️ We never charge any fee for jobs.</p>
          </aside>
        </div>
      </section>

      {/* FAQ + poster */}
      <section className="py-12 bg-shivraj-50">
        <div className="container mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-shivraj-800 mb-4">Questions from job seekers</h2>
            <div className="space-y-3">{faqs.map((x) => (
              <details key={x.q} className="bg-white rounded-lg p-4 shadow-sm"><summary className="font-semibold text-shivraj-800 cursor-pointer">{x.q}</summary><p className="text-gray-600 mt-2 text-sm">{x.a}</p></details>
            ))}</div>
          </div>
          <div className="text-center">
            <img src={poster.url} alt="We're hiring poster" width={1024} height={1536} loading="lazy" className="rounded-xl shadow-lg w-full max-w-xs mx-auto" />
            <Button asChild variant="outline" className="mt-4"><a href={poster.url} download="Shivraj-Enterprise-Hiring-Poster.png"><Download size={16} /> Download poster</a></Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
