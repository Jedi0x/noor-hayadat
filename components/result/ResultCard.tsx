'use client'

import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { ArabicDisplay } from './ArabicDisplay'
import { EnglishTransliteration } from './EnglishTransliteration'
import { UrduTranslation } from './UrduTranslation'
import { ReferenceBar } from './ReferenceBar'
import { ActionBar } from './ActionBar'
import { ConfidenceBadge } from './ConfidenceBadge'
import { AnalyzeResponse } from '@/types'

export const ResultCard: React.FC<{ result: AnalyzeResponse }> = ({ result }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleCopyArabic = () => {
    navigator.clipboard.writeText(result.arabic_indopak)
  }

  const handleCopyUrdu = () => {
    const text = result.urdu_translation?.trim()
    if (text) navigator.clipboard.writeText(text)
  }

  const handleDownload = async () => {
    if (!cardRef.current) return

    // Wait for all fonts to be fully loaded before capture
    await document.fonts.ready

    // Force-load the Arabic & Urdu fonts used on the card
    const fontFacesToLoad = [
      'Al Qalam Quran',
      'PDMS Saleem QuranFont',
      'Al Majeed Quranic',
      'Hafs',
      'Amiri Quran',
      'Nafees Nastaleeq',
      'Noto Nastaliq Urdu',
    ]
    await Promise.allSettled(
      fontFacesToLoad.map((f) =>
        document.fonts.load(`400 48px "${f}"`, 'بِسۡمِ ٱللَّهِ')
      )
    )

    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 3,
      backgroundColor: '#FDFBF7',
      logging: false,
      allowTaint: false,
      onclone: (clonedDoc) => {
        // Ensure cloned document inherits all font-face declarations
        const styleSheets = Array.from(document.styleSheets)
        styleSheets.forEach((sheet) => {
          try {
            const rules = Array.from(sheet.cssRules || [])
            const fontRules = rules
              .filter((r) => r instanceof CSSFontFaceRule)
              .map((r) => r.cssText)
              .join('\n')
            if (fontRules) {
              const style = clonedDoc.createElement('style')
              style.textContent = fontRules
              clonedDoc.head.appendChild(style)
            }
          } catch {
            // cross-origin stylesheet — skip
          }
        })
      },
    })
    const link = document.createElement('a')
    link.download = `quranscan-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }

  const handleShare = async () => {
    const parts = [
      result.arabic_indopak,
      result.transliteration ? `\n${result.transliteration}` : '',
      result.english_translation ? `\n${result.english_translation}` : '',
      result.urdu_translation?.trim() ? `\n\n${result.urdu_translation}` : '',
      `\n\nReference: ${JSON.stringify(result.reference)}`,
    ]
    const text = parts.join('')
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuranScan Result',
          text,
          url: window.location.href,
        })
      } catch (e) {
        console.error('Share failed:', e)
      }
    } else {
      handleCopyUrdu()
    }
  }

  /** Transliteration, translations, notes (reference lives in top header row) */
  const hasDetailsSection =
    Boolean(result.transliteration?.trim()) ||
    Boolean(result.english_translation?.trim()) ||
    Boolean(result.urdu_translation?.trim()) ||
    Boolean(result.notes?.trim()) ||
    Boolean(result.benefits?.trim())

  const showReferenceHeader = Boolean(result.reference)

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Main Card - Traditional Mushaf Design */}
      <div
        ref={cardRef}
        className="relative bg-gradient-to-b from-white via-sand-50/20 to-white rounded-[3.5rem] p-12 sm:p-16 lg:p-20 shadow-2xl border-3 border-sage-200/40 overflow-hidden"
      >
        {/* Decorative border frame (like traditional Mushaf margins) */}
        <div className="absolute inset-6 rounded-[3rem] border-2 border-bronze-300/15 pointer-events-none"></div>
        <div className="absolute inset-10 rounded-[2.5rem] border border-bronze-200/10 pointer-events-none"></div>

        {/* Background ornamental pattern */}
        <div className="absolute inset-0 opacity-[0.012] pointer-events-none">
          <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gradient-to-bl from-bronze-400 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-gradient-to-tr from-sage-400 to-transparent"></div>
        </div>

        <div className="relative z-10">
          {/* Top row: Reference (left) · Verified badge (right) */}
          <div
            className={`flex items-center gap-4 pb-8 mb-8 border-b-2 border-sage-200/40 ${
              showReferenceHeader ? 'justify-between' : 'justify-end'
            }`}
          >
            {showReferenceHeader ? (
              <div className="min-w-0 flex-1">
                <ReferenceBar reference={result.reference} />
              </div>
            ) : null}
            <div className="shrink-0">
              <ConfidenceBadge level={result.confidence ?? 'LOW'} />
            </div>
          </div>

          {/* Main Arabic Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-14"
          >
            <ArabicDisplay text={result.arabic_indopak} />
          </motion.div>

          {/* Details below Arabic (reference is in header) */}
          {hasDetailsSection ? (
            <div className="space-y-12 border-t-2 border-sage-200/50 pt-14">
              {/* English Transliteration & Meaning */}
              <EnglishTransliteration
                embedded
                transliteration={result.transliteration}
                englishMeaning={result.english_translation}
              />

              {/* Urdu Translation */}
              {result.urdu_translation?.trim() ? (
                <UrduTranslation embedded text={result.urdu_translation} />
              ) : null}

              {/* Notes */}
              {result.notes?.trim() ? (
                <div className="bg-white/80 rounded-[2rem] p-7 border-2 border-sage-200/30 shadow-soft">
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-sage-600 block mb-4">
                    Notes
                  </span>
                  <p className="text-base text-sage-700 leading-relaxed">{result.notes}</p>
                </div>
              ) : null}

              {/* Benefits */}
              {result.benefits?.trim() ? (
                <div className="relative overflow-hidden rounded-[2rem] p-9 border-2 border-bronze-200/40 shadow-soft">
                  <div className="absolute inset-0 bg-gradient-to-br from-bronze-50 via-sand-50/50 to-bronze-50/30"></div>
                  <div className="relative z-10">
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-700 block mb-5">
                      Benefits &amp; Virtues
                    </span>
                    <p dir="rtl" className="urdu-text text-sage-800 text-base leading-[2.8]">
                      {result.benefits}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {/* Footer Watermark with decorative elements */}
          <div className="pt-16 mt-4 flex flex-col items-center gap-3 opacity-25">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-sage-400 to-transparent"></div>
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-sage-900 text-center">
              QuranScan
            </span>
            <span className="text-[9px] font-medium text-sage-600">
              Authentic Indo-Pak Typography
            </span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="mt-14">
        <ActionBar
          onCopyArabic={handleCopyArabic}
          onCopyUrdu={handleCopyUrdu}
          onDownload={handleDownload}
          onShare={handleShare}
          onListen={() => {}}
          audioUrl={result.audio_url}
        />
      </div>
    </div>
  )
}
