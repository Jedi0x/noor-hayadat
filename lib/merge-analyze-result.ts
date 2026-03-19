import type { GeminiResult } from './gemini'

/** Attach AI transliteration / translations when DB lookup did not provide them */
export function mergeGeminiMetadata(
  base: Record<string, unknown>,
  g: GeminiResult
): Record<string, unknown> {
  const transliteration =
    (base.transliteration as string) || g.transliteration_en || ''
  const english_translation =
    (base.english_translation as string) || g.translation_en || ''
  const urdu_translation =
    (base.urdu_translation as string) || g.translation_ur || ''

  return {
    ...base,
    transliteration,
    english_translation,
    urdu_translation,
  }
}

/** When Azkar DB has no row but text is DUA or AZKAR */
export function buildSupplicationFallback(g: GeminiResult) {
  const isAzkar = g.type === 'AZKAR'
  return {
    success: true,
    type: g.type,
    arabic_indopak: g.extracted_arabic,
    urdu_translation: g.translation_ur || '',
    transliteration: g.transliteration_en || '',
    english_translation: g.translation_en || '',
    reference: {
      type: isAzkar ? 'azkar' : 'dua',
      dua_name_ar: g.dua_name || undefined,
      dua_name_en: g.dua_name_en || undefined,
      category: g.azkar_category || undefined,
      reference_text:
        g.dua_name_en ||
        g.dua_name ||
        g.reference_in_image ||
        (isAzkar ? 'Remembrance (Azkar)' : 'Islamic supplication (Dua)'),
      source: g.notes || undefined,
    },
  }
}

export function buildHadithFallback(g: GeminiResult) {
  return {
    success: true,
    type: 'HADITH' as const,
    arabic_indopak: g.extracted_arabic,
    urdu_translation: g.translation_ur || '',
    transliteration: g.transliteration_en || '',
    english_translation: g.translation_en || '',
    reference: {
      type: 'hadith' as const,
      book_name_en: g.hadith_book || undefined,
      hadith_number: g.hadith_number || undefined,
      reference_text: g.reference_in_image || undefined,
    },
  }
}

export function buildUnknownFallback(g: GeminiResult) {
  return {
    success: true,
    type: 'UNKNOWN' as const,
    arabic_indopak: g.extracted_arabic,
    urdu_translation: g.translation_ur || '',
    transliteration: g.transliteration_en || '',
    english_translation: g.translation_en || '',
    reference: {
      type: 'dua' as const,
      dua_name_en: 'Unclassified text',
      reference_text:
        g.reference_in_image ||
        g.notes ||
        'Could not match Quran, Hadith, or Azkar database',
    },
  }
}

/** Quran lookup missed — still show whatever the model extracted */
export function buildQuranFallback(g: GeminiResult) {
  return {
    success: true,
    type: 'AYAT' as const,
    arabic_indopak: g.extracted_arabic,
    urdu_translation: g.translation_ur || '',
    transliteration: g.transliteration_en || '',
    english_translation: g.translation_en || '',
    reference: {
      type: 'quran' as const,
      surah_name_ar: g.surah_name || undefined,
      surah_number: g.surah_number ?? undefined,
      ayat_start: g.ayat_start ?? undefined,
      ayat_end: g.ayat_end ?? g.ayat_start ?? undefined,
      reference_text: g.reference_in_image || undefined,
    },
  }
}
