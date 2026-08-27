export type ServiceSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type ServiceFaq = { question: string; answer: string };

export type ServicePage = {
  slug: string;
  navLabel: string;
  cardBlurb: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  intro: string[];
  sections: ServiceSection[];
  /** Rate card service names to highlight on this page. Empty = show all. */
  rateFilter: string[];
  faqs: ServiceFaq[];
  related: string[];
};

export const SERVICE_AREAS = [
  "Vapi GIDC Phase 1",
  "Vapi GIDC Phase 2",
  "Vapi GIDC Phase 3",
  "Vapi GIDC Phase 4",
  "Chala",
  "Balitha",
  "Salvav",
  "Chharwada",
  "Sarigam",
  "Umbergaon",
  "Silvassa",
  "Daman",
];

export const servicePages: ServicePage[] = [
  {
    slug: "manpower-supply-services",
    navLabel: "Manpower Supply Services",
    cardBlurb:
      "Screened operators, fitters, helpers, housekeeping staff and supervisors supplied on 8-hour or 12-hour shifts.",
    metaTitle: "Manpower Supply Services in Vapi GIDC | Shivraj",
    metaDescription:
      "Manpower supply services in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon. Skilled, semi-skilled & unskilled labour with PF, ESIC and GST compliance.",
    h1: "Manpower Supply Services in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Screened skilled, semi-skilled and unskilled workers supplied to factories, warehouses and commercial sites — on 8-hour or 12-hour shifts, with full statutory compliance.",
    intro: [
      "Shivraj Enterprise provides manpower supply services to factories, warehouses and commercial sites across Vapi GIDC and the surrounding industrial belt. We supply skilled operators, semi-skilled workers, unskilled helpers, fitters, housekeeping staff and supervisors on contract, on 8-hour or 12-hour shifts, and we handle recruitment, payroll, PF, ESIC and wage compliance for every worker we deploy.",
      "If you need to add headcount for a production ramp-up, a shutdown, a seasonal peak or a long-running line, we can usually mobilise screened workers within 24 to 48 hours for standard roles. You pay a transparent per-shift or per-month rate against a GST-compliant invoice, and you receive monthly statutory challans as proof of compliance.",
    ],
    sections: [
      {
        heading: "What manpower supply services include",
        paragraphs: [
          "Manpower supply means we remain the employer of record for the workers deployed at your site, while you direct the work. That keeps your own headcount and HR overhead flat and moves recruitment, payroll processing, statutory deductions and replacement risk to us.",
        ],
        bullets: [
          "Sourcing and screening of candidates for the skill category you need",
          "Onboarding, documentation and ID verification before deployment",
          "Monthly payroll processing, wage register and payslips",
          "PF and ESIC registration, deduction and deposit with monthly challans",
          "Attendance and shift records shared with your plant HR or store team",
          "Replacement of absent or unsuitable workers, usually within the same or next shift",
        ],
      },
      {
        heading: "Worker categories we supply",
        bullets: [
          "Skilled operators — machine operators, CNC and press operators, process assistants",
          "Fitters — mechanical fitters and maintenance helpers for plant upkeep",
          "Semi-skilled workers — line workers, packers, batch handlers, material feeders",
          "Unskilled helpers — general labour for production support and site work",
          "Housekeeping staff — plant, office and washroom cleaning teams",
          "Supervisors — shift supervisors who manage attendance, discipline and daily reporting",
          "Loading and unloading labour — tonnage-based material handling teams",
        ],
      },
      {
        heading: "Shift options and headcount flexibility",
        paragraphs: [
          "Most Vapi GIDC units run either three 8-hour shifts or two 12-hour shifts. We supply against both patterns and quote separately for each, so you are not paying a blended rate that does not match your roster.",
          "Headcount is scalable in both directions. You can start with a small team for one line, expand during peak dispatch months, and scale back afterwards without carrying permanent employment cost. Backup workers are kept on the roster for high-absence categories so a no-show does not stop a line.",
        ],
      },
      {
        heading: "Industries we supply to",
        paragraphs: [
          "Vapi GIDC is dominated by chemicals, pharmaceuticals, engineering, packaging and logistics, and each has a different manpower profile. Chemical and pharma units need workers who follow PPE and SOP discipline strictly. Engineering units need operators and fitters with machine familiarity. Packaging and logistics units need volume — packers, loaders and dispatch helpers who can absorb throughput swings.",
        ],
        bullets: [
          "Engineering and fabrication units",
          "Pharmaceutical manufacturing and formulation plants",
          "Chemical and speciality chemical plants",
          "Packaging and printing units",
          "General manufacturing",
          "Warehousing and logistics operations",
        ],
      },
      {
        heading: "How deployment works",
        bullets: [
          "1. Requirement — you share role, headcount, shift pattern, skill level and start date",
          "2. Quote — we confirm the per-shift or per-month rate and any site-specific conditions",
          "3. Screening — candidates are sourced, verified and matched to the skill category",
          "4. Mobilisation — workers report to site, typically within 24 to 48 hours for standard roles",
          "5. Supervision — a supervisor manages attendance, discipline and daily reporting",
          "6. Compliance — monthly invoice with wage register, PF and ESIC challans",
        ],
      },
    ],
    rateFilter: [],
    faqs: [
      {
        question: "What is manpower supply services?",
        answer:
          "Manpower supply services provide a business with skilled, semi-skilled or unskilled workers on a contract basis. The supplier — Shivraj Enterprise — remains the employer of the workers and handles recruitment, payroll, PF, ESIC and wage compliance, while the client directs the day-to-day work at the site.",
      },
      {
        question: "How quickly can you supply workers in Vapi GIDC?",
        answer:
          "For standard categories such as helpers, packers, housekeeping and general operators, we can usually mobilise screened workers within 24 to 48 hours. Supervisors, fitters and specialised operators may need a little more lead time depending on headcount.",
      },
      {
        question: "Do you supply workers on both 8-hour and 12-hour shifts?",
        answer:
          "Yes. We supply against 8-hour and 12-hour shift patterns and quote each separately. Rates for skilled, semi-skilled and unskilled labour are published on our rate card for both patterns where applicable.",
      },
      {
        question: "Who pays PF and ESIC for supplied workers?",
        answer:
          "Shivraj Enterprise deducts and deposits PF and ESIC contributions for the workers it supplies, because those workers are our employees. We share monthly challans so the client, as principal employer, can verify compliance under the Contract Labour (Regulation and Abolition) Act.",
      },
      {
        question: "What happens if a supplied worker is absent?",
        answer:
          "We maintain backup workers for high-volume categories and arrange a replacement for the same or next shift. Persistent absence or unsuitability is handled by replacing the worker at no additional mobilisation cost.",
      },
      {
        question: "Which areas do you supply manpower to?",
        answer:
          "We supply across Vapi GIDC Phases 1 to 4, Chala, Balitha, Salvav and Chharwada, and to the nearby industrial belts of Sarigam, Umbergaon, Silvassa and Daman.",
      },
      {
        question: "Is GST charged on manpower supply?",
        answer:
          "Yes. Manpower supply services generally attract 18% GST, usually under forward charge, so we issue a tax invoice and eligible clients can claim input tax credit.",
      },
    ],
    related: [
      "manpower-outsourcing-services",
      "skilled-operator-labour",
      "supervisor-manpower",
    ],
  },
  {
    slug: "manpower-outsourcing-services",
    navLabel: "Manpower Outsourcing Services",
    cardBlurb:
      "A fully managed workforce — recruitment, payroll, statutory compliance and on-site supervision handled end to end.",
    metaTitle: "Manpower Outsourcing Services in Vapi | Shivraj",
    metaDescription:
      "Manpower outsourcing services in Vapi GIDC, Silvassa, Daman & Sarigam. Fully managed workforce with payroll, PF, ESIC and CLRA compliance handled end to end.",
    h1: "Manpower Outsourcing Services in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Hand over recruitment, payroll, statutory compliance and day-to-day supervision — and keep your own HR team focused on core operations.",
    intro: [
      "Manpower outsourcing services let you move an entire function — production support, housekeeping, material handling or an entire shift — to an external partner who recruits, pays, supervises and legally employs the workers. Shivraj Enterprise provides that end-to-end model for factories and warehouses across Vapi GIDC, Sarigam, Umbergaon, Silvassa and Daman.",
      "The difference from plain labour supply is accountability. With outsourcing you are buying a managed outcome — a staffed shift, a cleaned plant, a dispatched load — not just bodies at the gate. We put a supervisor in place, own attendance and discipline, absorb replacement risk, and deliver a single monthly invoice with the compliance paperwork attached.",
    ],
    sections: [
      {
        heading: "What we take over when you outsource",
        bullets: [
          "Manpower planning against your production or dispatch schedule",
          "Sourcing, screening, documentation and onboarding of every worker",
          "Payroll processing, wage registers, payslips and bank transfers",
          "PF, ESIC, professional tax and labour welfare fund deductions and deposits",
          "CLRA licensing obligations applicable to us as the contractor",
          "On-site supervision, attendance discipline and daily reporting",
          "Replacements, absenteeism management and shift backfilling",
          "Monthly compliance pack: challans, registers and a GST-compliant invoice",
        ],
      },
      {
        heading: "Manpower outsourcing vs in-house hiring",
        paragraphs: [
          "In-house hiring means you carry recruitment cost, notice periods, statutory registrations, audit exposure and the fixed cost of a headcount you may not need in a slow quarter. Outsourcing converts most of that into a variable per-shift cost that tracks actual production.",
          "The other saving is administrative. A plant HR team that spends its month chasing attendance sheets, PF challans and replacement hiring is not doing safety, training or retention work. Outsourcing removes that load and gives HR a single point of contact instead of dozens of individual worker files.",
        ],
        bullets: [
          "Variable cost that scales with production instead of a fixed payroll",
          "No recruitment, notice-period or severance overhead on outsourced roles",
          "Statutory liability and paperwork managed by the contractor",
          "One monthly invoice instead of many individual payroll entries",
          "Faster ramp-up and ramp-down around peaks and shutdowns",
        ],
      },
      {
        heading: "Functions commonly outsourced in Vapi GIDC",
        bullets: [
          "Production support staffing across all three shifts",
          "Complete plant and office housekeeping",
          "Material handling, loading, unloading and dispatch support",
          "Packaging lines and quality or packaging inspection",
          "Utility and maintenance helper teams working under your engineers",
        ],
      },
      {
        heading: "Governance and reporting",
        paragraphs: [
          "Every outsourced engagement runs against an agreed headcount, shift pattern and rate. A supervisor on site owns attendance and discipline, and reports daily to your nominated plant contact. Monthly, you receive the wage register, PF and ESIC challans and the tax invoice together, so your accounts and compliance teams can reconcile in one pass.",
          "As principal employer you retain a verification duty under the Contract Labour (Regulation and Abolition) Act. Our monthly pack is built to make that verification quick rather than a chase.",
        ],
      },
    ],
    rateFilter: [],
    faqs: [
      {
        question: "What is manpower outsourcing services?",
        answer:
          "Manpower outsourcing services means hiring an external agency to recruit, employ, pay and supervise the workers who perform a function at your site. Shivraj Enterprise handles the full cycle — sourcing, onboarding, payroll, PF, ESIC, supervision and replacements — while you direct the work output.",
      },
      {
        question: "What is the difference between manpower supply and manpower outsourcing?",
        answer:
          "Manpower supply focuses on providing workers against a headcount request. Outsourcing goes further: we take responsibility for a whole function, place a supervisor on site, own attendance and discipline, and deliver a managed outcome rather than only a worker count.",
      },
      {
        question: "Does outsourcing reduce cost compared with in-house hiring?",
        answer:
          "It usually reduces total cost of employment because recruitment overhead, statutory administration and idle-capacity payroll are converted into a variable per-shift rate. The saving depends on your headcount volatility — the more your requirement fluctuates, the larger the benefit.",
      },
      {
        question: "Who is legally the employer of outsourced workers?",
        answer:
          "The contractor is the employer of its own workers and is responsible for PF, ESIC, professional tax and labour welfare fund contributions. The client is the principal employer under the CLRA Act and has a duty to verify that the contractor's compliance is in order.",
      },
      {
        question: "Can we outsource only one shift or one department?",
        answer:
          "Yes. Many Vapi units outsource a single night shift, a housekeeping function or a packing line first, then expand once the reporting and compliance rhythm is established.",
      },
      {
        question: "What TDS applies to a manpower outsourcing contract?",
        answer:
          "TDS under Section 194C applies to labour and manpower contracts — 1% when paying an individual or HUF and 2% for companies, firms and other entities. It is triggered when a single payment exceeds ₹30,000 or aggregate payments exceed ₹1,00,000 in a financial year. GST is excluded from TDS when shown separately on the invoice.",
      },
      {
        question: "How is the monthly invoice structured?",
        answer:
          "The invoice shows the agreed rate against actual shifts or headcount deployed, with 18% GST shown separately, and is accompanied by the wage register and PF and ESIC challans for that month.",
      },
    ],
    related: [
      "manpower-supply-services",
      "industrial-housekeeping-services",
      "supervisor-manpower",
    ],
  },
  {
    slug: "industrial-housekeeping-services",
    navLabel: "Industrial Housekeeping Services",
    cardBlurb:
      "Trained housekeeping teams for plants, offices, warehouses and events — with PPE discipline and safety compliance.",
    metaTitle: "Industrial Housekeeping Services in Vapi GIDC",
    metaDescription:
      "Industrial housekeeping services for factories, warehouses and offices in Vapi GIDC, Sarigam, Silvassa & Daman. Trained staff, PPE discipline, shift-wise cleaning.",
    h1: "Industrial Housekeeping Services in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Trained housekeeping teams for plant floors, utility areas, warehouses, offices and events — deployed shift-wise with safety and PPE discipline.",
    intro: [
      "Industrial housekeeping is not office cleaning scaled up. A chemical or pharmaceutical plant floor has spill protocols, restricted zones, PPE requirements and audit expectations that a general cleaning crew is not trained for. Shivraj Enterprise supplies housekeeping teams that work inside those constraints across Vapi GIDC and the surrounding industrial belt.",
      "We deploy shift-wise so that cleaning follows production rather than interrupting it, and we supervise the team on site so standards do not drift between audits. Housekeeping is charged per 8-hour shift, on the same transparent rate card as our other manpower categories.",
    ],
    sections: [
      {
        heading: "Where our housekeeping teams work",
        bullets: [
          "Production floors, machine surrounds and gangways",
          "Utility areas, boiler rooms, ETP surrounds and storage yards",
          "Warehouses, dispatch bays and packaging areas",
          "Canteens, changing rooms, washrooms and rest areas",
          "Administrative offices, meeting rooms and reception areas",
          "Pre-event and post-event cleaning for company functions and audits",
        ],
      },
      {
        heading: "Safety and PPE discipline",
        paragraphs: [
          "Housekeeping staff in a chemical or pharma plant are exposed to the same hazards as production workers, and a cleaning error can become a safety incident. Our staff are briefed on site-specific rules before deployment and work with the PPE the site requires.",
        ],
        bullets: [
          "Site induction and hazard briefing before the first shift",
          "PPE use — gloves, masks, safety shoes, eye protection as required by the site",
          "Spill handling and waste segregation as per your plant SOP",
          "No entry into restricted zones without site authorisation",
          "Escalation of unsafe conditions to the site supervisor",
        ],
      },
      {
        heading: "Audit readiness and consistency",
        paragraphs: [
          "Pharmaceutical and chemical units in Vapi face customer audits, regulatory inspections and periodic certification reviews. Housekeeping is one of the first things an auditor sees, and it is also the easiest standard to let slip between inspections.",
          "We work to a defined scope per area and per shift so cleaning is routine rather than reactive, with a supervisor checking coverage and attendance. Scope, frequency and area list are agreed at the start of the contract and reviewed as your layout changes.",
        ],
      },
      {
        heading: "Deployment models",
        bullets: [
          "Single-shift housekeeping for smaller plants and offices",
          "Round-the-clock coverage across three 8-hour shifts",
          "Dedicated deep-clean teams before audits, festivals or shutdowns",
          "Event cleaning — pre-event setup support and post-event clearance",
          "Combined manpower and housekeeping contracts under one invoice",
        ],
      },
      {
        heading: "Compliance on housekeeping contracts",
        paragraphs: [
          "Housekeeping staff supplied by us are our employees. PF, ESIC and wage compliance are handled by Shivraj Enterprise and evidenced by monthly challans, exactly as with our production manpower. Invoicing carries 18% GST shown separately, and TDS under Section 194C applies to the contract in the usual way.",
        ],
      },
    ],
    rateFilter: ["Housekeeping"],
    faqs: [
      {
        question: "What is included in industrial housekeeping services?",
        answer:
          "Industrial housekeeping covers cleaning and upkeep of production floors, machine surrounds, utility areas, warehouses, washrooms, canteens and offices, along with waste segregation and spill handling as defined by your plant SOP.",
      },
      {
        question: "How is industrial housekeeping different from commercial cleaning?",
        answer:
          "Industrial housekeeping is performed inside an operating plant, so staff must follow PPE rules, restricted-zone controls, spill protocols and waste segregation requirements. Commercial cleaning has none of those constraints, and staff trained only for offices are not suitable for a chemical or pharma floor.",
      },
      {
        question: "What is the rate for housekeeping staff?",
        answer:
          "Housekeeping is charged per 8-hour shift. The current indicative rate is shown on the rate card on this page and is subject to government wage notifications and site-specific requirements.",
      },
      {
        question: "Do you provide housekeeping around the clock?",
        answer:
          "Yes. We deploy across three 8-hour shifts for continuous-process plants, or on a single-shift basis for offices and smaller units.",
      },
      {
        question: "Do you provide cleaning materials and machines?",
        answer:
          "Scope varies by contract. Many plants prefer to supply their own approved chemicals and equipment for compatibility and audit reasons. Tell us your preference and we will quote accordingly.",
      },
      {
        question: "Can you do a one-time deep clean before an audit?",
        answer:
          "Yes. We deploy dedicated deep-clean teams for pre-audit preparation, shutdown cleaning, and pre- or post-event clearance, separate from any ongoing housekeeping contract.",
      },
    ],
    related: [
      "manpower-outsourcing-services",
      "unskilled-labour",
      "manpower-supply-services",
    ],
  },
  {
    slug: "loading-unloading-material-handling",
    navLabel: "Loading, Unloading & Material Handling",
    cardBlurb:
      "Tonnage-based loading and unloading, material movement, dispatch support and packaging or quality inspectors.",
    metaTitle: "Loading & Unloading Services in Vapi GIDC | Shivraj",
    metaDescription:
      "Loading and unloading services, material handling and dispatch support in Vapi GIDC, Sarigam, Silvassa & Daman. Tonnage-based rates with trained, compliant labour.",
    h1: "Loading, Unloading & Material Handling Services in Vapi GIDC and Nearby Industrial Belts",
    heroSubtitle:
      "Trained gangs for truck loading and unloading, internal material movement, dispatch support and packaging or quality inspection — charged per tonne or per shift.",
    intro: [
      "Loading and unloading is where throughput is won or lost. A vehicle waiting at the gate is detention cost, and a badly handled load is damaged stock. Shivraj Enterprise supplies trained loading and unloading gangs, material handlers and dispatch support staff to plants and warehouses across Vapi GIDC, Sarigam, Umbergaon, Silvassa and Daman.",
      "Loading and unloading is normally charged on a per-tonne basis, which keeps your cost tied to actual volume moved rather than idle hours. Material handling and dispatch support inside the plant can also be supplied on a per-shift basis where the work is continuous.",
    ],
    sections: [
      {
        heading: "Services in this category",
        bullets: [
          "Truck and container loading and unloading, charged per tonne",
          "Bagged, drummed, palletised and loose material handling",
          "Internal movement of raw material between stores and production",
          "Finished goods movement to dispatch bays and staging areas",
          "Stacking, wrapping, strapping and labelling support",
          "Quality and packaging inspectors for outbound consignments",
        ],
      },
      {
        heading: "Why a trained gang matters",
        paragraphs: [
          "Loading damage, wrong stacking and slow turnaround are usually a training problem, not a headcount problem. Workers who understand drum handling, bag stacking patterns and load stability move the same tonnage faster and with fewer rejections.",
          "For chemical and pharma sites, handling discipline also has a safety dimension — drum integrity, spill risk and correct PPE. Our teams are briefed on site rules before they touch a load.",
        ],
        bullets: [
          "Correct stacking patterns for bags, drums and cartons",
          "Load stability and weight distribution awareness",
          "Damage and spill prevention during transfer",
          "PPE compliance for chemical and pharma consignments",
          "Faster vehicle turnaround and lower detention cost",
        ],
      },
      {
        heading: "Quality and packaging inspection",
        paragraphs: [
          "Dispatch errors are expensive to correct once a consignment has left the gate. We supply packaging and quality inspectors who verify count, labelling, packing integrity and documentation before loading, working to the checklist your dispatch team defines.",
        ],
      },
      {
        heading: "Commercial model",
        paragraphs: [
          "Loading and unloading is quoted per tonne, which suits variable inbound and outbound volumes. Where material handling is continuous — a store team or a dispatch bay team working every shift — we quote per 8-hour or 12-hour shift instead, using the unskilled or semi-skilled labour rate as applicable.",
          "All invoices carry 18% GST shown separately, and PF and ESIC compliance for the deployed workers is handled by Shivraj Enterprise with monthly challans provided.",
        ],
      },
    ],
    rateFilter: ["Loading / Unloading", "Unskilled Labour", "Semi-Skilled Labour"],
    faqs: [
      {
        question: "How are loading and unloading services charged?",
        answer:
          "Loading and unloading is normally charged per tonne handled, so your cost tracks actual volume. Continuous in-plant material handling teams can instead be supplied on a per-shift basis at the unskilled or semi-skilled labour rate.",
      },
      {
        question: "Do you handle drums, bags and palletised goods?",
        answer:
          "Yes. Our gangs handle bagged, drummed, palletised, cartoned and loose material, with stacking and load-stability practices appropriate to each format.",
      },
      {
        question: "Can you provide labour at short notice for a large consignment?",
        answer:
          "Yes. Loading and unloading gangs are among the fastest categories to mobilise. Share the expected tonnage, timing and material type and we will confirm availability.",
      },
      {
        question: "Do you supply packaging and quality inspectors?",
        answer:
          "Yes. We supply inspectors who verify count, labelling, packing integrity and dispatch documentation against your checklist before the consignment is loaded.",
      },
      {
        question: "Is PF and ESIC covered for loading and unloading workers?",
        answer:
          "Yes. Workers deployed on loading, unloading and material handling are our employees, and PF and ESIC contributions are deducted and deposited by Shivraj Enterprise with monthly challans shared.",
      },
      {
        question: "Do you work night shifts and weekends for dispatch peaks?",
        answer:
          "Yes. We deploy across night shifts, weekends and month-end dispatch peaks by prior arrangement.",
      },
    ],
    related: [
      "unskilled-labour",
      "semi-skilled-labour",
      "manpower-supply-services",
    ],
  },
  {
    slug: "skilled-operator-labour",
    navLabel: "Skilled (Operator) Labour",
    cardBlurb:
      "Machine and process operators for engineering, chemical and pharma lines on 8-hour or 12-hour shifts.",
    metaTitle: "Skilled Operator Labour Supply in Vapi GIDC",
    metaDescription:
      "Skilled manpower supply in Vapi GIDC — machine and process operators on 8-hour or 12-hour shifts, with PF, ESIC and GST compliance. Transparent per-shift rates.",
    h1: "Skilled Operator Labour Supply in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Machine operators, process operators and line technicians supplied on 8-hour or 12-hour shifts, screened for the equipment and industry you run.",
    intro: [
      "Skilled operator labour is the category where a wrong hire costs the most. An operator who does not know the machine slows the line, damages tooling and creates rejections. Shivraj Enterprise supplies screened skilled operators to engineering, chemical, pharmaceutical and packaging units across Vapi GIDC and nearby industrial areas.",
      "Skilled labour is charged per 8-hour or per 12-hour shift, with rates published on the rate card below. As with all our deployments, the workers remain our employees and PF, ESIC and wage compliance is handled by us.",
    ],
    sections: [
      {
        heading: "Operator roles we supply",
        bullets: [
          "Machine operators for conventional and semi-automatic machines",
          "CNC, press, lathe and drilling machine operators for engineering units",
          "Process operators for chemical batching, mixing and reactor support",
          "Pharmaceutical line operators for granulation, compression and packing lines",
          "Packaging machine operators for filling, sealing and labelling lines",
          "Utility operators supporting boilers, compressors and ETP under your engineers",
        ],
      },
      {
        heading: "How we screen skilled workers",
        paragraphs: [
          "Skill claims are easy to make and expensive to accept at face value. We verify prior work history and machine familiarity before deployment, and match the candidate to the specific equipment family and industry the client runs rather than to a generic 'operator' label.",
        ],
        bullets: [
          "Verification of prior employment and machine experience",
          "Matching to the equipment family and industry of the client site",
          "Documentation and ID verification before onboarding",
          "Site induction and SOP briefing before the first shift",
          "Replacement if performance does not meet the agreed standard",
        ],
      },
      {
        heading: "Shift patterns and rates",
        paragraphs: [
          "Skilled operators are supplied on both 8-hour and 12-hour shifts. The 12-hour rate is quoted separately rather than derived from the 8-hour rate, because overtime and statutory treatment differ. Current indicative rates for skilled operator labour are shown in the rate table on this page.",
          "Rates are indicative and move with government wage notifications, skill level and site conditions. For an exact quote against your role definition, headcount and shift pattern, contact us with the requirement.",
        ],
      },
      {
        heading: "Compliance on skilled labour deployments",
        paragraphs: [
          "Skilled operators supplied by Shivraj Enterprise are our employees. We deduct and deposit PF and ESIC, maintain the wage register, and share monthly challans with the client. Invoices carry 18% GST shown separately, and TDS under Section 194C applies to the contract at the applicable rate.",
        ],
      },
    ],
    rateFilter: ["Skilled (Operator) Labour", "Fitter Labour"],
    faqs: [
      {
        question: "What is skilled manpower supply?",
        answer:
          "Skilled manpower supply means providing workers who hold a specific trade or machine competence — such as machine operators, process operators or fitters — on a contract basis, with the supplier handling employment, payroll and statutory compliance.",
      },
      {
        question: "What is the rate for skilled operator labour?",
        answer:
          "Skilled operator labour is charged per 8-hour or per 12-hour shift. Current indicative rates for both patterns are shown in the rate table on this page and are subject to wage notifications and site requirements.",
      },
      {
        question: "How do you verify an operator's skill level?",
        answer:
          "We verify prior employment and machine experience, and match the candidate to the specific equipment family and industry of the client site. If performance does not meet the agreed standard, we replace the worker.",
      },
      {
        question: "Can you supply operators for chemical and pharma processes?",
        answer:
          "Yes. We supply process operators for chemical batching and reactor support, and line operators for pharmaceutical granulation, compression and packing lines, briefed on the site's SOP and PPE requirements.",
      },
      {
        question: "Do you supply fitters as well as operators?",
        answer:
          "Yes. Fitter labour is a separate category on our rate card, charged per 8-hour shift, for mechanical maintenance and plant upkeep work.",
      },
      {
        question: "Are supplied operators covered under PF and ESIC?",
        answer:
          "Yes. Skilled operators deployed by us are our employees, and we deduct and deposit PF and ESIC contributions, providing monthly challans as compliance proof.",
      },
    ],
    related: ["fitter-labour", "semi-skilled-labour", "manpower-supply-services"],
  },
  {
    slug: "semi-skilled-labour",
    navLabel: "Semi-Skilled Labour",
    cardBlurb:
      "Line workers, packers, batch handlers and material feeders for production support on both shift patterns.",
    metaTitle: "Semi-Skilled Labour Supply in Vapi GIDC | Shivraj",
    metaDescription:
      "Semi-skilled labour supply in Vapi GIDC, Sarigam, Silvassa & Daman — line workers, packers and machine assistants on 8-hour or 12-hour shifts, fully compliant.",
    h1: "Semi-Skilled Labour Supply in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Line workers, packers, machine assistants and material feeders supplied on 8-hour or 12-hour shifts with full statutory compliance.",
    intro: [
      "Semi-skilled labour is the backbone of most production lines in Vapi GIDC. These are workers who are not certified tradesmen but who have real line experience — they know how a packing line runs, how to feed a machine safely, and how to keep pace with a shift target. Shivraj Enterprise supplies this category to engineering, chemical, pharmaceutical, packaging and logistics units.",
      "Semi-skilled workers are supplied on both 8-hour and 12-hour shifts, at the indicative rates published on the rate card below, with PF, ESIC and wage compliance handled by us.",
    ],
    sections: [
      {
        heading: "Typical semi-skilled roles",
        bullets: [
          "Production line workers on assembly, filling and packing lines",
          "Machine assistants supporting a skilled operator",
          "Batch handlers and material feeders for process plants",
          "Packers, cartoners and secondary packaging staff",
          "Store assistants handling receipt, binning and issue",
          "Dispatch helpers preparing consignments for loading",
        ],
      },
      {
        heading: "When semi-skilled is the right category",
        paragraphs: [
          "Many plants over-specify their manpower requirement and pay a skilled rate for work that a trained semi-skilled worker performs equally well. The practical test is whether the role requires independent machine judgement. If the worker is running the machine and making process decisions, that is skilled. If the worker is feeding, assisting, packing or moving under instruction, semi-skilled is the correct and more economical category.",
          "Getting this split right across a shift roster is one of the fastest ways to reduce manpower cost without reducing output. We are happy to review your role list and recommend the appropriate category mix.",
        ],
      },
      {
        heading: "Training and site readiness",
        bullets: [
          "Site induction and safety briefing before the first shift",
          "PPE issue and compliance as required by the site",
          "Line-specific briefing by the shift supervisor",
          "Attendance and output tracked by our on-site supervisor",
          "Progression path to skilled category for workers who develop machine competence",
        ],
      },
      {
        heading: "Rates and compliance",
        paragraphs: [
          "Semi-skilled labour is charged per 8-hour or per 12-hour shift. Current indicative rates for both patterns appear in the rate table on this page, and are subject to change with government wage notifications and site conditions.",
          "PF and ESIC contributions are deducted and deposited by Shivraj Enterprise, and monthly challans are shared with the client. Invoices carry 18% GST shown separately.",
        ],
      },
    ],
    rateFilter: ["Semi-Skilled Labour", "Unskilled Labour"],
    faqs: [
      {
        question: "What is semi-skilled labour?",
        answer:
          "Semi-skilled labour refers to workers with practical line experience who work under instruction or alongside a skilled operator — such as packers, machine assistants, batch handlers and material feeders — without holding a formal trade certification.",
      },
      {
        question: "How is semi-skilled labour priced compared with skilled labour?",
        answer:
          "Semi-skilled labour is charged at a lower per-shift rate than skilled operator labour. Both 8-hour and 12-hour rates are published on the rate card on this page.",
      },
      {
        question: "How do I decide between skilled and semi-skilled for a role?",
        answer:
          "If the role requires independent machine judgement and process decisions, it is skilled. If the worker feeds, assists, packs or moves material under instruction, semi-skilled is the appropriate and more economical category.",
      },
      {
        question: "Can semi-skilled workers be upgraded to skilled roles?",
        answer:
          "Yes. Workers who develop machine competence on site can be moved into the skilled category by agreement, with the rate adjusted accordingly.",
      },
      {
        question: "Are semi-skilled workers covered under PF and ESIC?",
        answer:
          "Yes. All semi-skilled workers deployed by Shivraj Enterprise are our employees, and PF and ESIC contributions are deducted and deposited with monthly challans provided.",
      },
      {
        question: "Do you supply semi-skilled workers for night shifts?",
        answer:
          "Yes. We supply across all three 8-hour shifts and both 12-hour shifts, including night shifts and weekend working.",
      },
    ],
    related: ["skilled-operator-labour", "unskilled-labour", "manpower-supply-services"],
  },
  {
    slug: "unskilled-labour",
    navLabel: "Unskilled Labour",
    cardBlurb:
      "General helpers for production support, material movement, cleaning support and site work.",
    metaTitle: "Unskilled Labour Supply in Vapi GIDC | Shivraj",
    metaDescription:
      "Unskilled labour and helper supply in Vapi GIDC, Sarigam, Silvassa & Daman. General production support on 8-hour or 12-hour shifts with PF, ESIC and GST compliance.",
    h1: "Unskilled Labour & Helper Supply in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "General helpers for production support, material movement, cleaning support and site work — mobilised quickly, deployed compliantly.",
    intro: [
      "Unskilled labour covers the general helper roles every plant depends on: moving material, supporting production, keeping work areas clear and covering the tasks that do not need a trade skill but do need reliable attendance. Shivraj Enterprise supplies helpers to factories, warehouses and commercial sites across Vapi GIDC, Sarigam, Umbergaon, Silvassa and Daman.",
      "This is the fastest category to mobilise. For most requirements we can put screened helpers on site within 24 to 48 hours, on 8-hour or 12-hour shifts, at the indicative rates shown on the rate card below.",
    ],
    sections: [
      {
        heading: "Where helpers are deployed",
        bullets: [
          "Production support — feeding, clearing and staging material at the line",
          "Internal material movement between stores, production and dispatch",
          "Cleaning support alongside the housekeeping team",
          "Scrap handling, waste segregation support and yard clearance",
          "Loading and unloading support alongside the dispatch gang",
          "General site work during shutdowns, maintenance and turnaround",
        ],
      },
      {
        heading: "Attendance reliability",
        paragraphs: [
          "In the unskilled category the practical problem is rarely capability — it is attendance. A helper who does not report leaves a gap that someone else on the line has to absorb, and repeated absence quietly reduces output all month.",
          "We manage this with a supervisor who owns daily attendance, a backup pool for high-volume categories, and replacement of workers with persistent absence. Attendance records are shared with your plant contact and reconciled against the monthly invoice.",
        ],
      },
      {
        heading: "Safety for unskilled workers",
        bullets: [
          "Site induction and hazard briefing before the first shift",
          "PPE issue and enforcement as required by the site",
          "Clear demarcation of restricted areas the worker may not enter",
          "Manual handling guidance to reduce injury risk",
          "Escalation route to the site supervisor for unsafe conditions",
        ],
      },
      {
        heading: "Rates and statutory cover",
        paragraphs: [
          "Unskilled labour is charged per 8-hour or per 12-hour shift, with current indicative rates shown on this page. Rates move with Gujarat minimum wage notifications, so the quoted rate is confirmed at contract stage and revised when notifications change.",
          "Helpers deployed by us are our employees. PF and ESIC contributions are deducted and deposited by Shivraj Enterprise, with monthly challans provided as compliance proof to the principal employer.",
        ],
      },
    ],
    rateFilter: ["Unskilled Labour", "Loading / Unloading"],
    faqs: [
      {
        question: "What work do unskilled labourers do?",
        answer:
          "Unskilled labourers or helpers perform general support work — moving material, feeding and clearing production lines, cleaning support, scrap handling, loading support and general site work during shutdowns.",
      },
      {
        question: "How fast can helpers be deployed?",
        answer:
          "Unskilled helpers are the fastest category to mobilise. For most requirements we can place screened workers on site within 24 to 48 hours.",
      },
      {
        question: "What is the rate for unskilled labour?",
        answer:
          "Unskilled labour is charged per 8-hour or per 12-hour shift. Current indicative rates for both patterns are published in the rate table on this page and move with Gujarat minimum wage notifications.",
      },
      {
        question: "How do you handle absenteeism among helpers?",
        answer:
          "An on-site supervisor owns daily attendance, a backup pool covers high-volume categories, and workers with persistent absence are replaced. Attendance records are shared and reconciled against the monthly invoice.",
      },
      {
        question: "Are unskilled workers covered under minimum wage rules?",
        answer:
          "Yes. Wages for unskilled workers are paid in line with applicable Gujarat minimum wage notifications, and the wage register is available to the client as part of the monthly compliance pack.",
      },
      {
        question: "Can helpers be supplied for a short shutdown only?",
        answer:
          "Yes. We regularly supply helper teams for shutdowns, turnarounds and short-term peaks, with mobilisation and demobilisation agreed in advance.",
      },
    ],
    related: ["semi-skilled-labour", "loading-unloading-material-handling", "industrial-housekeeping-services"],
  },
  {
    slug: "supervisor-manpower",
    navLabel: "Supervisor Manpower",
    cardBlurb:
      "Shift supervisors who own attendance, discipline, safety compliance and daily reporting on your site.",
    metaTitle: "Supervisor Manpower Supply in Vapi GIDC | Shivraj",
    metaDescription:
      "Supervisor manpower supply in Vapi GIDC, Sarigam, Silvassa & Daman. Shift supervisors managing attendance, discipline, safety and reporting on a monthly rate.",
    h1: "Supervisor Manpower Supply in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Experienced shift supervisors who manage your contract workforce on site — attendance, discipline, safety compliance and daily reporting.",
    intro: [
      "A contract workforce without supervision drifts. Attendance slips, discipline weakens, safety rules get treated as optional, and the client's own production staff end up spending their day managing labour instead of output. Shivraj Enterprise supplies experienced supervisors who own that layer for you.",
      "Supervisors are supplied on a monthly rate rather than a per-shift rate, reflecting the continuity the role needs. The rate for supervisors is published on the rate card below.",
    ],
    sections: [
      {
        heading: "What a supervisor owns on site",
        bullets: [
          "Daily attendance capture and reporting to your nominated plant contact",
          "Shift allocation, break rotation and coverage of gaps",
          "Discipline, conduct and adherence to site rules",
          "PPE compliance and escalation of unsafe conditions",
          "Coordination with your production or store team on daily priorities",
          "First-line handling of worker grievances and wage queries",
          "Inputs to the monthly wage register and invoice reconciliation",
        ],
      },
      {
        heading: "Why a dedicated supervisor pays for itself",
        paragraphs: [
          "The cost of one supervisor is usually recovered from the absenteeism and idle time they prevent. When nobody owns attendance, a shift that is short by three workers is discovered at the line rather than at the gate, and by then the output is already lost.",
          "A supervisor also protects the client on compliance. PPE discipline, restricted-area control and correct record keeping are all easier to demonstrate in an audit when a single person on site is accountable for them every shift.",
        ],
      },
      {
        heading: "Supervisor profiles we supply",
        bullets: [
          "Production shift supervisors for engineering and manufacturing lines",
          "Process shift supervisors familiar with chemical and pharma plant discipline",
          "Housekeeping supervisors managing multi-area cleaning teams",
          "Store and dispatch supervisors overseeing material movement and loading gangs",
        ],
      },
      {
        heading: "Reporting and escalation",
        paragraphs: [
          "The supervisor reports daily to your nominated plant contact on headcount deployed, absentees, replacements arranged and any incident or safety observation. Escalation beyond the supervisor comes to our office directly, so an issue never has to be chased through individual workers.",
          "Supervisors supplied by us are our employees. PF, ESIC and wage compliance is handled by Shivraj Enterprise, and the monthly invoice carries 18% GST shown separately.",
        ],
      },
    ],
    rateFilter: ["Supervisor"],
    faqs: [
      {
        question: "What does a supplied supervisor do?",
        answer:
          "A supervisor manages the contract workforce on your site — daily attendance, shift allocation, discipline, PPE compliance, coordination with your production team, first-line grievance handling and daily reporting to your nominated contact.",
      },
      {
        question: "How is a supervisor charged?",
        answer:
          "Supervisors are charged on a monthly rate rather than a per-shift rate, because the role needs continuity. The current indicative monthly rate is shown in the rate table on this page.",
      },
      {
        question: "Do we need a supervisor if we already have a plant shift in-charge?",
        answer:
          "Your shift in-charge directs production. A contract supervisor owns the workforce administration — attendance, discipline, replacements and compliance records — so your in-charge is not spending the shift on labour management.",
      },
      {
        question: "Can one supervisor cover multiple areas?",
        answer:
          "Yes, within reason. Coverage depends on headcount, plant layout and shift pattern. We recommend a span after reviewing your site so supervision does not become nominal.",
      },
      {
        question: "Do you supply housekeeping supervisors separately?",
        answer:
          "Yes. Housekeeping supervisors managing multi-area cleaning teams are supplied as a distinct profile, often alongside a housekeeping manpower contract.",
      },
      {
        question: "Who does the supervisor report to?",
        answer:
          "The supervisor reports daily to your nominated plant contact on headcount, absentees, replacements and safety observations, with escalation available directly to the Shivraj Enterprise office.",
      },
    ],
    related: ["manpower-outsourcing-services", "manpower-supply-services", "skilled-operator-labour"],
  },
  {
    slug: "fitter-labour",
    navLabel: "Fitter Labour",
    cardBlurb:
      "Mechanical fitters and maintenance helpers for plant upkeep, breakdown support and shutdown work.",
    metaTitle: "Fitter Labour Supply in Vapi GIDC | Shivraj Enterprise",
    metaDescription:
      "Fitter labour supply in Vapi GIDC, Sarigam, Silvassa & Daman. Mechanical fitters for maintenance, breakdown support and shutdowns, charged per 8-hour shift.",
    h1: "Fitter Labour Supply in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon",
    heroSubtitle:
      "Mechanical fitters and maintenance helpers for routine plant upkeep, breakdown support and shutdown work — supplied per 8-hour shift.",
    intro: [
      "Fitter labour keeps a plant running between planned maintenance windows. Shivraj Enterprise supplies mechanical fitters and maintenance helpers to engineering, chemical, pharmaceutical and packaging units across Vapi GIDC and the surrounding industrial belt, working under your maintenance engineers.",
      "Fitters are charged per 8-hour shift at the indicative rate published on the rate card below, and can be deployed on a continuous basis or for a defined shutdown period.",
    ],
    sections: [
      {
        heading: "Work fitters typically cover",
        bullets: [
          "Routine preventive maintenance on pumps, valves, gearboxes and conveyors",
          "Breakdown support and assistance during line stoppages",
          "Assembly, dismantling and alignment work under your engineers",
          "Pipeline, fitting and support-structure work",
          "Shutdown and turnaround support with augmented headcount",
          "Maintenance helper support for your permanent maintenance team",
        ],
      },
      {
        heading: "Continuous deployment vs shutdown augmentation",
        paragraphs: [
          "Two patterns are common. Some plants keep one or two contract fitters on the roster permanently to absorb routine maintenance load without adding permanent headcount. Others keep a lean permanent team and bring in additional fitters for shutdowns, turnarounds and annual maintenance.",
          "Both work. Continuous deployment gives you familiarity with the plant, which reduces the briefing overhead each time. Shutdown augmentation gives you flexibility at a lower annual cost. Tell us the pattern you need and we will plan availability around your maintenance calendar.",
        ],
      },
      {
        heading: "Safety on maintenance work",
        paragraphs: [
          "Maintenance work carries higher risk than routine production: energy isolation, working at height, confined spaces and hot work all appear in a normal maintenance week. Contract fitters work strictly under your site's permit-to-work system and your engineers' direction.",
        ],
        bullets: [
          "Work performed only under the site's permit-to-work system",
          "Compliance with isolation and lock-out procedures defined by the site",
          "PPE appropriate to the task issued and enforced",
          "No unauthorised hot work, height work or confined-space entry",
          "Incident and near-miss reporting through the site supervisor",
        ],
      },
      {
        heading: "Rates and compliance",
        paragraphs: [
          "Fitter labour is charged per 8-hour shift, with the current indicative rate shown in the rate table on this page. Shutdown deployments with extended hours are quoted separately.",
          "Fitters supplied by us are our employees. PF and ESIC contributions are deducted and deposited by Shivraj Enterprise and evidenced by monthly challans, and invoices carry 18% GST shown separately.",
        ],
      },
    ],
    rateFilter: ["Fitter Labour", "Skilled (Operator) Labour"],
    faqs: [
      {
        question: "What does fitter labour cover?",
        answer:
          "Fitter labour covers mechanical maintenance work — preventive maintenance on pumps, valves, gearboxes and conveyors, breakdown support, assembly and alignment work, pipeline and fitting work, and shutdown support under your maintenance engineers.",
      },
      {
        question: "How is fitter labour charged?",
        answer:
          "Fitter labour is charged per 8-hour shift. The current indicative rate is shown in the rate table on this page. Extended-hour shutdown deployments are quoted separately.",
      },
      {
        question: "Can you supply extra fitters for a plant shutdown?",
        answer:
          "Yes. Shutdown and turnaround augmentation is a common requirement. Share your maintenance calendar and the headcount you need, and we will plan availability in advance.",
      },
      {
        question: "Do contract fitters work under our permit-to-work system?",
        answer:
          "Yes. Contract fitters work strictly under your site's permit-to-work system, isolation and lock-out procedures, and the direction of your maintenance engineers.",
      },
      {
        question: "Do you supply maintenance helpers along with fitters?",
        answer:
          "Yes. Maintenance helpers are supplied alongside fitters at the semi-skilled or unskilled rate, depending on the work assigned.",
      },
      {
        question: "Are fitters covered under PF and ESIC?",
        answer:
          "Yes. Fitters deployed by Shivraj Enterprise are our employees, and PF and ESIC contributions are deducted and deposited with monthly challans shared with the client.",
      },
    ],
    related: ["skilled-operator-labour", "manpower-supply-services", "supervisor-manpower"],
  },
];

export const getServicePage = (slug: string) =>
  servicePages.find((p) => p.slug === slug);
