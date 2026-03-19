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
    navigator.clipboard.writeText(result.urdu_translation)
  }

  const handleDownload = async () => {
    if (!cardRef.current) return
    const html2canvas = (await import('html2canvas')).default
    const canvas = await html2canvas(cardRef.current, {
      useCORS: true,
      scale: 2,
      backgroundColor: '#FFFDF6'
    })
    const link = document.createElement('a')
    link.download = `quranscan-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const handleShare = async () => {
    const parts = [
      result.arabic_indopak,
      result.transliteration ? `\n${result.transliteration}` : '',
      result.english_translation ? `\n${result.english_translation}` : '',
      result.urdu_translation ? `\n\n${result.urdu_translation}` : '',
      `\n\nReference: ${JSON.stringify(result.reference)}`,
    ]
    const text = parts.join('')
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'QuranScan Result',
          text,
          url: window.location.href
        })
      } catch (e) {
        console.error('Share failed:', e)
      }
    } else {
      handleCopyUrdu()
    }
  }

  /* Keep header outside Framer Motion — wrapping ReferenceBar in motion.div can trigger
     "Cannot update HotReload while rendering ReferenceBar" in dev (nested updates). */
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div
        ref={cardRef}
        className="bg-cream-100 rounded-[2rem] p-8 sm:p-12 shadow-2xl border border-emerald-950/5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-bl-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-emerald-950/10 pb-6">
            <ReferenceBar reference={result.reference} />
            <ConfidenceBadge level={result.confidence ?? 'LOW'} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-8 pt-8"
          >
            <ArabicDisplay text={result.arabic_indopak} />

            <EnglishTransliteration
              transliteration={result.transliteration}
              englishMeaning={result.english_translation}
            />

            <UrduTranslation text={result.urdu_translation} />

            {result.benefits && (
              <div className="bg-gold-500/5 p-4 rounded-xl border border-gold-500/10">
                <p dir="rtl" className="urdu-text text-sm text-emerald-950/60 leading-relaxed italic">
                  {result.benefits}
                </p>
              </div>
            )}

            <div className="pt-8 flex items-center justify-center opacity-30">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-950">
                QuranScan Premium Identification
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="mt-8">
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
