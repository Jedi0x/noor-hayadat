import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/styles/arabic.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: 'QuranScan — Identify Quranic Verses, Hadith & Azkar',
  description: 'Traditional Indo-Pak Mushaf typography meets AI-powered recognition. Identify and share Islamic texts with authentic Arabic rendering.',
  keywords: ['Quran', 'Ayat', 'Hadith', 'Azkar', 'Islamic', 'Arabic', 'OCR', 'AI'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="ltr" className="scroll-smooth">
      <head>
        {/* Google Fonts - Traditional Arabic & Urdu */}
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Amiri:ital,wght@0,400;0,700;1,400&family=Lateef:wght@400;700&family=Noto+Naskh+Arabic:wght@400..700&family=Noto+Nastaliq+Urdu:wght@400..700&family=Scheherazade+New:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}>
        <Header />
        <main className="flex-1 relative">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
