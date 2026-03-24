'use client'

import React, { useMemo } from 'react'
import { Book, Heart } from 'lucide-react'
import { Reference } from '@/types'

function normalizeReference(ref: Reference | null | undefined): Reference {
  if (!ref || typeof ref !== 'object') {
    return { type: 'dua', reference_text: 'Unknown reference' }
  }
  return ref
}

export const ReferenceBar: React.FC<{ reference?: Reference | null }> = ({ reference }) => {
  const { display, isDua } = useMemo(() => {
    const r = normalizeReference(reference)
    if (r.type === 'quran') {
      const surah = r.surah_name_ar ?? '—'
      const ayah = r.ayat_start ?? '—'
      return {
        isDua: false,
        display: `The Holy Quran · Surah ${surah} · Ayah ${ayah}`,
      }
    }
    if (r.type === 'hadith') {
      const book = r.book_name_en ?? r.book_name_ur ?? 'Hadith'
      const num = r.hadith_number ?? '—'
      return { isDua: false, display: `${book} · Hadith ${num}` }
    }
    if (r.type === 'azkar') {
      const cat = r.category ? `${r.category} · ` : ''
      return {
        isDua: false,
        display: `${cat}${r.reference_text || r.source || 'Remembrance (Azkar)'}`,
      }
    }
    if (r.type === 'dua') {
      const title = r.dua_name_en || r.dua_name_ar || 'Supplication'
      const extra = r.reference_text && r.reference_text !== title ? ` · ${r.reference_text}` : ''
      return { isDua: true, display: `${title}${extra}` }
    }
    return {
      isDua: false,
      display: r.text || r.reference_text || 'Unknown reference',
    }
  }, [reference])

  const Icon = isDua ? Heart : Book

  return (
    <div className="inline-flex items-center gap-3 bg-gradient-to-r from-bronze-100/70 to-sand-100/70 px-5 py-2.5 rounded-full border-2 border-bronze-300/40 shadow-soft backdrop-blur-sm">
      <div className="flex items-center justify-center">
        <Icon className="w-4 h-4 text-bronze-600" strokeWidth={2.5} aria-hidden />
      </div>
      <span className="text-xs font-bold uppercase tracking-wider text-sage-900 leading-tight">{display}</span>
    </div>
  )
}
