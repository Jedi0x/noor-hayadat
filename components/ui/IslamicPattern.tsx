import React from 'react'

export const IslamicPattern: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="premium-pattern" width="120" height="120" patternUnits="userSpaceOnUse">
            {/* Elegant Geometric Star Shape */}
            <path
              d="M60 0L75 45L120 60L75 75L60 120L45 75L0 60L45 45Z"
              fill="currentColor"
              fillOpacity="0.5"
            />
            <circle cx="60" cy="60" r="10" fill="none" stroke="currentColor" strokeWidth="1" />
            <path
              d="M60 20L65 40L100 45L65 50L60 80L55 50L20 45L55 40Z"
              fill="currentColor"
              fillOpacity="0.2"
              transform="translate(0, 0) scale(0.8) translate(15, 15)"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#premium-pattern)" />
      </svg>
    </div>
  )
}
