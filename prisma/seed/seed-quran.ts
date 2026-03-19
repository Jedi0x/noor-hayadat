import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Surahs...')

  try {
    const res = await fetch('https://api.quran.com/api/v4/chapters?language=en')
    const data = await res.json()
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
    console.log(`Successfully seeded ${chapters.length} surahs.`)
  } catch (error) {
    console.error('Error seeding surahs:', error)
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
