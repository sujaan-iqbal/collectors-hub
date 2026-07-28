import { useState } from 'react'

interface SafeImageProps {
  src?: string | null
  alt: string
  className?: string
}

export function SafeImage({ src, alt, className }: SafeImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-paper-dim text-muted ${className ?? ''}`}
        role="img"
        aria-label={`${alt} — image unavailable`}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M4 16L8.586 11.414A2 2 0 0111.414 11.414L16 16M14 14L15.586 12.414A2 2 0 0118.414 12.414L20 14M4 8H4.01M4 4H20A2 2 0 0122 6V18A2 2 0 0120 20H4A2 2 0 012 18V6A2 2 0 014 4Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
