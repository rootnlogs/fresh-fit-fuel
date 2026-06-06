import { useEffect, useState } from 'react'

/**
 * Returns the id of the category section currently in view, so the sticky
 * category nav can highlight it. Uses IntersectionObserver (cheap, no scroll
 * listeners).
 *
 * @param {string[]} ids - section element ids to watch
 */
export function useActiveSection(ids) {
  const [activeId, setActiveId] = useState(ids[0] ?? null)

  useEffect(() => {
    if (!ids.length) return

    const visible = new Map()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.intersectionRatio)
        }
        // Pick the most-visible section near the top of the viewport.
        let best = null
        let bestRatio = 0
        for (const [id, ratio] of visible) {
          if (ratio > bestRatio) {
            best = id
            bestRatio = ratio
          }
        }
        if (best) setActiveId(best)
      },
      {
        // Bias toward the section just under the sticky nav.
        rootMargin: '-120px 0px -55% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    )

    for (const id of ids) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [ids])

  return activeId
}
