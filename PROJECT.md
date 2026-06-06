# WON Diet Cafe — Online Menu & WhatsApp Ordering

Project overview / handover doc. For run & setup steps see [README.md](./README.md).

## What it is
A mobile-first, interactive web menu for **WON Diet Cafe** (by **WON — Way of
Nutrition**). Customers browse the menu, build an in-memory cart, and check out
via a pre-filled **WhatsApp** message. Static front end, no backend.

## Live
- **Site:** https://fresh-fit-fuel-eight.vercel.app/
- **Repo:** https://github.com/rootnlogs/fresh-fit-fuel
- **Hosting:** Vercel (auto-deploys on every push to `main`)

## Cafe details (from the WON flyer)
- **Address:** 5th Floor, Near Shanti Mukund Hospital, Above Hyundai Showroom,
  Dayanand Vihar, Anand Vihar, New Delhi – 110092
- **Phones:** +91 99539 07178 (WhatsApp), +91 79874 04499
- **Tagline:** Healthy Food · Healthy Life · Healthy Choice
- Note shown in footer: *prices subject to change based on fluctuations in product costs.*

## Tech stack
Vite + React (JS) · React Three Fiber + drei (3D) · Tailwind CSS · Framer Motion
· lucide-react. Menu data from `menu.json`.

## Features
- **3D hero** (React Three Fiber): low-poly food shapes, drag-to-rotate, tap-to-pop,
  hover, GPU sparkles, wobble material. Lazy-loaded; disabled on small screens and
  under `prefers-reduced-motion`.
- **Interactive Google Map** embedded in the hero (keyless, pan/zoom).
- **Menu**: sticky category nav with active highlight, search, veg-only toggle,
  3D-tilt cards with real food photos, veg/non-veg marks, animated macro bars.
- **Cart**: in-memory (no localStorage), slide-in drawer / bottom sheet,
  fly-to-cart animation, springy badge.
- **Checkout → WhatsApp**: optional name/note, builds a formatted order message
  and opens `wa.me`.
- Accessible (skip link, focus rings, alt text, keyboard cart) and responsive.

## Where to change things (single sources of truth)
| Want to change… | Edit |
| --- | --- |
| WhatsApp number | `src/config.js` → `WHATSAPP_NUMBER` |
| Address / phones / map / tagline | `src/config.js` → `CONTACT` |
| Menu items, prices, macros, veg flags | `menu.json` |
| Food photos | `src/data/images.js` (item → photo, with fallbacks) |
| Brand colors | `tailwind.config.js` + `src/config.js` `BRAND.colors` |
| Logotype | `src/components/Logo.jsx` |

## Assets
- **Visiting card** with QR to the site: `~/Downloads/qr-fresh-fit.png`
  (generated; theme-matched; QR encodes the live URL).

## Known follow-ups
- Photos are appetizing Unsplash stock mapped per item — swap in the cafe's own
  shots in `src/data/images.js` (look for the TODO).
- Falafel items reuse a salad photo (no verified falafel stock at build time).
- The repo/project folder is still named `fresh-fit-fuel`; only the displayed
  brand is "WON Diet Cafe". Rename the repo + Vercel project later if desired
  (the deploy URL would change).
