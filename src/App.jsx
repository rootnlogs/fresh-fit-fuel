import { useCallback, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import menu from '../menu.json'
import Hero from './components/Hero.jsx'
import Toolbar from './components/Toolbar.jsx'
import CategoryNav from './components/CategoryNav.jsx'
import MenuSection from './components/MenuSection.jsx'
import CartButton from './components/CartButton.jsx'
import CartDrawer from './components/CartDrawer.jsx'
import CheckoutModal from './components/CheckoutModal.jsx'
import Footer from './components/Footer.jsx'
import { useActiveSection } from './hooks/useActiveSection.js'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'

export default function App() {
  const reducedMotion = usePrefersReducedMotion()
  const [query, setQuery] = useState('')
  const [vegOnly, setVegOnly] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [flyers, setFlyers] = useState([])

  const cartButtonRef = useRef(null)
  const menuTopRef = useRef(null)

  // --- Filtering (search + veg-only) ---
  const visibleCategories = useMemo(() => {
    const q = query.trim().toLowerCase()
    return menu.categories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) => (!vegOnly || item.veg) && (!q || item.name.toLowerCase().includes(q)),
        ),
      }))
      .filter((cat) => cat.items.length > 0)
  }, [query, vegOnly])

  const visibleIds = useMemo(() => visibleCategories.map((c) => c.id), [visibleCategories])
  const activeId = useActiveSection(visibleIds)

  // --- Navigation ---
  const scrollToCategory = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  const scrollToMenu = useCallback(() => {
    menuTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  // --- Fly-to-cart ghost ---
  const handleAdded = useCallback(
    (originEl) => {
      if (!originEl || !cartButtonRef.current) return
      const from = originEl.getBoundingClientRect()
      const to = cartButtonRef.current.getBoundingClientRect()
      const id = Date.now() + Math.random()
      setFlyers((prev) => [
        ...prev,
        {
          id,
          fromX: from.left + from.width / 2,
          fromY: from.top + from.height / 2,
          toX: to.left + to.width / 2,
          toY: to.top + to.height / 2,
        },
      ])
      setTimeout(() => setFlyers((prev) => prev.filter((f) => f.id !== id)), 700)
    },
    [],
  )

  return (
    <div id="top" className="min-h-screen">
      <a
        href="#menu"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-lime focus:px-4 focus:py-2 focus:font-bold focus:text-ink"
      >
        Skip to menu
      </a>

      <Hero onViewMenu={scrollToMenu} />

      <main>
        <div id="menu" ref={menuTopRef}>
          {/* Sticky controls: search + veg toggle, then category pills */}
          <div className="sticky top-0 z-30 glass-strong border-b border-white/10">
            <div className="mx-auto max-w-6xl px-4 py-3">
              <Toolbar
                query={query}
                onQuery={setQuery}
                vegOnly={vegOnly}
                onVegToggle={setVegOnly}
              />
              <div className="mt-2">
                <CategoryNav
                  categories={visibleCategories}
                  activeId={activeId}
                  onSelect={scrollToCategory}
                />
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="mx-auto max-w-6xl px-4">
            {visibleCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                <span className="text-5xl" aria-hidden="true">🔍</span>
                <p className="font-display text-lg font-bold text-white">No items found</p>
                <p className="text-sm text-white/60">
                  Try a different search{vegOnly ? ' or turn off the veg-only filter' : ''}.
                </p>
                {(query || vegOnly) && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('')
                      setVegOnly(false)
                    }}
                    className="mt-2 rounded-full bg-lime px-5 py-2.5 font-display font-bold text-ink"
                  >
                    Reset filters
                  </button>
                )}
              </div>
            ) : (
              visibleCategories.map((cat) => (
                <MenuSection
                  key={cat.id}
                  category={cat}
                  reducedMotion={reducedMotion}
                  onAdded={handleAdded}
                />
              ))
            )}
          </div>
        </div>
      </main>

      <Footer />

      {/* Floating cart + overlays */}
      <CartButton ref={cartButtonRef} onClick={() => setCartOpen(true)} />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false)
          setCheckoutOpen(true)
        }}
      />
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />

      {/* Fly-to-cart ghosts */}
      <AnimatePresence>
        {flyers.map((f) => (
          <motion.div
            key={f.id}
            initial={{ x: f.fromX, y: f.fromY, scale: 1, opacity: 1 }}
            animate={{
              x: f.toX,
              y: f.toY,
              scale: 0.3,
              opacity: 0.8,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none fixed left-0 top-0 z-[55] -ml-3 -mt-3 flex h-6 w-6 items-center justify-center rounded-full bg-lime text-ink shadow-card"
            aria-hidden="true"
          >
            +
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
