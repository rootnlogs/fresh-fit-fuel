import { WHATSAPP_NUMBER } from '../config.js'

const RUPEE = '₹'

/**
 * Build the order message exactly in the format from BRIEF.md, then return a
 * wa.me deep link with the whole thing URL-encoded.
 *
 * @param {Array<{name:string, qty:number, price:number}>} items
 * @param {number} total
 * @param {number} count - total quantity across all lines
 * @param {{name?:string, note?:string}} [customer]
 * @returns {string} https://wa.me/<number>?text=<encoded>
 */
export function buildWhatsAppLink(items, total, count, customer = {}) {
  const lines = []

  lines.push('*New Order — Fresh Fit Fuel*')
  lines.push('') // blank line

  items.forEach((item, idx) => {
    lines.push(
      `${idx + 1}. ${item.name}  x${item.qty} — ${RUPEE}${item.price * item.qty}`,
    )
  })

  lines.push('')
  lines.push('----------------------')
  lines.push(`*Total: ${RUPEE}${total}*`)
  lines.push(`Items: ${count}`)

  const name = customer.name?.trim()
  const note = customer.note?.trim()
  if (name || note) {
    lines.push('')
    if (name) lines.push(`Name: ${name}`)
    if (note) lines.push(`Note: ${note}`)
  }

  lines.push('')
  lines.push('Sent via Fresh Fit Fuel online menu')

  const message = lines.join('\n')
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
