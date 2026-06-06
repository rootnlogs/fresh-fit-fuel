// ============================================================================
//  Fresh Fit Fuel — single source of truth for deployment-specific settings
// ============================================================================

// TODO: ⬇️ PUT THE CAFE'S REAL WHATSAPP NUMBER HERE ⬇️
// Country code + number, digits only — NO '+', NO spaces, NO dashes.
// Example for an Indian number +91 98765 43210  ->  "919876543210"
export const WHATSAPP_NUMBER = '919953907178'

// Convenience flag the UI uses to warn (in dev) that the number isn't set yet.
export const WHATSAPP_NUMBER_IS_PLACEHOLDER = /X/i.test(WHATSAPP_NUMBER)

// Brand palette mirrored from tailwind.config.js so non-Tailwind contexts
// (the 3D scene, canvas materials) can use the exact same colors.
export const BRAND = {
  name: 'Fresh Fit Fuel',
  by: 'WON — Way of Nutrition',
  colors: {
    lime: '#8BC53F',
    navy: '#3C4A6B',
    navyDeep: '#2A3450',
    sun: '#F2E40C',
    won: '#E2231A',
    ink: '#1A1A1A',
  },
}

// Cafe contact details (from the WON Diet Cafe flyer). Single source of truth.
export const CONTACT = {
  phonePrimary: '919953907178', // WhatsApp + calls
  phoneSecondary: '917987404499',
  phoneDisplay: ['+91 99539 07178', '+91 79874 04499'],
  addressLines: [
    '5th Floor, Near Shanti Mukund Hospital',
    'Above Hyundai Showroom, Dayanand Vihar',
    'Anand Vihar, Delhi – 110092',
  ],
  addressShort: 'Dayanand Vihar, Anand Vihar, New Delhi',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('WON Diet Cafe, Dayanand Vihar, Anand Vihar, Delhi 110092'),
  wonTagline: 'Healthy Food · Healthy Life · Healthy Choice',
  priceNote: 'Prices are subject to change based on fluctuations in product costs.',
}
