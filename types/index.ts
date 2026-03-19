export type ResultType = 'AYAT' | 'HADITH' | 'DUA' | 'AZKAR' | 'UNKNOWN'
export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW'

export interface Reference {
  type: 'quran' | 'hadith' | 'azkar' | 'dua'
  surah_name_ar?: string
  surah_name_ur?: string
  surah_number?: number
  ayat_start?: number
  ayat_end?: number
  juz?: number
  page?: number
  book_name_ar?: string
  book_name_en?: string
  book_name_ur?: string
  hadith_number?: string
  grade?: string
  category?: string
  reference_text?: string
  source?: string
  text?: string
  /** Common name of the dua in Arabic (from AI) */
  dua_name_ar?: string
  /** Common name in English e.g. "Dua when drinking Zamzam" */
  dua_name_en?: string
}

export interface AnalyzeResponse {
  success: boolean
  type: ResultType
  confidence: ConfidenceLevel
  arabic_indopak: string
  arabic_uthmani?: string
  urdu_translation: string
  /** Latin-letter transliteration e.g. Allahumma inni as'aluka... */
  transliteration?: string
  /** Plain English meaning (not Arabic script) */
  english_translation?: string
  reference: Reference
  audio_url?: string
  cached: boolean
  notes?: string
  repetitions?: number
  benefits?: string
}
