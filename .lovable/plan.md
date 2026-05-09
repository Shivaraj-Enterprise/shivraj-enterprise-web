## Goal

Refresh the website content using the official **Shivraj Enterprise Company Quotation** PDF so the site reflects the company's real services, rates, terms, credentials, testimonials, and contact details.

## Pages to update

### 1. Home (`src/pages/Index.tsx`)
- Update hero copy to position Shivraj as a manpower **and housekeeping** solutions partner (10+ years).
- Replace the 3 service cards with the real service categories: **Manpower Outsourcing**, **Housekeeping Solutions**, **Auxiliary Services** (loading/unloading, material handling, quality & packaging inspectors).
- Add a "Why Choose Us" strip (Proven Experience, Quality & Reliability, Full Compliance, Skilled & Flexible Workforce, Continuous Training).

### 2. About (`src/pages/About.tsx`)
- Rewrite "Our Story" using the PDF's About Us text (industries: Engineering, Pharmaceuticals, Chemicals, Packaging).
- Add a new **Licenses & Registrations** section:
  - PAN: AERPY4658M
  - GSTIN: 24AERPY4658M1ZF
  - PF Reg: 1448586
  - ESIC Reg: 39000538650000300
  - Labour Law Compliance Certificates
- Update "Why Choose Us" bullets to match the PDF.

### 3. Services (`src/pages/Services.tsx`)
Restructure into the PDF's actual offering:
- **Core Services**: Manpower Outsourcing (skilled / semi-skilled / unskilled), Housekeeping (Industrial, Commercial, Event).
- **Auxiliary Services**: Loading & Unloading, Material Handling & Dispatch, Quality & Packaging Inspectors.
- Add a new **Rate Card** section (table) with the PDF's pricing:

```text
Service              8 hrs    12 hrs
Supervisor           ₹25,000/month
Skilled (Operator)   ₹600     ₹1,300
Semi-Skilled         ₹550     ₹1,020
Unskilled            ₹502     ₹800
Housekeeping         ₹620     —
Fitter               ₹1,100   —
Loading/Unloading    ₹200 / Tonne
```
With a note that rates are indicative and subject to change.

### 4. New page: Terms & Conditions (`src/pages/Terms.tsx`)
Add a route `/terms` (linked from Footer) covering the PDF's General Terms & Conditions and Statutory Obligations: Work Order, Labour Licence, Supervisor ratio, Safety Equipment, Uniform, Leave Policy, Travel Allowance, PF (12% / 13%), ESIC (0.75% / 3.75%), TDS, Bonus 8.33% + 6% leave, **Service Charge 12%**, Overtime (2x), Payment terms (bill by month-end, paid by 7th), Medical Assistance, Notice (1 month), Workman Compensation 2%, HRA & Conveyance, Correspondence address.

### 5. New section/page: Testimonials
Add the four testimonials from the PDF (Aurorium India, Vertellus Specialty, Micro Orgo Chem, Anjali Mehta) — either as a new section on Home or a small `Testimonials` block on About.

### 6. Contact (`src/components/contact/ContactInformation.tsx` + Footer)
- Update **Location** to the full address: *Plot No. 228, A/303, Ved Vihar, Near Oswal Samaj Hall, Chharwada, Vapi, Gujarat – 396191*.
- Verify phone (+91 9998498311) and email (shivrajenterprise1234@gmail.com) match — they already do.
- Update Footer address block to match.

### 7. Downloadable quotation
- Copy the uploaded PDF to `public/SHIVRAJ_Enterprise_Company_Profile.pdf`.
- Add a **"Download Company Profile"** button on Home (hero) and Services page.

## Out of scope
- No backend / contact form logic changes.
- No design system / theme changes — reuse existing `shivraj-*` tokens and section styles.
- No new dependencies.

## Technical notes
- All new sections use existing Tailwind tokens (`shivraj-50/100/600/800`, `section`, `section-title`).
- Rate Card rendered with shadcn `Table`.
- Add `/terms` route in `src/App.tsx` and a link in `src/components/Footer.tsx`.
