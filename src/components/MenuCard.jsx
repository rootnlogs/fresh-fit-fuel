import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { Plus } from 'lucide-react'
import ImageWithFallback from './ImageWithFallback.jsx'
import MacroChips from './MacroChips.jsx'
import QtyStepper from './QtyStepper.jsx'
import VegDot from './VegDot.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getImage } from '../data/images.js'

const CATEGORY_EMOJI = {
  'veg-sandwich': '🥪',
  'nonveg-sandwich': '🥪',
  salads: '🥗',
  'rice-bowls': '🍚',
  gravy: '🍛',
  'power-mix': '🍗',
  wraps: '🌯',
  subs: '🥖',
  beverages: '🥤',
}

export default function MenuCard({ item, categoryId, reducedMotion, onAdded }) {
  const { qtyOf, add, increment, decrement } = useCart()
  const qty = qtyOf(item.id)
  const image = getImage(item, categoryId)
  const addBtnRef = useRef(null)

  // --- 3D tilt (disabled under reduced motion) ---
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 25 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 25 })

  function handlePointerMove(e) {
    if (reducedMotion) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  function resetTilt() {
    x.set(0)
    y.set(0)
  }

  function handleAdd() {
    add({ id: item.id, name: item.name, price: item.price, veg: item.veg })
    if (!reducedMotion) onAdded?.(addBtnRef.current)
  }

  return (
    <motion.article
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      style={reducedMotion ? undefined : { rotateX, rotateY, transformPerspective: 800 }}
      initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="group flex h-full flex-col overflow-hidden rounded-2xl glass shadow-card [transform-style:preserve-3d]"
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full">
        <ImageWithFallback
          image={image}
          alt={item.name}
          emoji={CATEGORY_EMOJI[categoryId] ?? '🍽️'}
          className="h-full w-full"
        />
        <div className="absolute left-2.5 top-2.5">
          <VegDot veg={item.veg} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <h3 className="font-display text-sm font-bold leading-snug text-white">{item.name}</h3>

        <div className="mt-auto">
          <MacroChips macros={item.macros} animate={!reducedMotion} />
        </div>

        <div className="flex items-center justify-between gap-2 pt-1">
          <span className="font-display text-lg font-extrabold text-white">
            ₹{item.price}
          </span>

          {qty === 0 ? (
            <motion.button
              ref={addBtnRef}
              type="button"
              onClick={handleAdd}
              whileTap={{ scale: 0.9 }}
              className="inline-flex items-center gap-1 rounded-full bg-lime px-4 py-2 font-display text-sm font-bold text-ink shadow transition-colors hover:bg-lime-400"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              Add
            </motion.button>
          ) : (
            <QtyStepper
              qty={qty}
              onIncrement={() => increment(item.id)}
              onDecrement={() => decrement(item.id)}
              label={item.name}
              size="sm"
            />
          )}
        </div>
      </div>
    </motion.article>
  )
}
