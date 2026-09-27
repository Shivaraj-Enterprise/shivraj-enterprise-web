# Glass Elevation animation for the labour cost calculator

## Goal
Apply the selected Glass Elevation direction across the full calculator while keeping every calculation, control, mobile workflow, and Print / PDF report unchanged.

## Visual and motion changes
- Give the calculator page a restrained layered-depth treatment using the existing Shivraj blue-and-white palette.
- Animate the heading and calculator sections into view with short, staggered fade-and-rise transitions.
- Add subtle perspective lift, scale, border, and shadow changes to the input panel, total cards, breakdown, costing table, explanation cards, information panel, FAQs, and quotation panel.
- Make fields lift slightly on focus, buttons press inward, FAQ rows open smoothly, table rows respond gently, and the cost bar animate when values change.
- Give the main total stronger visual elevation so it remains the clearest result.
- Keep text, figures, and controls stable; avoid continuous floating, dramatic rotation, neon glow, and distracting movement.

## Accessibility and safeguards
- Disable nonessential movement for people who prefer reduced motion.
- Remove transforms, animation, blur, transparency, and decorative shadows from Print / PDF output.
- Keep keyboard focus clear and avoid motion that changes layout or obscures values.
- Use lighter effects on phones so scrolling and data entry stay smooth.

## Technical details
- Add reusable calculator-only elevation and reveal styles using semantic design tokens.
- Apply the styles to the existing calculator sections without changing calculation logic or content.
- Preserve the desktop scrollable input panel and normal mobile page scrolling.
- Verify the page at desktop and mobile sizes, test field/button/FAQ interactions, and regenerate the A4 report to confirm nothing is clipped or hidden.
