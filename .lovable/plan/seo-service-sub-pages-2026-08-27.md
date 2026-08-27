# SEO Service Sub-Pages

Build dedicated, deeply-optimised pages under `/services/<slug>` so each service can rank on its own, instead of everything competing on one `/services` page. Pages will be created one at a time, in the order below, so you can review each before the next.

## Realistic ranking expectation

Keyword data (India) for these terms shows low competition and low difficulty:

- manpower outsourcing services — 390/mo, difficulty 15/100
- loading and unloading services — 480/mo, difficulty 28/100
- industrial housekeeping services — 20/mo, difficulty 0/100
- skilled manpower supply — 30/mo, difficulty 0/100

Local variants ("manpower supply services in Vapi", "contract labour supply Gujarat") have low national volume but very little competition — these are the ones where top-3 ranking is realistic within a few months. Broad national terms will take longer and depend on backlinks and Google Business activity, which are outside the site itself. So: strong chance of ranking top for Vapi/Silvassa/Daman/Sarigam/Umbergaon intent; no guarantee on national head terms.

## Pages to build (in this order)

1. `/services/manpower-supply-services` — core money page
2. `/services/manpower-outsourcing-services`
3. `/services/industrial-housekeeping-services`
4. `/services/loading-unloading-material-handling`
5. `/services/skilled-operator-labour`
6. `/services/semi-skilled-labour`
7. `/services/unskilled-labour`
8. `/services/supervisor-manpower`
9. `/services/fitter-labour`

Pages 5–9 mirror the rate-card service types and target role-specific searches.

## What each page contains (1200–1800 words)

- H1 with primary keyword + region ("… in Vapi GIDC, Silvassa, Daman, Sarigam & Umbergaon")
- Intro answering the search intent in the first 100 words
- What the service covers / who it is for (industries: engineering, pharma, chemical, packaging, logistics)
- Roles and shift options (8-hr / 12-hr), headcount scalability
- Rate table pulled live from the existing rate card (filtered to the relevant role where applicable)
- Statutory compliance block (PF, ESIC, CLRA, GST 18%, TDS 194C) with links to the existing compliance guides
- Deployment process (requirement → screening → mobilisation in 24–48 hrs → supervision → monthly compliance proof)
- Service-area list of Vapi GIDC Phases 1–4, Chala, Balitha, Salvav, Chharwada + Silvassa, Daman, Sarigam, Umbergaon
- 6–8 FAQs unique per page (no duplication across pages)
- Contact CTA: Get Quote / Call / WhatsApp
- Internal links to related service pages, `/locations`, `/terms`, and relevant blog guides

## Technical SEO

- One route per page in `src/App.tsx`, all above the catch-all
- Per-page `<Helmet>`: title under 60 chars, description under 160 chars, self-referencing canonical, og:title/description/url
- JSON-LD per page: `Service` + `BreadcrumbList` + `FAQPage`
- Breadcrumbs UI (Home → Services → page) using the existing `Breadcrumbs` component
- `/services` gets a "Our Services" card grid linking to all sub-pages (hub-and-spoke internal linking)
- Every new URL added to `public/sitemap.xml`; `robots.txt` unchanged (already allows `/`)

## Reusable structure

A shared `ServicePageShell` component holds the layout (hero, sections, rate table, FAQ, CTA, breadcrumbs, schema), and each page supplies its own content object. Keeps the 9 pages consistent and fast to add, while all copy stays unique per page.

## Notes

- Copy will only use facts already on the site (rates, service areas, compliance details, 24–48 hr mobilisation). No invented certifications, client counts, or testimonials — tell me if you want specific credentials added.
- Styling reuses the existing `shivraj-*` blue/white tokens and current section patterns.

Confirm and I will build page 1 (`/services/manpower-supply-services`) first.
