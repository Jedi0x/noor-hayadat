import React from 'react'

export const ArabicDisplay: React.FC<{ text: string; variant?: 'indopak' | 'naskh' }> = ({ text, variant = 'indopak' }) => {
  return (
    <div className="w-full py-8 px-4 sm:px-6 bg-white/80 rounded-2xl border border-emerald-950/15 shadow-inner">
      <p
        dir="rtl"
        lang="ar"
        className={`text-emerald-950 w-full text-start [unicode-bidi:plaintext] whitespace-pre-wrap break-words ${
          variant === 'indopak' ? 'arabic-indopak' : 'arabic-naskh'
        }`}
      >
        {text}
      </p>
    </div>
  )
}
