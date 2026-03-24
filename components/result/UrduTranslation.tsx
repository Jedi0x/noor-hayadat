import React from 'react'

export const UrduTranslation: React.FC<{
  text: string
  embedded?: boolean
}> = ({ text, embedded = false }) => {
  if (!text) return null

  return (
    <div className={`w-full ${embedded ? '' : 'border-t-2 border-sage-200/40 pt-12'}`}>
      <div className="relative overflow-hidden bg-gradient-to-br from-sage-50 via-sand-50/60 to-sage-50 rounded-[2rem] p-9 border-2 border-sage-200/40 shadow-soft">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-transparent via-sage-300/40 to-transparent"></div>
        
        <h3 className="text-xs font-bold text-bronze-600 uppercase tracking-[0.2em] mb-6">
          Urdu meaning (اردو ترجمہ)
        </h3>
        
        <p dir="rtl" className="urdu-text text-sage-800 leading-[2.8] text-xl">
          {text}
        </p>
      </div>
    </div>
  )
}
