// Styled text logotype — used as the brand mark.
// If the cafe later drops `public/fresh-fit-fuel-logo.png` in, you can swap the
// markup below for an <img>. (brand-assets/ was empty at build time, so per the
// brief we render this text logotype instead — the build never depends on a
// missing file.)

export default function Logo({ className = '', size = 'md' }) {
  const sizes = {
    sm: { fresh: 'text-2xl', fit: 'text-lg' },
    md: { fresh: 'text-4xl', fit: 'text-2xl' },
    lg: { fresh: 'text-6xl sm:text-7xl', fit: 'text-4xl sm:text-5xl' },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      <span className={`font-script text-lime ${s.fresh} drop-shadow-[0_2px_8px_rgba(139,197,63,0.35)]`}>
        Fresh
      </span>
      <span className={`font-display font-extrabold uppercase tracking-tight text-white ${s.fit}`}>
        Fit Fuel
      </span>
    </span>
  )
}

// Small "WON — Way of Nutrition" mark for header/footer (red used sparingly).
export function WonMark({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-display font-extrabold tracking-wide text-won">WON</span>
      <span className="text-xs text-white/60">Way of Nutrition</span>
    </span>
  )
}
