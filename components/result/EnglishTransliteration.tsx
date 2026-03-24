'use client'

import React from 'react'

type Props = {
  transliteration?: string | null
  englishMeaning?: string | null
  embedded?: boolean
}

export const EnglishTransliteration: React.FC<Props> = ({
  transliteration,
  englishMeaning,
  embedded = false,
}) => {
  const tr = transliteration?.trim()
  const en = englishMeaning?.trim()
  if (!tr && !en) return null

  return (
    <div className={`w-full space-y-8 ${embedded ? '' : 'border-t-2 border-sage-200/40 pt-12'}`}>
      {tr ? (
        <div className="relative overflow-hidden bg-white/80 rounded-[2rem] p-8 border-2 border-sage-200/40 shadow-soft">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-bronze-300/40 to-transparent"></div>
          <h3 className="text-xs font-bold text-bronze-600 uppercase tracking-[0.2em] mb-5">
            Transliteration
          </h3>
          <p
            dir="ltr"
            lang="en"
            className="text-transliteration text-sage-800"
          >
            {tr}
          </p>
        </div>
      ) : null}

      {en ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-sand-50 via-sage-50/40 to-sand-50 rounded-[2rem] p-8 border-2 border-sage-200/40 shadow-soft">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sage-300/40 to-transparent"></div>
          <h3 className="text-xs font-bold text-bronze-600 uppercase tracking-[0.2em] mb-5">
            English meaning
          </h3>
          <p
            dir="ltr"
            lang="en"
            className="text-lg text-sage-700 leading-relaxed font-medium"
          >
            {en}
          </p>
        </div>
      ) : null}
    </div>
  )
}
