import React from 'react'

export const ArabicDisplay: React.FC<{
  text: string
  variant?: 'indopak' | 'naskh' | 'nabi'
}> = ({ text, variant = 'indopak' }) => {
  const cssClass = variant === 'nabi' ? 'arabic-nabi' : variant === 'naskh' ? 'arabic-naskh' : 'arabic-indopak'
  
  return (
    <div className="relative w-full py-10 sm:py-14 px-8 sm:px-12 bg-gradient-to-b from-white via-sand-50/40 to-white rounded-[3rem] border-2 border-sage-200/50 shadow-soft-lg overflow-hidden">
      {/* Traditional Mushaf border decoration */}
      <div className="absolute inset-0 rounded-[3rem] border-[3px] border-bronze-300/10 pointer-events-none"></div>
      
      {/* Corner ornaments - traditional Islamic geometry */}
      <svg className="absolute top-0 left-0 w-24 h-24 text-bronze-300/25" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M0 0 L30 0 L30 5 L5 5 L5 30 L0 30 Z" fill="currentColor" />
        <circle cx="15" cy="15" r="3" fill="currentColor" opacity="0.6" />
      </svg>
      
      <svg className="absolute top-0 right-0 w-24 h-24 text-bronze-300/25" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M100 0 L70 0 L70 5 L95 5 L95 30 L100 30 Z" fill="currentColor" />
        <circle cx="85" cy="15" r="3" fill="currentColor" opacity="0.6" />
      </svg>
      
      <svg className="absolute bottom-0 left-0 w-24 h-24 text-bronze-300/25" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M0 100 L30 100 L30 95 L5 95 L5 70 L0 70 Z" fill="currentColor" />
        <circle cx="15" cy="85" r="3" fill="currentColor" opacity="0.6" />
      </svg>
      
      <svg className="absolute bottom-0 right-0 w-24 h-24 text-bronze-300/25" viewBox="0 0 100 100" aria-hidden="true">
        <path d="M100 100 L70 100 L70 95 L95 95 L95 70 L100 70 Z" fill="currentColor" />
        <circle cx="85" cy="85" r="3" fill="currentColor" opacity="0.6" />
      </svg>

      {/* Subtle decorative dots at mid-points */}
      <div className="absolute top-1/2 left-4 -translate-y-1/2 w-2 h-2 rounded-full bg-bronze-400/30"></div>
      <div className="absolute top-1/2 right-4 -translate-y-1/2 w-2 h-2 rounded-full bg-bronze-400/30"></div>

      {/* Arabic Text */}
      <p
        dir="rtl"
        lang="ar"
        className={`relative z-10 w-full text-center [unicode-bidi:plaintext] whitespace-pre-wrap break-words ${cssClass}`}
      >
        {text}
      </p>
    </div>
  )
}
