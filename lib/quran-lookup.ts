import prisma from './prisma'
import { normalizeArabic } from './arabic-utils'
import Fuse from 'fuse.js'

export async function lookupAyat(params: {
  surah_number?: number | null
  surah_name?: string | null
  ayat_start?: number | null
  ayat_end?: number | null
  extracted_arabic: string
}) {
  const { surah_number, ayat_start, extracted_arabic } = params
  const normalizedInput = normalizeArabic(extracted_arabic)

  // 1. Direct match if surah + ayat known
  if (surah_number && ayat_start) {
    const ayat = await prisma.ayahs.findFirst({
      where: {
        surah_id: surah_number,
        number: ayat_start
      },
      include: {
        surah: true,
        ayahs_indopak: true,
        ayahs_urdu: true
      }
    })
    if (ayat) return enrichResult(ayat)
  }

  // 2. Fuzzy match in surah if surah known
  if (surah_number) {
    const ayahsInSurah = await prisma.ayahs.findMany({
      where: { surah_id: surah_number },
      include: { surah: true, ayahs_indopak: true, ayahs_urdu: true }
    })
    const bestMatch = findBestMatch(ayahsInSurah, normalizedInput)
    if (bestMatch) return enrichResult(bestMatch)
  }

  // 3. Global fuzzy match (limited for performance)
  // In a real app, you'd use pg_trgm for this in the DB
  // For now, we'll try to find ayahs that contain key words or use pg_trgm if available
  // Fallback to quran.com API
  return fallbackToQuranCom(normalizedInput)
}

function findBestMatch(ayahs: any[], input: string) {
  const fuse = new Fuse(ayahs, {
    keys: ['text'],
    threshold: 0.4,
    includeScore: true
  })
  
  // Note: For better matching, we should store normalized_text in DB
  // Here we'll just do a basic search
  const results = fuse.search(input)
  return results.length > 0 ? results[0].item : null
}

async function fallbackToQuranCom(text: string) {
  try {
    const res = await fetch(`https://api.quran.com/api/v4/search?q=${encodeURIComponent(text)}&size=1&language=ur`)
    const data = await res.json()
    if (data.search && data.search.results && data.search.results.length > 0) {
      const best = data.search.results[0]
      // Fetch full details from our DB or return what we got
      const [surah_id, ayat_num] = best.verse_key.split(':').map(Number)
      const ayat = await prisma.ayahs.findFirst({
        where: { surah_id, number: ayat_num },
        include: { surah: true, ayahs_indopak: true, ayahs_urdu: true }
      })
      if (ayat) return enrichResult(ayat)
    }
  } catch (e) {
    console.error('Quran.com fallback error:', e)
  }
  return null
}

function enrichResult(ayat: any) {
  return {
    success: true,
    type: 'AYAT',
    arabic_indopak: ayat.ayahs_indopak?.text_ip || ayat.text,
    arabic_uthmani: ayat.text,
    urdu_translation: ayat.ayahs_urdu?.translation || '',
    reference: {
      type: 'quran',
      surah_name_ar: ayat.surah.name,
      surah_name_ur: '', // Could add this to DB
      surah_number: ayat.surah_id,
      ayat_start: ayat.number,
      ayat_end: ayat.number,
      juz: 0, // Could fetch this
      page: 0
    },
    audio_url: `https://everyayah.com/data/Alafasy_128kbps/${String(ayat.surah_id).padStart(3, '0')}${String(ayat.number).padStart(3, '0')}.mp3`
  }
}
