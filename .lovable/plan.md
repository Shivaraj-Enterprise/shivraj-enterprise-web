# Careers page: better colours and animation

## Colour theme (matches your poster: deep blue + yellow)
- **Banner:** a deeper navy-to-blue background with a soft animated glow and a faint grid pattern behind it, instead of the flat blue gradient. Yellow is used only as the highlight colour (the "Hiring!" word, the main button, small badges).
- **Consistent palette across the page:** sections alternate between white and a very light blue. The mixed green, yellow and blue boxes are replaced with one set of colours:
  - Skilled = blue badge, Semi-Skilled = amber badge, Unskilled = teal badge (softer, easier to tell apart)
  - The "Other ways to apply" cards get the same white card style, with only a coloured icon (WhatsApp stays green so people recognise it)
- **Job cards:** white cards with a thin top colour strip for their skill level, rounded icon tiles instead of plain emoji, and a cleaner "Apply" button.
- **Benefits strip:** icons sit inside round blue tiles, with a little more spacing.

## Animation
- **Banner:** the heading words fade in one by one, then the buttons slide up. The poster floats slowly with a gentle 3D tilt that follows your mouse.
- **Scroll reveal:** benefits, job cards, steps, form and FAQ fade and slide in as you scroll down, one after another.
- **Job cards:** lift and glow slightly on hover. Changing the Skilled / Semi-Skilled / Unskilled tab animates the cards smoothly in and out.
- **How hiring works:** a line connects steps 1 to 4 and draws itself across as it comes into view. The numbers pop in.
- **Buttons:** "Apply Now" has a soft pulse to draw attention. The WhatsApp button gives a small bounce on hover.
- **Success message:** the tick mark animates in after an application is sent.
- Visitors who turn off motion on their device see the page without these animations.

## Not changing
Job list, form fields, how applications are sent, and the email you receive.

## Technical details
- Only `src/pages/Careers.tsx` plus page-scoped styles under a `.careers-page` class in `src/index.css`, so no other page is affected.
- Reuse existing `BlurText`, `FadeContent`, `TiltedCard` and framer-motion `AnimatePresence` for tab changes; respect `useReducedMotion`.
- Replace hardcoded `text-white`, `bg-green-*` and `bg-yellow-*` colours with `shivraj-*` tokens and a new accent token for the yellow.
- Check desktop (1280) and your screen size (1062×639) plus mobile with Playwright, and make sure there are no errors.
