import MenuCard from './MenuCard.jsx'

// One category section: heading + responsive grid of cards.
// The section id is what the sticky nav scrolls to / highlights.
export default function MenuSection({ category, reducedMotion, onAdded }) {
  if (!category.items.length) return null

  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-heading`}
      className="scroll-mt-32 py-6"
    >
      <div className="mb-4 flex items-baseline gap-3">
        <h2
          id={`${category.id}-heading`}
          className="font-display text-xl font-extrabold text-white sm:text-2xl"
        >
          {category.name}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-lime/40 to-transparent" />
        <span className="text-xs font-medium text-white/40">
          {category.items.length} item{category.items.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
        {category.items.map((item) => (
          <MenuCard
            key={item.id}
            item={item}
            categoryId={category.id}
            reducedMotion={reducedMotion}
            onAdded={onAdded}
          />
        ))}
      </div>
    </section>
  )
}
