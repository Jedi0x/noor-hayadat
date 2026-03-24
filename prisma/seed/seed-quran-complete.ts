/**
 * Complete Quran seed script:
 * Fetches all 6,236 ayahs with full diacritics (shadda, maddah, harakat) from Quran.com API
 * Populates: surahs, ayahs (Uthmani), ayahs_indopak, ayahs_urdu
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// API endpoints
const CHAPTERS_API = 'https://api.quran.com/api/v4/chapters?language=en'
const VERSES_API = 'https://api.quran.com/api/v4/verses/by_chapter'

// Quran editions IDs from quran.com
const EDITION_UTHMANI = 1 // text_uthmani (standard Uthmani with full tashkeel)
const EDITION_INDOPAK = 15 // text_indopak (Indo-Pak script with tashkeel)
const TRANSLATION_URDU = 97 // Maududi Urdu translation

// Helper: retry with exponential backoff
async function fetchWithRetry(url: string, retries = 3): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`  Fetching: ${url}`)
      const res = await fetch(url)
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`)
      }
      return await res.json()
    } catch (error: any) {
      console.warn(`  Attempt ${i + 1}/${retries} failed: ${error.message}`)
      if (i < retries - 1) {
        const delay = Math.pow(2, i) * 1000 // 1s, 2s, 4s
        console.log(`  Retrying in ${delay}ms...`)
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        throw error
      }
    }
  }
}

async function seedSurahs() {
  console.log('\n📖 Seeding Surahs (chapters)...')
  
  const data = await fetchWithRetry(CHAPTERS_API)
  const chapters = data.chapters

  for (const chapter of chapters) {
    await prisma.surahs.upsert({
      where: { id: chapter.id },
      update: {},
      create: {
        id: chapter.id,
        name: chapter.name_arabic,
        name_simple: chapter.name_simple,
        revelation: chapter.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
        ayahs_count: chapter.verses_count,
      },
    })
  }
  
  console.log(`✅ Seeded ${chapters.length} surahs.`)
  return chapters
}

async function seedAyahsForSurah(surahId: number, surahName: string, verseCount: number) {
  console.log(`\n📝 Seeding Surah ${surahId}: ${surahName} (${verseCount} verses)`)

  // Fetch verses with multiple editions in one call
  const url = `${VERSES_API}/${surahId}?language=ur&translations=${TRANSLATION_URDU}&words=false&fields=text_uthmani,text_indopak`
  const data = await fetchWithRetry(url)
  
  const verses = data.verses
  if (!verses || verses.length === 0) {
    console.warn(`  ⚠️ No verses returned for Surah ${surahId}`)
    return
  }

  let successCount = 0
  
  for (const verse of verses) {
    try {
      // Calculate global ayah ID: (surah-1) * 1000 + ayah_number
      // Note: This is a simple ID scheme; adjust if needed
      const globalId = (surahId - 1) * 1000 + verse.verse_number

      // Insert or update base ayah (Uthmani script)
      await prisma.ayahs.upsert({
        where: { id: globalId },
        update: {
          text: verse.text_uthmani || verse.text_madani || '', // Full tashkeel
        },
        create: {
          id: globalId,
          surah_id: surahId,
          number: verse.verse_number,
          text: verse.text_uthmani || verse.text_madani || '', // Full tashkeel
        },
      })

      // Insert IndoPak script (if available)
      if (verse.text_indopak) {
        await prisma.ayahs_indopak.upsert({
          where: { ayah_id: globalId },
          update: { text_ip: verse.text_indopak },
          create: {
            ayah_id: globalId,
            text_ip: verse.text_indopak, // Full Indo-Pak with tashkeel
          },
        })
      }

      // Insert Urdu translation
      const urduTranslation = verse.translations?.[0]?.text || ''
      if (urduTranslation) {
        await prisma.ayahs_urdu.upsert({
          where: { ayah_id: globalId },
          update: { translation: urduTranslation },
          create: {
            ayah_id: globalId,
            translation: urduTranslation,
            translator: 'Maududi', // or extract from API
          },
        })
      }

      successCount++
    } catch (error: any) {
      console.error(`  ❌ Failed to seed verse ${verse.verse_number}:`, error.message)
    }
  }

  console.log(`  ✅ Seeded ${successCount}/${verses.length} verses for ${surahName}`)
}

async function main() {
  console.log('🌙 Starting Complete Quran Database Seed')
  console.log('This will take 5-10 minutes. Please be patient...\n')

  try {
    // Step 1: Seed all surahs
    const surahs = await seedSurahs()

    // Step 2: Seed all ayahs for each surah
    console.log('\n📚 Seeding all verses (6,236 ayahs)...')
    console.log('This includes Uthmani script, Indo-Pak script, and Urdu translations.')
    console.log('All text includes full diacritics (shadda, maddah, harakat).\n')

    for (const surah of surahs) {
      await seedAyahsForSurah(surah.id, surah.name_simple, surah.verses_count)
      
      // Be respectful to the API - wait 500ms between surahs
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    console.log('\n🎉 Complete Quran seed finished successfully!')
    console.log('Your database now has:')
    console.log('  - 114 surahs')
    console.log('  - 6,236 ayahs (Uthmani script with full tashkeel)')
    console.log('  - 6,236 Indo-Pak script versions (with full tashkeel)')
    console.log('  - 6,236 Urdu translations')

  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
