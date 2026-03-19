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
        display: `The Holy Quran | Surah ${surah} | Ayah: ${ayah}`,
      }
    }
    if (r.type === 'hadith') {
      const book = r.book_name_en ?? r.book_name_ur ?? 'Hadith'
      const num = r.hadith_number ?? '—'
      return { isDua: false, display: `${book} | Hadith: ${num}` }
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
      return { isDua: true, display: `Dua | ${title}${extra}` }
    }
    return {
      isDua: false,
      display: r.text || r.reference_text || 'Unknown reference',
    }
  }, [reference])

  const Icon = isDua ? Heart : Book

  return (
    <div className="flex items-center bg-gold-500/10 px-4 py-2 rounded-full border border-gold-500/20 max-w-[min(100%,42rem)]">
      <Icon className="w-4 h-4 text-gold-500 mr-2 shrink-0" aria-hidden />
      <span className="text-sm font-bold text-emerald-950/70 text-left leading-snug">{display}</span>
    </div>
  )
}
