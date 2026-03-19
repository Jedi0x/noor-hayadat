import prisma from './prisma'
import { normalizeArabic } from './arabic-utils'

export async function lookupHadith(params: {
  hadith_book?: string | null
  hadith_number?: string | null
  extracted_arabic: string
}) {
  const { hadith_book, hadith_number, extracted_arabic } = params
  const normalizedInput = normalizeArabic(extracted_arabic)

  // 1. Direct match by book + number
  if (hadith_book && hadith_number) {
    const book = await prisma.hadith_books.findUnique({
      where: { identifier: hadith_book.toLowerCase() }
    })
    if (book) {
      const hadith = await prisma.hadiths.findFirst({
        where: {
          book_id: book.id,
          hadith_no: hadith_number
        }
      })
      if (hadith) return formatResult(hadith, book)
    }
  }

  // 2. Fallback to sunnah.com search (requires API key usually, but basic check)
  // For MVP, we'll just search our DB hadiths table with fuzzy text
  const book = hadith_book ? await prisma.hadith_books.findUnique({ where: { identifier: hadith_book.toLowerCase() } }) : null
  const where = book ? { book_id: book.id } : {}
  
  // Real implementation would use full-text search
  const hadiths = await prisma.hadiths.findMany({ where, take: 50 })
  // Basic search:
  const match = hadiths.find(h => normalizeArabic(h.text_ar).includes(normalizedInput) || normalizedInput.includes(normalizeArabic(h.text_ar)))
  
  if (match) {
    const bookOfMatch = await prisma.hadith_books.findUnique({ where: { id: match.book_id } })
    return formatResult(match, bookOfMatch)
  }

  return null
}

function formatResult(hadith: any, book: any) {
  return {
    success: true,
    type: 'HADITH',
    arabic_indopak: hadith.text_ar, // Typically same for hadith
    urdu_translation: hadith.text_ur || '',
    reference: {
      type: 'hadith',
      book_name_ar: book.name_ar,
      book_name_en: book.name_en,
      book_name_ur: book.name_ur,
      hadith_number: hadith.hadith_no,
      grade: hadith.grade
    }
  }
}
