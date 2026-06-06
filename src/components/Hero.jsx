import { Suspense, lazy, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, MapPin } from 'lucide-react'
import Logo, { WonMark } from './Logo.jsx'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion.js'
import { CONTACT } from '../config.js'
import menu from '../../menu.json'

// Lazy chunk so the ~three.js payload never blocks first paint.
const Scene3D = lazy(() => import('./Scene3D.jsx'))

function useIsSmallScreen() {
  const [small, setSmall] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches,
  )
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 640px)')
    const on = () => setSmall(mql.matches)
    mql.addEventListener('change', on)
    return () => mql.removeEventListener('change', on)
  }, [])
  return small
}

export default function Hero({ onViewMenu }) {
  const reducedMotion = usePrefersReducedMotion()
  const isSmall = useIsSmallScreen()
  const [mounted, setMounted] = useState(false)

  // Defer 3D until after first paint so the hero text shows instantly.
  useEffect(() => {
    if (reducedMotion) return
    const id = window.requestAnimationFrame(() => setMounted(true))
    return () => window.cancelAnimationFrame(id)
  }, [reducedMotion])

  const show3D = mounted && !reducedMotion

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-16 pt-24 text-center">
      {/* 3D layer (or static fallback). pointer-events stay on so parallax works. */}
      <div className="absolute inset-0 -z-0" aria-hidden="true">
        {show3D ? (
          <Suspense fallback={<HeroBackdrop />}>
            <Scene3D reducedMotion={reducedMotion} isSmallScreen={isSmall} />
          </Suspense>
        ) : (
          <HeroBackdrop />
        )}
        {/* Readability scrim so text always passes contrast over the scene */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-navy-900/40 via-transparent to-navy-900" />
      </div>

      {/* Content. Wrapper is click-through so the canvas gets pointer parallax;
          the CTA re-enables pointer events for itself. */}
      <motion.div
        className="pointer-events-none relative z-10 flex flex-col items-center gap-6"
        initial={reducedMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="pointer-events-auto">
          <WonMark className="mb-4 justify-center" />
        </div>

        <Logo size="lg" />

        <p className="max-w-md font-display text-lg font-medium text-white/80 sm:text-xl">
          {menu.brand.tagline}
        </p>

        <p className="max-w-sm text-sm text-white/60">
          Healthy, high-protein meals — built fresh, ordered in seconds over WhatsApp.
        </p>

        <a
          href={CONTACT.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-white/70 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
        >
          <MapPin className="h-3.5 w-3.5 text-lime" aria-hidden="true" />
          {CONTACT.addressShort}
        </a>

        <motion.button
          type="button"
          onClick={onViewMenu}
          whileHover={reducedMotion ? undefined : { scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="pointer-events-auto mt-2 inline-flex items-center gap-2 rounded-full bg-lime px-7 py-3.5 font-display font-bold text-ink shadow-card transition-colors hover:bg-lime-400"
        >
          View Menu &amp; Order
          <ArrowDown className="h-5 w-5" aria-hidden="true" />
        </motion.button>
      </motion.div>

      {/* Scroll hint */}
      {!reducedMotion && (
        <motion.div
          className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-white/40"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          aria-hidden="true"
        >
          <ArrowDown className="h-5 w-5" />
        </motion.div>
      )}
    </section>
  )
}

// Static decorative backdrop: brand gradient + noise. Shown before the 3D
// mounts, while it loads, and as the full hero under reduced motion.
function HeroBackdrop() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(139,197,63,0.25),transparent_55%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(242,228,12,0.12),transparent_45%)]" />
      <div className="noise-overlay absolute inset-0 opacity-[0.15]" />
    </div>
  )
}
