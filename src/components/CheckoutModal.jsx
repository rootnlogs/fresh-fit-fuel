import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MessageCircle, AlertTriangle } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { buildWhatsAppLink } from '../lib/whatsapp.js'
import { WHATSAPP_NUMBER_IS_PLACEHOLDER } from '../config.js'

// Small, frictionless modal: optional name + note, then send to WhatsApp.
export default function CheckoutModal({ open, onClose }) {
  const { items, total, count } = useCart()
  const [name, setName] = useState('')
  const [note, setNote] = useState('')
  const nameRef = useRef(null)

  useEffect(() => {
    if (!open) return
    nameRef.current?.focus()
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function handleSend() {
    const link = buildWhatsAppLink(items, total, count, { name, note })
    // Open WhatsApp (new tab / the WhatsApp app on mobile).
    window.open(link, '_blank', 'noopener,noreferrer')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="glass-strong relative w-full max-w-md rounded-t-3xl p-5 sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 id="checkout-title" className="font-display text-lg font-extrabold text-white">
                Almost there 🎉
              </h2>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close checkout"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <p className="mb-4 text-sm text-white/60">
              Add your name and any notes (optional). We&apos;ll open WhatsApp with your order
              pre-filled — just hit send.
            </p>

            <div className="space-y-3">
              <div>
                <label htmlFor="cust-name" className="mb-1 block text-xs font-semibold text-white/70">
                  Your name <span className="font-normal text-white/40">(optional)</span>
                </label>
                <input
                  id="cust-name"
                  ref={nameRef}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tushar"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-lime/50 focus:bg-white/10"
                />
              </div>
              <div>
                <label htmlFor="cust-note" className="mb-1 block text-xs font-semibold text-white/70">
                  Note <span className="font-normal text-white/40">(optional)</span>
                </label>
                <textarea
                  id="cust-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="e.g. less oil, extra napkins, pickup at 6pm"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-lime/50 focus:bg-white/10"
                />
              </div>
            </div>

            {/* Order summary line */}
            <div className="my-4 flex items-center justify-between rounded-xl bg-white/5 px-4 py-3">
              <span className="text-sm text-white/60">{count} items</span>
              <span className="font-display text-xl font-extrabold text-white">₹{total}</span>
            </div>

            {WHATSAPP_NUMBER_IS_PLACEHOLDER && (
              <div className="mb-3 flex items-start gap-2 rounded-xl border border-sun/30 bg-sun/10 px-3 py-2 text-xs text-sun">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>
                  WhatsApp number isn&apos;t set yet — add it in{' '}
                  <code className="font-mono">src/config.js</code> so orders reach the cafe.
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleSend}
              disabled={count === 0}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-[#25D366] py-3.5 font-display font-bold text-[#0b1f12] shadow-card transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <MessageCircle className="h-5 w-5" aria-hidden="true" />
              Send order on WhatsApp
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
