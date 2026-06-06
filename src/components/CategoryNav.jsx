import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

// Horizontally-scrollable category pills with an animated active underline.
export default function CategoryNav({ categories, activeId, onSelect }) {
  const containerRef = useRef(null)
  const pillRefs = useRef({})

  // Keep the active pill scrolled into view as the user scrolls sections.
  useEffect(() => {
    const el = pillRefs.current[activeId]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [activeId])

  return (
    <nav aria-label="Menu categories">
      <ul
        ref={containerRef}
        className="no-scrollbar flex gap-2 overflow-x-auto py-1"
      >
        {categories.map((cat) => {
          const active = cat.id === activeId
          return (
            <li key={cat.id} className="shrink-0">
              <button
                ref={(node) => (pillRefs.current[cat.id] = node)}
                type="button"
                onClick={() => onSelect(cat.id)}
                aria-current={active ? 'true' : undefined}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  active ? 'text-ink' : 'text-white/70 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="activePill"
                    className="absolute inset-0 rounded-full bg-lime"
                    transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  />
                )}
                <span className="relative z-10 whitespace-nowrap">{cat.name}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
