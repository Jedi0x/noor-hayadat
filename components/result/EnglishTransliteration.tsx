'use client'

import React from 'react'

type Props = {
  transliteration?: string | null
  englishMeaning?: string | null
}

export const EnglishTransliteration: React.FC<Props> = ({
  transliteration,
  englishMeaning,
}) => {
  const tr = transliteration?.trim()
  const en = englishMeaning?.trim()
  if (!tr && !en) return null

  return (
    <div className="w-full space-y-6 border-t border-emerald-950/10 pt-8">
      {tr ? (
        <div>
          <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-3">
            English transliteration
          </h3>
          <p
            dir="ltr"
            lang="en"
            className="text-base sm:text-lg text-emerald-950 leading-relaxed font-medium text-left"
          >
            {tr}
          </p>
        </div>
      ) : null}
      {en ? (
        <div>
          <h3 className="text-[10px] font-black text-gold-600 uppercase tracking-[0.2em] mb-3">
            English meaning
          </h3>
          <p
            dir="ltr"
            lang="en"
            className="text-sm sm:text-base text-emerald-900/85 leading-relaxed text-left italic"
          >
            {en}
          </p>
        </div>
      ) : null}
    </div>
  )
}
