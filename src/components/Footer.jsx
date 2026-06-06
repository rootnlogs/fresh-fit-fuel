import { WonMark } from './Logo.jsx'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-12 border-t border-white/10 px-5 py-10 text-center">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
        <WonMark />
        <p className="max-w-md text-sm text-white/50">
          <span className="font-semibold text-white/70">Way of Nutrition</span> — real food, honest
          macros, built to fuel your goals. Eat clean. Train hard. Fuel right.
        </p>
        <p className="text-xs text-white/30">
          © {year} Fresh Fit Fuel by WON. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
