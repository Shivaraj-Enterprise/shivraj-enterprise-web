# Careers page: "We're Hiring" with CV upload, WhatsApp and email

Inspired by how large employers (Tata, L&T, Amazon, Adecco, TeamLease) run their careers pages: a bold hiring banner, job cards grouped by category, benefits strip, a simple apply form with CV upload, and quick apply via WhatsApp or email. Your uploaded poster is used as the page's visual guide and shown as a downloadable/shareable poster.

## New page: /careers
1. **Banner** — "We're Hiring" in your brand blue + yellow, "Your Skills, Our Strength", buttons: Apply Now, Apply on WhatsApp, Email your CV.
2. **Filter by skill level** — tabs: All / Skilled / Semi-Skilled / Unskilled.
3. **Job openings cards** (from your poster plus unskilled roles):
   - Skilled: Electrician, Panel Board Wiring, Fiber Optic Splicing, Plumber, Fitter, Turner, Welder, Machinist, Electrician (ITI), Operator, Supervisor
   - Semi-skilled: Cable Installation, Network Setup helper, Pipe fitting helper, Machine helper, Quality & Packaging Inspector
   - Unskilled: Helper, Loading / Unloading, Material Handling, Industrial Housekeeping staff
   Each card: role, skill level badge, location "Vapi GIDC & nearby", "ITI preferred" where relevant, and an "Apply" button that fills the form with that role.
4. **Benefits strip** — Attractive salary, PF & ESI benefits, Safe work environment, Long-term growth.
5. **How hiring works** — 4 steps: Apply → Phone call → Document check & interview → Joining (usually quick).
6. **Apply form** — name, phone, WhatsApp (same as phone checkbox), email (optional, since many workers don't use email), role, skill level, experience (years), ITI/qualification, current location, message, **CV upload (PDF/Word/photo, max 5 MB, optional)**.
7. **Three ways to apply** side by side: Form · WhatsApp (pre-filled message: "Hello, I want to apply for [role]…" — CV can be attached in WhatsApp) · Email (pre-filled subject to shivrajenterprise1234@gmail.com).
8. **FAQ** — Do I need ITI? Is there any fee? (answer: no fee) What documents to bring? Is PF/ESI given? — with FAQ search markup.
9. **Poster section** — your poster image with a Download button.

## What you receive
- Every application is saved in your database and shown in a new **Job Applications** list in the admin area (with CV download link, filter by role / skill level).
- An email to shivrajenterprise1234@gmail.com for every application, using your existing email setup, with a secure CV link.

## Site links
- "Careers" added to the header, mobile menu and footer; the Contact page's "Job Application" option links to /careers.
- Added to sitemap, sent to Bing (IndexNow), and AI chat knowledge so the assistant can guide job seekers.
- Job posting search markup (JobPosting) so roles can appear in Google Jobs.

## Technical details
- Table `job_applications` (RLS on, admin read only, inserts only via edge function using service role).
- Private storage bucket `job-cvs`; upload via edge function `job-apply` (validates type/size, zod validation, rate limit, stores row, sends Resend email with 7-day signed CV URL).
- Admin page `src/pages/AdminJobApplications.tsx` generating short signed URLs for CV download.
- Poster uploaded as a Lovable asset; page `src/pages/Careers.tsx`, roles data in `src/data/jobRoles.ts`.
- Verify: submit a test application with CV, confirm row + email log, delete test row.
