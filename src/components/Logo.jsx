// Styled text logotype for WON Diet Cafe — bold "WON" + script "Diet" + bold
// "Cafe", echoing the printed flyer. If a logo file is later added, swap the
// markup for an <img>; the build never depends on a missing asset.

export default function Logo({ className = '', size = 'md' }) {
  const sizes = {
    sm: { bold: 'text-xl', script: 'text-2xl' },
    md: { bold: 'text-2xl', script: 'text-3xl' },
    lg: { bold: 'text-4xl sm:text-5xl', script: 'text-6xl sm:text-7xl' },
  }
  const s = sizes[size] ?? sizes.md

  return (
    <span className={`inline-flex items-baseline gap-2 leading-none ${className}`}>
      <span className={`font-display font-extrabold uppercase tracking-tight text-white ${s.bold}`}>
        WON
      </span>
      <span className={`font-script text-lime ${s.script} drop-shadow-[0_2px_8px_rgba(139,197,63,0.35)]`}>
        Diet
      </span>
      <span className={`font-display font-extrabold uppercase tracking-tight text-white ${s.bold}`}>
        Cafe
      </span>
    </span>
  )
}

// Small "WON — Way of Nutrition" mark for the footer (red used sparingly).
export function WonMark({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <span className="font-display font-extrabold tracking-wide text-won">WON</span>
      <span className="text-xs text-white/60">Way of Nutrition</span>
    </span>
  )
}
