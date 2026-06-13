// ============================================================================
//  Food imagery resolver
//  ---------------------------------------------------------------------------
//  WON Diet Cafe's own photos live in /public/menu/<item-id>.jpg. The set of
//  ids that actually have a file is tracked in ./menu-images.js (rewritten by
//  scripts/gen-images.mjs after each run). Any item not in that set falls back
//  to the branded placeholder rendered by <ImageWithFallback> (the category
//  emoji on the brand gradient) — so a card is never broken and the page never
//  requests a 404.
// ============================================================================
import { MENU_IMAGE_IDS, MENU_IMAGE_EXT } from './menu-images.js'

/**
 * Resolve the best image for an item, or null to show the branded placeholder.
 * @param {{id:string, name:string}} item
 * @returns {{full:string, blur:string}|null}
 */
export function getImage(item) {
  if (!item || !MENU_IMAGE_IDS.has(item.id)) return null
  const src = `/menu/${item.id}.${MENU_IMAGE_EXT}`
  return { full: src, blur: src }
}
