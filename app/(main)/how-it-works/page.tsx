import Link from 'next/link'
import { ArrowLeft, Upload, Scan, BookOpen, Share2, Sparkles } from 'lucide-react'
import { IslamicPattern } from '@/components/ui/IslamicPattern'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'How it works — QuranScan',
  description:
    'Learn how QuranScan identifies Quranic ayat, hadith, and duas using AI, traditional Indo-Pak typography, and authentic database matching.',
}

const steps = [
  {
    icon: Upload,
    title: 'Upload or crop',
    body: 'Drop a screenshot or photo of Arabic text from the Quran, a hadith collection, or a dua card. Use the built-in crop tool to focus precisely on the text you want to identify.',
  },
  {
    icon: Scan,
    title: 'AI analysis with fallback',
    body: 'We analyze your image with Google Gemini Vision. If API limits apply, we automatically fall back to local OCR (Tesseract) plus a text-based AI model—ensuring you can always scan.',
  },
  {
    icon: BookOpen,
    title: 'Database matching',
    body: 'We match the extracted text against your local database of 6,236 Quranic verses (with full diacritics), hadith collections, and common azkar—providing verified references, English transliteration, and Urdu translations.',
  },
  {
    icon: Share2,
    title: 'Traditional rendering',
    body: 'Arabic text is displayed in authentic Indo-Pak Mushaf fonts (Al Qalam Quran, PDMS Saleem, Al Majeed) with all harakat, shadda, and maddah preserved. Download as an image, copy text, or share with others.',
  },
]

export default function HowItWorksPage() {
  return (
    <div className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <IslamicPattern className="absolute inset-0 opacity-[0.015] pointer-events-none text-bronze-300" />

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/"
          className="group inline-flex items-center gap-2.5 text-sm font-semibold text-sage-600 hover:text-sage-900 mb-16 uppercase tracking-wide transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" strokeWidth={2.5} />
          Back to scan
        </Link>

        {/* Page Header */}
        <div className="mb-20 text-center">
          <div className="relative inline-block mb-6">
            <h1 className="text-6xl sm:text-7xl font-bold text-sage-900 tracking-tight relative z-10">
              How it works
            </h1>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-transparent via-bronze-400 to-transparent"></div>
          </div>
          <p className="text-xl text-sage-600 max-w-2xl mx-auto leading-relaxed mt-8">
            QuranScan combines traditional Indo-Pak Mushaf calligraphy with modern AI to identify and
            beautifully render Islamic texts from screenshots.
          </p>
        </div>

        {/* Steps */}
        <ol className="space-y-10 mb-20">
          {steps.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              className="group relative flex gap-8 p-10 sm:p-12 rounded-[2.5rem] bg-white/80 backdrop-blur-sm border-2 border-sage-200/50 shadow-soft hover:shadow-soft-lg transition-all duration-300"
            >
              {/* Hover glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-bronze-400/0 via-bronze-400/10 to-bronze-400/0 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Step Number */}
              <div className="shrink-0 relative">
                <div className="absolute inset-0 bg-bronze-400/25 rounded-2xl blur-xl group-hover:bg-bronze-400/40 transition-all duration-300"></div>
                <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-sage-700 via-sage-800 to-sage-900 text-bronze-300 flex items-center justify-center font-black text-3xl shadow-soft">
                  {i + 1}
                </div>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-2 relative z-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="p-2.5 bg-bronze-50 rounded-xl shadow-soft">
                    <Icon className="w-6 h-6 text-bronze-600" strokeWidth={2} aria-hidden />
                  </div>
                  <h2 className="text-2xl font-bold text-sage-900">{title}</h2>
                </div>
                <p className="text-sage-700 leading-relaxed text-base pl-[3.25rem]">{body}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Typography Showcase Card */}
        <div className="relative group mb-16">
          <div className="absolute -inset-2 bg-gradient-to-r from-bronze-400/25 via-sage-400/20 to-bronze-400/25 rounded-[2.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <div className="relative bg-gradient-to-br from-sand-50 via-white to-sage-50/40 p-12 rounded-[2.5rem] border-2 border-sage-200/50 shadow-soft-lg overflow-hidden">
            {/* Decorative header */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-3 h-3 rounded-full bg-bronze-400/40"></div>
              <div className="p-3 bg-white rounded-xl shadow-soft">
                <Sparkles className="w-7 h-7 text-bronze-500" strokeWidth={2} />
              </div>
              <div className="w-3 h-3 rounded-full bg-bronze-400/40"></div>
            </div>

            <h3 className="text-center text-sm font-bold text-sage-900 uppercase tracking-[0.2em] mb-8">
              Traditional Indo-Pak Fonts
            </h3>

            {/* Font showcase */}
            <div className="space-y-8 mb-10">
              <div className="bg-white/60 rounded-2xl p-6 border border-sage-200/40">
                <span className="text-[10px] font-bold text-bronze-600 uppercase tracking-widest block mb-3">
                  Primary Arabic
                </span>
                <p className="text-lg text-sage-700 leading-relaxed">
                  <strong className="text-sage-900">Al Qalam Quran</strong>,{' '}
                  <strong className="text-sage-900">PDMS Saleem QuranFont</strong>,{' '}
                  <strong className="text-sage-900">Al Majeed Quranic</strong>, and{' '}
                  <strong className="text-sage-900">Hafs</strong> — authentic Indo-Pak Mushaf calligraphy
                  with complete harakat, shadda, maddah, and pause marks.
                </p>
              </div>

              <div className="bg-gradient-to-br from-bronze-50 to-sand-50 rounded-2xl p-6 border border-bronze-200/40">
                <span className="text-[10px] font-bold text-bronze-600 uppercase tracking-widest block mb-3">
                  Urdu & Nastaliq
                </span>
                <p className="text-lg text-sage-700 leading-relaxed">
                  <strong className="text-sage-900">Nafees Nastaleeq</strong> and{' '}
                  <strong className="text-sage-900">Noto Nastaliq Urdu</strong> for traditional Urdu
                  calligraphic rendering.
                </p>
              </div>
            </div>

            {/* Sample Arabic rendering */}
            <div className="bg-white rounded-2xl p-8 border-2 border-sage-200/30 shadow-soft">
              <p
                dir="rtl"
                lang="ar"
                className="arabic-indopak text-sage-900 text-center"
                style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', lineHeight: '2.4' }}
              >
                ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ
              </p>
              <p className="text-center text-[10px] text-sage-400 font-semibold uppercase tracking-widest mt-4">
                Al-Fatiha · With full tashkeel
              </p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
          <Link
            href="/"
            className="group relative inline-flex items-center justify-center px-12 py-4 rounded-full bg-gradient-to-r from-bronze-500 via-bronze-600 to-bronze-500 text-white font-semibold hover:from-bronze-600 hover:to-bronze-700 transition-all shadow-soft-lg hover:shadow-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
            <span className="relative z-10 uppercase tracking-wide">Start scanning</span>
          </Link>
          <Link
            href="/result"
            className="inline-flex items-center justify-center px-12 py-4 rounded-full bg-white text-sage-800 border-2 border-sage-200 font-semibold hover:bg-sage-50 hover:border-sage-300 transition-all shadow-soft hover:shadow-soft-lg uppercase tracking-wide"
          >
            View sample result
          </Link>
        </div>
      </div>
    </div>
  )
}
