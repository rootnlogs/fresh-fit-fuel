// Indian-menu style veg indicator: bordered square with a centered dot.
// Green = veg, red = non-veg. Includes an accessible label.
export default function VegDot({ veg, className = '' }) {
  const color = veg ? '#8BC53F' : '#E2231A'
  const label = veg ? 'Vegetarian' : 'Non-vegetarian'
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`flex h-4 w-4 items-center justify-center rounded-[3px] border-2 bg-white/90 ${className}`}
      style={{ borderColor: color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
    </span>
  )
}
