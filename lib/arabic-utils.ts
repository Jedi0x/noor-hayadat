/**
 * Utility for normalizing Arabic text for fuzzy matching.
 */
export const normalizeArabic = (text: string): string => {
  if (!text) return ''

  return text
    // Strip diacritics (tashkeel)
    .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
    // Normalize Alef variants
    .replace(/[\u0622\u0623\u0625]/g, '\u0627')
    // Normalize Teh Marbuta to Heh
    .replace(/\u0629/g, '\u0647')
    // Normalize Alef Maksura to Yeh
    .replace(/\u0649/g, '\u064A')
    // Normalize various Hamza variants to standard Hamza
    .replace(/[\u0624\u0626]/g, '\u0621')
    // Remove tatweel (stretching)
    .replace(/\u0640/g, '')
    // Remove punctuation
    .replace(/[\u060C\u061B\u061F\u06D4\u06D1]/g, '')
    // Remove spaces and newlines for strict comparison
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Strips all non-Arabic characters for clean matching.
 */
export const stripNonArabic = (text: string): string => {
  return text.replace(/[^\u0600-\u06FF\s]/g, '').trim()
}
