import { Search, X } from 'lucide-react'
import Logo from './Logo.jsx'

// Compact brand + search + veg-only toggle. Lives in the sticky bar.
export default function Toolbar({ query, onQuery, vegOnly, onVegToggle }) {
  return (
    <div className="flex items-center gap-3">
      {/* Compact brand mark — hidden on the smallest screens to save room */}
      <a href="#top" className="hidden shrink-0 sm:block" aria-label="Fresh Fit Fuel — back to top">
        <Logo size="sm" />
      </a>

      {/* Search */}
      <div className="relative flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40"
          aria-hidden="true"
        />
        <input
          type="search"
          inputMode="search"
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder="Search the menu…"
          aria-label="Search the menu by item name"
          className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-9 pr-9 text-sm text-white placeholder:text-white/40 focus:border-lime/50 focus:bg-white/10"
        />
        {query && (
          <button
            type="button"
            onClick={() => onQuery('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Veg-only toggle */}
      <button
        type="button"
        role="switch"
        aria-checked={vegOnly}
        onClick={() => onVegToggle(!vegOnly)}
        className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors ${
          vegOnly
            ? 'border-lime bg-lime/15 text-lime'
            : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
        }`}
      >
        <span
          className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
            vegOnly ? 'border-lime' : 'border-white/40'
          }`}
          aria-hidden="true"
        >
          <span className={`h-1.5 w-1.5 rounded-full ${vegOnly ? 'bg-lime' : 'bg-white/40'}`} />
        </span>
        Veg only
      </button>
    </div>
  )
}
