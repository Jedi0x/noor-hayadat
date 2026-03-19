import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const HADITH_BOOKS = [
  { identifier: 'bukhari', name_en: 'Sahih al-Bukhari', name_ar: 'صحيح البخاري', name_ur: 'صحیح بخاری' },
  { identifier: 'muslim', name_en: 'Sahih Muslim', name_ar: 'صحيح مسلم', name_ur: 'صحیح مسلم' },
  { identifier: 'abudawud', name_en: 'Sunan Abi Dawud', name_ar: 'سنن أبي داود', name_ur: 'سنن ابی داؤد' },
  { identifier: 'tirmidhi', name_en: 'Jami` at-Tirmidhi', name_ar: 'جامع الترمذي', name_ur: 'جامع ترمذی' },
  { identifier: 'nasai', name_en: 'Sunan an-Nasa\'i', name_ar: 'سنن النسائي', name_ur: 'سنن نسائی' },
  { identifier: 'ibnmajah', name_en: 'Sunan Ibn Majah', name_ar: 'سنن ابن ماجه', name_ur: 'سنن ابن ماجہ' },
]

async function main() {
  console.log('Seeding Hadith Books...')

  for (const book of HADITH_BOOKS) {
    await prisma.hadith_books.upsert({
      where: { identifier: book.identifier },
      update: {},
      create: book,
    })
  }
  console.log(`Successfully seeded ${HADITH_BOOKS.length} hadith books.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
