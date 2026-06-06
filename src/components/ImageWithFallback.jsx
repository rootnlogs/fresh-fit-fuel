import { useState } from 'react'

// Lazy-loaded food image with a blur-up placeholder and a graceful, branded
// fallback if the photo fails to load (so a dead CDN link never breaks a card).
export default function ImageWithFallback({ image, alt, emoji = '🍽️', className = '' }) {
  const [loaded, setLoaded] = useState(false)
  const [errored, setErrored] = useState(false)

  // No mapped image, or it failed → branded placeholder.
  if (!image || errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-navy-700 to-navy-900 ${className}`}
      >
        <span className="text-4xl opacity-70 select-none" aria-hidden="true">
          {emoji}
        </span>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden bg-navy-800 ${className}`}>
      {/* Blurred low-res placeholder, fades out once the full image is ready */}
      <img
        src={image.blur}
        alt=""
        aria-hidden="true"
        className={`absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-500 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      />
      <img
        src={image.full}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
