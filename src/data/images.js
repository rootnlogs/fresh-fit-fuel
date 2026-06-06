// ============================================================================
//  Food imagery map
//  ---------------------------------------------------------------------------
//  Claude Code can't generate photos, so these are real, appetizing shots from
//  Unsplash's CDN. Every URL here was verified to return HTTP 200 at build time.
//
//  Resolution order (see getImage): item-id override → keyword match → category
//  fallback → null (and <ImageWithFallback> then shows a branded placeholder),
//  so every card always shows something real and relevant.
//
//  TODO: replace with Fresh Fit Fuel's own product photos
//  Swap any value below for the cafe's real photo URL (or a file in /public).
// ============================================================================

/** Build an Unsplash CDN url at a given width. */
function unsplash(id, w = 800) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`
}

// --- Verified photo IDs, named by what they show ---------------------------
const PIC = {
  saladBowl: '1512621776951-a57141f2eefd',
  vegSalad: '1546793665-c74683f339c1',
  riceBowl: '1490645935967-10de6ba17061',
  vegBowl: '1546069901-ba9599a7e63c',
  smoothie: '1502741224143-90386d7f8c82',
  proteinShake: '1607330289024-1535c6b4e1c1',
  chocoShake: '1559054663-e8d23213f55c',
  coffee: '1461023058943-07fcbe16d735',
  sandwichVeg: '1528735602780-2552fd46c7af',
  sandwichGrill: '1539252554453-80ab65ce3586',
  sandwichChicken: '1571091718767-18b5b1457add',
  grilledChicken: '1532550907401-a500c9a57435',
  chickenBreast: '1604908176997-125f25cc6f3d',
  wrap: '1626700051175-6818013e1d4f',
  sub: '1553979459-d2229ba7433b',
  subBread: '1606755962773-d324e0a13086',
  gravy: '1567188040759-fb8a883dc6d8',
  mojito: '1551538827-9c037cb4f32a',
  lemonade: '1622543925917-763c34d1a86e',
  juice: '1497534446932-c925b458314e',
  egg: '1525351484163-7529414344d8',
  fish: '1580476262798-bddd9f4b7369',
  tofu: '1546554137-f86b9593a222',
  paneerTikka: '1604152135912-04a022e23696',
  chickenTikka: '1599487488170-d11ec9c172f0',
  peanutButter: '1484980972926-edee96e0960d',
}

// --- Per-category fallback (always relevant to the section) -----------------
const categoryImages = {
  'veg-sandwich': PIC.sandwichVeg,
  'nonveg-sandwich': PIC.sandwichChicken,
  salads: PIC.saladBowl,
  'rice-bowls': PIC.riceBowl,
  gravy: PIC.gravy,
  'power-mix': PIC.chickenBreast,
  wraps: PIC.wrap,
  subs: PIC.sub,
  beverages: PIC.smoothie,
}

// --- Explicit per-item overrides (optional, highest priority) --------------
// Add `'<item-id>': PIC.something` here to pin a specific photo to one item.
const itemImages = {
  'vs-peanut-butter': PIC.peanutButter,
  'rb-veg': PIC.vegBowl,
  'rb-tofu': PIC.tofu,
  'bv-cold-coffee': PIC.coffee,
  'bv-energy-cold-coffee': PIC.coffee,
  'bv-cold-coffee-sugarfree': PIC.coffee,
  'bv-protein-shake': PIC.proteinShake,
  'bv-choco-peanut-shake': PIC.chocoShake,
  'bv-virgin-mojito': PIC.mojito,
  'bv-orange-mojito': PIC.mojito,
  'bv-green-juice': PIC.juice,
}

// --- Keyword rules, most specific first ------------------------------------
// Matched against the lowercased item name when there's no explicit id match.
const keywordRules = [
  [['paneer tikka'], PIC.paneerTikka],
  [['chicken tikka'], PIC.chickenTikka],
  [['cottage cheese', 'paneer'], PIC.paneerTikka],
  [['tofu'], PIC.tofu],
  [['fish'], PIC.fish],
  [['egg'], PIC.egg],
  [['falafel'], PIC.vegSalad],
  [['peanut butter'], PIC.peanutButter],
  [['protein shake'], PIC.proteinShake],
  [['choco', 'chocolate', 'oreo'], PIC.chocoShake],
  [['shake'], PIC.smoothie],
  [['coffee'], PIC.coffee],
  [['mojito'], PIC.mojito],
  [['lemonade', 'soda', 'skyfall'], PIC.lemonade],
  [['juice', 'green juice'], PIC.juice],
  [['kebab', 'roasted chicken', 'steam chicken', 'grilled chicken', 'chicken breast', 'chicken'], PIC.grilledChicken],
  [['clubhouse', 'grilled'], PIC.sandwichGrill],
  [['sub'], PIC.subBread],
  [['wrap'], PIC.wrap],
]

/**
 * Resolve the best image for an item.
 * @param {{id:string, name:string}} item
 * @param {string} categoryId
 * @returns {{full:string, blur:string}|null}
 */
export function getImage(item, categoryId) {
  let id = itemImages[item.id]

  if (!id) {
    const name = item.name.toLowerCase()
    for (const [keywords, picId] of keywordRules) {
      if (keywords.some((k) => name.includes(k))) {
        id = picId
        break
      }
    }
  }

  if (!id) id = categoryImages[categoryId]
  if (!id) return null

  return {
    full: unsplash(id, 800),
    blur: unsplash(id, 24), // tiny version for the blur-up placeholder
  }
}
