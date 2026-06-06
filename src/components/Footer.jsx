import { MapPin, Phone, MessageCircle, Navigation, Clock } from 'lucide-react'
import { WonMark } from './Logo.jsx'
import { CONTACT, WHATSAPP_NUMBER } from '../config.js'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="mt-16 scroll-mt-32 border-t border-white/10">
      {/* Contact band */}
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {/* Address */}
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-lime">
            <MapPin className="h-4 w-4" aria-hidden="true" /> Visit Us
          </h3>
          <address className="not-italic text-sm leading-relaxed text-white/70">
            <span className="font-semibold text-white">WON Diet Cafe</span>
            <br />
            {CONTACT.addressLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </address>
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-white/20"
          >
            <Navigation className="h-3.5 w-3.5" aria-hidden="true" /> Get directions
          </a>
        </div>

        {/* Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="flex items-center gap-2 font-display text-sm font-bold uppercase tracking-wide text-lime">
            <Phone className="h-4 w-4" aria-hidden="true" /> Order &amp; Enquiries
          </h3>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            {CONTACT.phoneDisplay.map((num, i) => (
              <li key={num}>
                <a
                  href={`tel:+${i === 0 ? CONTACT.phonePrimary : CONTACT.phoneSecondary}`}
                  className="inline-flex items-center gap-2 transition-colors hover:text-white"
                >
                  <Phone className="h-3.5 w-3.5 text-white/40" aria-hidden="true" />
                  {num}
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-[#0b1f12] transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" /> Chat on WhatsApp
          </a>
          <p className="flex items-center gap-2 text-xs text-white/45">
            <Clock className="h-3.5 w-3.5" aria-hidden="true" /> Open daily · dine-in &amp; takeaway
          </p>
        </div>

        {/* Brand */}
        <div className="flex flex-col gap-3 sm:col-span-2 lg:col-span-1">
          <WonMark />
          <p className="text-sm leading-relaxed text-white/60">
            <span className="font-semibold text-white/80">{CONTACT.wonTagline}</span> — real food,
            honest macros, built to fuel your goals.
          </p>
          <p className="text-xs text-white/40">{CONTACT.priceNote}</p>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/5 px-5 py-5 text-center">
        <p className="text-xs text-white/30">
          © {year} Fresh Fit Fuel by WON — Way of Nutrition. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
