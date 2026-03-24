import React from 'react'

export const IslamicPattern: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={className} aria-hidden="true">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Subtle traditional Islamic geometric pattern */}
          <pattern id="traditional-pattern" width="160" height="160" patternUnits="userSpaceOnUse">
            {/* Central star */}
            <circle 
              cx="80" 
              cy="80" 
              r="3" 
              fill="currentColor" 
              fillOpacity="0.15" 
            />
            
            {/* 8-point star rays */}
            <path
              d="M80 70L82 78L90 80L82 82L80 90L78 82L70 80L78 78Z"
              fill="currentColor"
              fillOpacity="0.12"
            />
            
            {/* Outer decorative circles */}
            <circle cx="80" cy="80" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.08" />
            <circle cx="80" cy="80" r="35" fill="none" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.05" />
            
            {/* Corner ornaments */}
            <circle cx="0" cy="0" r="4" fill="currentColor" fillOpacity="0.08" />
            <circle cx="160" cy="0" r="4" fill="currentColor" fillOpacity="0.08" />
            <circle cx="0" cy="160" r="4" fill="currentColor" fillOpacity="0.08" />
            <circle cx="160" cy="160" r="4" fill="currentColor" fillOpacity="0.08" />
            
            {/* Connecting lines */}
            <line x1="20" y1="80" x2="60" y2="80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
            <line x1="100" y1="80" x2="140" y2="80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
            <line x1="80" y1="20" x2="80" y2="60" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
            <line x1="80" y1="100" x2="80" y2="140" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.06" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#traditional-pattern)" />
      </svg>
    </div>
  )
}
