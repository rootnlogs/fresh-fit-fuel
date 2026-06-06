import { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'

// Floating cart button (bottom-right) with a springy count badge.
// forwardRef so App can use it as the fly-to-cart target.
const CartButton = forwardRef(function CartButton({ onClick }, ref) {
  const { count, total } = useCart()
  const active = count > 0

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`Open cart, ${count} item${count === 1 ? '' : 's'}, total ₹${total}`}
      initial={false}
      animate={{
        opacity: active ? 1 : 0,
        scale: active ? 1 : 0.6,
        pointerEvents: active ? 'auto' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 rounded-full bg-lime px-5 py-3.5 font-display font-bold text-ink shadow-card"
    >
      <span className="relative">
        <ShoppingBag className="h-5 w-5" aria-hidden="true" />
        <AnimatePresence>
          {active && (
            <motion.span
              key={count}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 600, damping: 20 }}
              className="absolute -right-2.5 -top-2.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-won px-1 text-[11px] font-bold text-white"
            >
              {count}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="tabular-nums">₹{total}</span>
    </motion.button>
  )
})

export default CartButton
