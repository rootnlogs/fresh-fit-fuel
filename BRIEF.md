# Fresh Fit Fuel — Interactive Online Menu + WhatsApp Ordering

## Goal
A unique, mobile-first interactive web menu for **Fresh Fit Fuel** (by **WON — Way of Nutrition**),
a healthy/high-protein cafe. Customers browse the menu, build an order in a cart, and on checkout
the app opens WhatsApp with a pre-filled, neatly formatted order message sent to the cafe's number.
This is a static front-end app (no backend) — the "order" is a WhatsApp deep link.

## Tech stack (use exactly this)
- **Vite + React** (JavaScript)
- **Three.js via @react-three/fiber + @react-three/drei** for the 3D scenes
- **Tailwind CSS** for styling
- **Framer Motion** for micro-interactions and reveals
- **lucide-react** for icons
- Data comes from `menu.json` (already in the project root — import it, do not retype it)

## Brand & visual direction
Pull the palette from the brand assets:
- **Lime green** `#8BC53F` (primary action / "Fresh"), **dark navy** background `#3C4A6B`,
  **bright yellow** `#F2E40C` accent (borders/highlights, as in the menu), **WON red** `#E2231A`
  (use sparingly for the WON mark), near-black `#1A1A1A` for text on light, white on dark.
- Mood: clean, energetic, premium-healthy. Think "fitness cafe meets modern food-tech."
  Glassmorphism cards on the navy, soft shadows, rounded corners, subtle grain/noise texture
  echoing the doodle-pattern background of the printed menu.
- Typography: a strong geometric sans for headings (e.g. Poppins/Sora/Space Grotesk via Google Fonts),
  clean sans for body. "Fresh" can use a lively script-ish accent; "FIT FUEL" bold uppercase.
- Logos: look for `/public/won-logo.png` and `/public/fresh-fit-fuel-logo.png`. If present, use them
  (WON in footer/header, Fresh Fit Fuel as the hero logo). If a file is missing, render a styled
  text logotype that matches the brand (green script "Fresh", black bold "FIT FUEL") as a fallback —
  never break the build over a missing asset.

## 3D + motion (the "wow", but performance-aware)
This MUST feel alive and 3D — but it also runs on phones and on an 8GB M1, so keep it light:
- **Hero**: a React Three Fiber canvas with a tasteful 3D scene — e.g. slowly rotating/floating
  low-poly food or ingredient shapes (a bowl, leaves, a cup with straw echoing the logo), soft
  studio lighting, gentle parallax that responds to pointer/device-tilt. Use `@react-three/drei`
  helpers (Float, Environment, ContactShadows). Keep geometry low-poly and the canvas `dpr={[1,2]}`.
- **Menu cards**: 3D tilt on hover/touch (rotateX/rotateY with Framer Motion), a real food photo,
  price, veg/non-veg dot (green square = veg, red = non-veg, like Indian menus), and a macro chip
  row (P / C / F) with tiny animated bars.
- **Micro-interactions everywhere**: add-to-cart button "pop" + flying-to-cart animation, cart
  badge count spring, category pills with animated underline, scroll-reveal stagger on cards,
  sticky category nav that highlights the section in view, smooth scroll, button press states.
- Respect `prefers-reduced-motion`: disable heavy 3D/parallax and fall back to simple fades.
- Lazy-load the 3D canvas (don't block first paint); reduce 3D detail / disable parallax on small
  screens. Target a smooth 60fps on a mid-range phone.

## Food images (must look real & appetizing)
Claude Code cannot generate images. Use **real food photography from free sources**:
- Map each menu item (or at minimum each category) to a high-quality, appetizing food photo.
  Prefer specific matches (a paneer tikka photo for Paneer Tikka items, a salad bowl for salads,
  a shake for shakes, etc). Use Unsplash/Pexels image URLs (CDN) keyed in an `images.js` map by
  item id with a category fallback, so every card always shows something real and relevant.
- Lazy-load images, use a blurred placeholder, and a graceful fallback if one fails to load.
- Add a clear `// TODO: replace with Fresh Fit Fuel's own product photos` note — the cafe should
  swap in real shots later.

## Features
1. **Hero** with brand, tagline, 3D scene, and a "View Menu / Order" CTA that smooth-scrolls down.
2. **Sticky category nav** (Veg Sandwich, Non Veg Sandwich, Salads, Rice Bowls, Gravy, Power Mix,
   Wraps, Subs, Beverages) — pills, horizontally scrollable on mobile, active-section highlight.
3. **Search** box (filter items by name) + **Veg-only toggle** filter.
4. **Menu grid** grouped by category, each item = a 3D-tilt card (photo, name, macros chip, price,
   add button with qty stepper).
5. **Cart**: a slide-in drawer / bottom sheet on mobile. Shows line items, qty +/-, per-line and
   grand total, item count badge on a floating cart button. Persist cart in React state only
   (NO localStorage — keep it in memory).
6. **Checkout → WhatsApp**: an "Order on WhatsApp" button builds a clean message and opens
   `https://wa.me/<NUMBER>?text=<urlencoded message>`.
   - The number lives in ONE place: `src/config.js` → `export const WHATSAPP_NUMBER = "91XXXXXXXXXX";`
     (country code + number, no `+`, no spaces). Add a clear comment to fill this in.
   - Message format (use real newlines, then URL-encode the whole thing):
     ```
     *New Order — Fresh Fit Fuel* 🥗

     1. Paneer Tikka Sandwich  x2 — ₹440
     2. Protein Shake  x1 — ₹200

     ----------------------
     *Total: ₹640*
     Items: 3

     Sent via Fresh Fit Fuel online menu
     ```
   - Optionally collect customer name + an optional note before sending (small modal); include them
     in the message if provided. Keep it frictionless.
7. **Footer**: WON branding, a short "Way of Nutrition" line, copyright.

## Quality bar
- Mobile-first and fully responsive (customers order on phones).
- Accessible: semantic HTML, alt text, keyboard-usable cart and buttons, visible focus states.
- Clean component structure (Hero, CategoryNav, MenuCard, CartDrawer, CheckoutModal, Scene3D, etc.).
- No console errors. `npm install && npm run dev` must run clean. Keep dependencies minimal.
- Add a short `README.md`: how to run, where to set the WhatsApp number, where to swap in real photos.

## Constraints / notes for this machine
- Dev machine is an M1 MacBook Air, 8GB RAM — keep the dev server and bundle light; avoid heavy/extra
  deps beyond the stack above. The 3D runs on the GPU client-side so it's fine, just keep scenes simple.
