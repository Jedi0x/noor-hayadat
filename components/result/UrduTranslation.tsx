import React from 'react'

export const UrduTranslation: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null

  return (
    <div className="w-full border-t border-emerald-950/10 pt-8">
      <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-6">Urdu Translation</h3>
      <p dir="rtl" className="urdu-text text-emerald-950 leading-[2.5] text-xl sm:text-2xl">
        {text}
      </p>
    </div>
  )
}
