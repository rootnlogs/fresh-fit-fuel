import { MapPin, Navigation } from 'lucide-react'
import { CONTACT } from '../config.js'

// Interactive Google Maps embed (pan/zoom, keyless) shown in the hero.
// The iframe is lazy-loaded so it never blocks first paint.
export default function MapCard() {
  return (
    <div className="pointer-events-auto w-full max-w-md overflow-hidden rounded-2xl glass shadow-card">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-white">
          <MapPin className="h-3.5 w-3.5 text-lime" aria-hidden="true" />
          Find us — WON Diet Cafe
        </span>
        <a
          href={CONTACT.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-lime px-2.5 py-1 text-[11px] font-bold text-ink transition-colors hover:bg-lime-400"
        >
          <Navigation className="h-3 w-3" aria-hidden="true" />
          Directions
        </a>
      </div>
      <iframe
        title="WON Diet Cafe location on Google Maps"
        src={CONTACT.mapsEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-44 w-full border-0 sm:h-52"
      />
    </div>
  )
}
