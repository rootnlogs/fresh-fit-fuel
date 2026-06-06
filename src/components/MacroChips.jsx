import { motion } from 'framer-motion'

// Tiny P / C / F chips with animated bars. `macros` may be null (e.g. gravies,
// drinks) — in that case we render nothing so cards stay clean.
const META = {
  p: { label: 'P', title: 'Protein (g)', color: 'bg-lime' },
  c: { label: 'C', title: 'Carbs (g)', color: 'bg-sun' },
  f: { label: 'F', title: 'Fat (g)', color: 'bg-won' },
}

// Normalise a macro gram value to a 0–100% bar width (caps keep bars sane).
const CAPS = { p: 70, c: 60, f: 40 }

export default function MacroChips({ macros, animate = true }) {
  if (!macros) return null

  return (
    <ul className="flex items-center gap-1.5" aria-label="Macros per serving">
      {(['p', 'c', 'f']).map((key) => {
        const meta = META[key]
        const value = macros[key] ?? 0
        const pct = Math.max(6, Math.min(100, (value / CAPS[key]) * 100))
        return (
          <li
            key={key}
            title={`${meta.title}: ${value}`}
            className="flex min-w-0 flex-1 items-center gap-1 rounded-md bg-white/5 px-1.5 py-1"
          >
            <span className="font-display text-[10px] font-bold text-white/70">{meta.label}</span>
            <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
              <motion.span
                className={`absolute inset-y-0 left-0 rounded-full ${meta.color}`}
                initial={animate ? { width: 0 } : false}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={animate ? undefined : { width: `${pct}%` }}
              />
            </span>
            <span className="font-display text-[10px] font-semibold tabular-nums text-white/80">
              {value}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
