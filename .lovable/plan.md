# Local SEO: Add Vapi GIDC Locations to Headings & Content

## Goal
Boost local SEO by including Vapi GIDC area names and surrounding villages in actual headings (H1–H6) and visible content across the site.

## Changes

### 1. Home page (`src/pages/Index.tsx`)
- Update H1 to include location:
  - From: "Trusted Manpower & Housekeeping Solutions Partner"
  - To: **"Trusted Manpower & Housekeeping Services in Vapi GIDC, Gujarat"**
- Update hero subtitle to mention Vapi GIDC + nearby villages.
- Add a new section near the bottom titled (H2): **"Service Areas Across Vapi GIDC & Surrounding Villages"** containing:
  - Short paragraph about Vapi GIDC (Asia's largest industrial hub, 1,140 hectares, Phases 1–4, 1,500+ units across chemicals, pharma, engineering, packaging).
  - H3: **"Vapi GIDC Industrial Phases We Serve"** — list Phase 1 (GIDC Office Road), Phase 2 (Imran Nagar / Chala Road), Phase 3 (Chemical & Pharma hub), Phase 4 (large manufacturing units).
  - H3: **"Villages & Areas Covered Near Vapi"** — grid/list of: Ambheti, Balitha, Chala, Chandor, Chhiri, Karaya, Koparli, Morai, Mota Pondha, Namdha, Ozar, Pandor, Rata, Salvav, Vatar, Chanod, Chharwada, Dabhel, Dungra, Karvad, Chanvai.
  - H3: **"Pin Codes We Operate In"** — 396195, 396191, 396030, 396415, 396193, 396020.

### 2. About page (`src/pages/About.tsx`)
- Update H1: **"About Shivraj Enterprise – Manpower Supplier in Vapi GIDC"**
- Add a sentence in "Our Story" mentioning Vapi GIDC and surrounding villages.

### 3. Services page (`src/pages/Services.tsx`)
- Update H1: **"Manpower & Housekeeping Services in Vapi GIDC"**
- Add an H2 **"Industries We Serve in Vapi GIDC"** mentioning chemicals, pharmaceuticals, engineering, packaging — with reference to Phase 3 & 4 chemical/pharma cluster.

### 4. Contact page (`src/components/contact/PageHeader.tsx` + `ContactInformation.tsx`)
- Update H1: **"Contact Shivraj Enterprise – Vapi GIDC, Gujarat"**
- Expand existing "Our Service Areas" list to include all the villages above (Ambheti, Balitha, Chala, etc.) plus Vapi GIDC Phases 1–4.

### 5. SEO meta tags
- Update `index.html` `<title>` and `<meta name="description">` to include "Vapi GIDC" and key villages.
- Update `SchemaOrg.tsx` `areaServed` array to include all village names + Vapi GIDC phases.

### 6. Sitemap (optional)
- No new pages added — single landing strategy. (If you want dedicated pages per village/phase, that's a larger separate plan.)

## Out of scope
- Creating individual landing pages per village (can be a follow-up if you want max local SEO impact).
- Changing color scheme / layout.

## Notes
- All new content uses semantic `shivraj-*` tokens and existing layout components.
- Headings keep one H1 per page; the rest are H2/H3 for proper hierarchy.