import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ShoppingBag, MessageCircle } from 'lucide-react'
import QtyStepper from './QtyStepper.jsx'
import VegDot from './VegDot.jsx'
import { useCart } from '../context/CartContext.jsx'

// Slide-in cart: bottom sheet on mobile, side panel on >= sm.
export default function CartDrawer({ open, onClose, onCheckout }) {
  const { items, count, total, increment, decrement, remove, clear } = useCart()
  const panelRef = useRef(null)
  const closeRef = useRef(null)

  // Close on Escape; focus the close button when opened.
  useEffect(() => {
    if (!open) return
    closeRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    // Lock body scroll while open
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Your order"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 36 }}
            className="glass-strong absolute inset-x-0 bottom-0 flex max-h-[88vh] flex-col rounded-t-3xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-[400px] sm:rounded-l-3xl sm:rounded-tr-none"
          >
            {/* Header */}
            <header className="flex items-center justify-between gap-3 border-b border-white/10 p-4">
              <h2 className="flex items-center gap-2 font-display text-lg font-extrabold text-white">
                <ShoppingBag className="h-5 w-5 text-lime" aria-hidden="true" />
                Your Order
                {count > 0 && (
                  <span className="rounded-full bg-lime/20 px-2 py-0.5 text-xs font-bold text-lime">
                    {count}
                  </span>
                )}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close cart"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </header>

            {/* Items */}
            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10 text-center">
                <span className="text-5xl" aria-hidden="true">🥗</span>
                <p className="font-display font-bold text-white">Your cart is empty</p>
                <p className="text-sm text-white/60">
                  Add something tasty from the menu to get started.
                </p>
              </div>
            ) : (
              <ul className="no-scrollbar flex-1 divide-y divide-white/5 overflow-y-auto p-2">
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.id}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex items-center gap-3 p-2"
                    >
                      <div className="mt-0.5 shrink-0">
                        <VegDot veg={item.veg} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-display text-sm font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-white/50">
                          ₹{item.price} × {item.qty} ={' '}
                          <span className="font-semibold text-white/80">₹{item.price * item.qty}</span>
                        </p>
                      </div>
                      <QtyStepper
                        qty={item.qty}
                        onIncrement={() => increment(item.id)}
                        onDecrement={() => decrement(item.id)}
                        label={item.name}
                        size="sm"
                      />
                      <button
                        type="button"
                        onClick={() => remove(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/40 hover:bg-won/20 hover:text-won"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}

            {/* Footer / totals */}
            {items.length > 0 && (
              <footer className="border-t border-white/10 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-medium text-white/50 underline-offset-2 hover:text-white/80 hover:underline"
                  >
                    Clear all
                  </button>
                  <div className="text-right">
                    <p className="text-xs text-white/50">Total ({count} items)</p>
                    <p className="font-display text-2xl font-extrabold text-white">₹{total}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCheckout}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-lime py-3.5 font-display font-bold text-ink shadow-card transition-colors hover:bg-lime-400"
                >
                  <MessageCircle className="h-5 w-5" aria-hidden="true" />
                  Order on WhatsApp
                </button>
              </footer>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  )
}
