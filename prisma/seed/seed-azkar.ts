import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const SAMPLE_AZKAR = [
  {
    category: 'morning',
    text_ar: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    text_ur: 'ہم نے صبح کی اور اللہ کے ملک نے صبح کی، اور سب تعریفیں اللہ ہی کے لیے ہیں، اللہ کے سوا کوئی معبود نہیں وہ اکیلا ہے اس کا کوئی شریک نہیں، اسی کی بادشاہی ہے اور اسی کے لیے تعریف ہے اور وہ ہر چیز پر قادر ہے۔',
    reference: 'Sahih Muslim 4/2088',
    source_book: 'Hisnul Muslim',
    repetitions: 1,
  },
  {
    category: 'morning',
    text_ar: 'اللَّهُمَّ بِكَ أَصْبَحْنَا، وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا، وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
    text_ur: 'اے اللہ! تیری ہی مدد سے ہم نے صبح کی اور تیری ہی مدد سے ہم نے شام کی، اور تیری ہی مدد سے ہم جیتے ہیں اور تیری ہی مدد سے ہم مریں گے اور تیری ہی طرف لوٹنا ہے۔',
    reference: 'Abu Dawud, Tirmidhi, Ibn Majah',
    source_book: 'Hisnul Muslim',
    repetitions: 1,
  }
]

async function main() {
  console.log('Seeding Sample Azkar...')

  for (const azkar of SAMPLE_AZKAR) {
    await prisma.azkar.create({
      data: azkar,
    })
  }
  console.log(`Successfully seeded ${SAMPLE_AZKAR.length} sample azkar.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
