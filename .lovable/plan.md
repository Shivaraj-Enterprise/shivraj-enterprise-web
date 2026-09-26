# Fix Calculator Scrolling and Print/PDF

## Goal
Make every calculator field easy to reach while entering data, and produce a clean, complete costing document when using **Print / PDF**.

## Changes

### 1. Make the details panel fully scrollable
- Keep **Enter your details** visible beside the live calculation on larger screens.
- Limit the panel to the available screen height and give it its own vertical scrolling when its fields are taller than the screen.
- Keep normal page scrolling on phones so fields are not trapped inside a small scrolling area.
- Ensure the last controls, including advanced rates, Reset, and Print / PDF, remain reachable.

### 2. Create a complete print/PDF report
- Add a print-only heading with the company name, report title, and generated date.
- Include a compact **Entered details** section showing basic salary, D.A., overtime choice, workers, working days, advanced rates, and every custom charge.
- Print the daily and monthly totals, cost breakdown, and full costing table without clipping rows or columns.
- Use a print-friendly single-column A4 layout with smaller spacing, clear borders, repeated table headings, and sensible page breaks.
- Preserve colors only where they aid readability; keep the document usable when printed in grayscale.

### 3. Remove website-only elements from the document
- Hide the website header, footer, contact call-to-action, and AI assistant—including its floating button and open window—from Print / PDF.
- Keep explanatory cards, FAQs, and other long website content out of the costing document so the PDF stays focused on the entered values and calculation.

### 4. Verify the result
- Test short and long forms, including advanced rates and multiple custom charges.
- Check calculator scrolling on desktop and mobile widths.
- Preview the printed result as A4 and confirm no content is covered, trimmed, or split incorrectly.

## Technical details
- Add calculator-specific print sections and print utility classes in the calculator page.
- Add scoped `@media print` rules for A4 sizing, page breaks, table headers, and visibility.
- Mark shared layout elements and the sales assistant as non-printing without affecting their normal appearance.
