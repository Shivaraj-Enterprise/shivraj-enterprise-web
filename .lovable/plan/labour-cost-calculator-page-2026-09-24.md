# Labour Cost Calculator page

A new public page at `/labour-cost-calculator` that turns the uploaded Mock Costing Table into an interactive calculator, with plain-language explanations.

## What the visitor sees
1. **Intro**: short explanation of what a manpower cost sheet is and why the price per worker is higher than the wage.
2. **Inputs panel** (editable, with sensible defaults from your sheet):
   - Basic salary per day (520), D.A. per day (200)
   - Overtime toggle (4 hours = half of a day's gross)
   - Number of workers (1), working days per month (26)
   - Advanced rates (collapsed): Leave 5%, PF 13%, ESIC 3.25%, Bonus 8.33%, Service charge 12%, CGST 9%, SGST 9%
   - "Reset to default" button
3. **Live cost table**, laid out like your sheet in 3 sections: Wages (A), Statutory charges (B), Service charge and GST, then Grand Total per day.
4. **Summary cards**: daily cost per worker, monthly cost per worker, monthly cost for all workers, and a simple bar showing wage vs statutory vs service vs GST share.
5. **"What each line means"**: short cards for Basic, D.A., Overtime, Leave, PF, ESIC, Bonus, Service charge, GST, in plain words.
6. **Good to know** (general Indian labour-law facts, with a note to confirm with a consultant): PF capped on 15,000 wage ceiling in many cases, ESIC applies only up to 21,000 gross monthly wage, bonus minimum 8.33% under Payment of Bonus Act, overtime paid at double rate under Factories Act, GST 18% on manpower supply, minimum wages differ by state and skill level.
7. **FAQ** (with FAQ schema) and CTA: "Get an exact quotation" (contact / WhatsApp) plus links to the GST & TDS and statutory compliance guides.
8. Print / download as PDF button (browser print).

## Formulas (same as your sheet)
```text
Gross = Basic + DA
OT = Gross / 2 (if on)
A = Gross + OT
Leave = Gross x 5%, PF = Gross x 13%, Bonus = Gross x 8.33%, ESIC = A x 3.25%
B = Leave + PF + ESIC + Bonus
Service = (A + B) x 12%
C = A + B + Service
Grand total/day = C + 9% CGST + 9% SGST
Monthly = daily x working days x workers
```

## Placement
- Link in header (Services dropdown + mobile menu), footer, and a button on the Services page.
- Added to the sitemap, SEO title/description, and the AI chat knowledge.

## Technical
- New `src/pages/LabourCostCalculator.tsx` using Layout, shadcn Input/Switch/Accordion, `shivraj-*` tokens; pure calculation in `src/lib/costing.ts`; route in `App.tsx`.
