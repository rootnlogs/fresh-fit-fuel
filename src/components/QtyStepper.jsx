import { Minus, Plus } from 'lucide-react'
import { motion } from 'framer-motion'

// Compact +/- quantity control. Used in cards and the cart.
export default function QtyStepper({ qty, onIncrement, onDecrement, label = 'item', size = 'md' }) {
  const dims = size === 'sm' ? 'h-7 w-7' : 'h-9 w-9'
  const text = size === 'sm' ? 'text-sm w-5' : 'text-base w-6'

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/10 p-1">
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={onDecrement}
        aria-label={`Remove one ${label}`}
        className={`flex ${dims} items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20`}
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </motion.button>
      <span
        className={`text-center font-display font-bold tabular-nums text-white ${text}`}
        aria-live="polite"
      >
        {qty}
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.85 }}
        onClick={onIncrement}
        aria-label={`Add one ${label}`}
        className={`flex ${dims} items-center justify-center rounded-full bg-lime text-ink transition-colors hover:bg-lime-400`}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </motion.button>
    </div>
  )
}
