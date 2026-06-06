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
