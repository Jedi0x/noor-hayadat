import prisma from './prisma'
import { normalizeArabic } from './arabic-utils'
import Fuse from 'fuse.js'

export async function lookupAzkar(params: {
  azkar_category?: string | null
  dua_name?: string | null
  extracted_arabic: string
}) {
  const { azkar_category, extracted_arabic } = params
  const normalizedInput = normalizeArabic(extracted_arabic)

  const where = azkar_category ? { category: azkar_category } : {}
  const azkars = await prisma.azkar.findMany({ where })

  const fuse = new Fuse(azkars, {
    keys: ['text_ar'],
    threshold: 0.4,
    includeScore: true
  })

  const results = fuse.search(normalizedInput)
  if (results.length > 0) {
    const match = results[0].item
    return {
      success: true,
      type: 'AZKAR',
      arabic_indopak: match.text_ar_ip || match.text_ar,
      urdu_translation: match.text_ur || '',
      reference: {
        type: 'azkar',
        category: match.category,
        reference_text: match.reference,
        source: match.source_book
      },
      repetitions: match.repetitions,
      benefits: match.benefits
    }
  }

  return null
}
