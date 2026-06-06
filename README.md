# Fresh Fit Fuel — Interactive Online Menu

A mobile-first, interactive web menu for **Fresh Fit Fuel** (by **WON — Way of Nutrition**).
Customers browse the menu, build an order in an in-memory cart, and check out via a
pre-filled **WhatsApp** message. Static front-end, no backend.

Built with **Vite + React**, **React Three Fiber** (three.js) for the 3D hero,
**Tailwind CSS**, and **Framer Motion**.

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173). The dev server is also
exposed on your LAN, so you can open the Network URL on your phone to test mobile.

Other scripts:

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build locally
```

## ⚙️ Set the WhatsApp number (do this before going live)

The cafe's WhatsApp number lives in **one place**:

```
src/config.js  →  export const WHATSAPP_NUMBER = "91XXXXXXXXXX"
```

Use country code + number, digits only — no `+`, no spaces (e.g. `919876543210`).
Until it's set, checkout shows a small warning and the `wa.me` link won't reach a real chat.

## 🍽️ Swap in the cafe's real food photos

Photos are currently real, appetizing stock shots from Unsplash, mapped per item with
category fallbacks. To replace them with Fresh Fit Fuel's own product photos, edit:

```
src/data/images.js
```

Each item resolves in this order: **item-id override → keyword match → category fallback →
branded placeholder**. Drop the cafe's photo URLs (or files placed in `/public`) into the
`itemImages` / `categoryImages` maps. Look for the `// TODO: replace with Fresh Fit Fuel's
own product photos` note at the top of that file.

## Menu data

All items, prices, macros and veg/non-veg flags come from **`menu.json`** at the project
root (imported, not retyped). Edit that file to change the menu — the UI updates automatically.

## Brand assets / logo

If you have logo files, drop `public/won-logo.png` and/or `public/fresh-fit-fuel-logo.png`
and wire them into `src/components/Logo.jsx`. Until then, a styled text logotype is shown
(green script "Fresh" + bold "FIT FUEL"), so the build never breaks over a missing asset.

## Notes

- **Cart is in-memory only** (React state) — refreshing the page clears it, by design.
- **Accessibility**: semantic HTML, alt text, keyboard-operable cart/checkout, visible focus
  rings, and a "skip to menu" link.
- **Performance / motion**: the 3D hero is lazy-loaded and uses low-poly primitives with no
  external HDR; parallax and heavy animation are disabled on small screens and when the OS
  has **prefers-reduced-motion** set.

## Project structure

```
src/
  config.js            # WHATSAPP_NUMBER + brand palette (single source of truth)
  data/images.js       # food photo map (item → photo, with fallbacks)
  context/CartContext  # in-memory cart (useReducer)
  lib/whatsapp.js      # builds the order message + wa.me deep link
  hooks/               # prefers-reduced-motion, active-section observer
  components/          # Hero, Scene3D, CategoryNav, MenuCard, CartDrawer, CheckoutModal, …
```
