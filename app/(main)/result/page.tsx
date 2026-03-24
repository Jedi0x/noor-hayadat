'use client'

import React from 'react'
import { ResultCard } from '@/components/result/ResultCard'
import { IslamicPattern } from '@/components/ui/IslamicPattern'
import { motion } from 'framer-motion'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { AnalyzeResponse } from '@/types'
import { SCAN_RESULT_STORAGE_KEY } from '@/lib/scan-result-storage'

export default function ResultPage() {
  const [result, setResult] = React.useState<AnalyzeResponse | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    try {
      const raw = sessionStorage.getItem(SCAN_RESULT_STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AnalyzeResponse
        setResult(parsed)
      }
    } catch (e) {
      console.error('Failed to read scan result:', e)
    }
  }, [])

  return (
    <div className="relative flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden min-h-screen">
      <IslamicPattern className="absolute inset-0 opacity-[0.015] pointer-events-none text-bronze-300" />

      <div className="w-full max-w-5xl relative z-10">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-20"
        >
          <Link
            href="/"
            className="group flex items-center gap-2 text-sage-600 hover:text-sage-900 transition-colors font-semibold uppercase tracking-wide text-sm"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" strokeWidth={2.5} />
            Back to scan
          </Link>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-bronze-500" strokeWidth={2} />
              <h1 className="text-3xl sm:text-4xl font-bold text-sage-900 tracking-tight">
                Your result
              </h1>
            </div>
            <span className="text-[10px] font-semibold text-bronze-600 uppercase tracking-[0.2em] mt-2">
              Verified by AI
            </span>
          </div>

          <div className="w-24 hidden sm:block" />
        </motion.header>

        {/* Main Content */}
        <main>
          {!mounted ? (
            <div className="max-w-4xl mx-auto h-[40rem] rounded-[3rem] bg-sage-100/30 animate-pulse shadow-soft" />
          ) : result ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {result.cached && (
                <div className="text-center mb-8">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-sage-100 text-sage-700 rounded-full text-xs font-medium border border-sage-200 shadow-soft">
                    <span className="w-2 h-2 rounded-full bg-sage-500 animate-pulse"></span>
                    Loaded from cache (same image scanned before)
                  </span>
                </div>
              )}
              <ResultCard result={result} />
            </motion.div>
          ) : (
            <div className="max-w-lg mx-auto text-center rounded-[3rem] border-2 border-sage-200 bg-white/80 backdrop-blur-sm p-16 shadow-soft-lg">
              <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-bronze-100 to-sand-100 flex items-center justify-center shadow-soft">
                <Sparkles className="w-10 h-10 text-bronze-600" strokeWidth={2} />
              </div>
              <p className="text-sage-900 font-bold text-xl mb-4">No scan result found</p>
              <p className="text-sage-600 text-sm mb-10 leading-relaxed max-w-xs mx-auto">
                Upload an image on the home page and run a scan—your result will appear here.
              </p>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-gradient-to-r from-bronze-500 to-bronze-600 text-white font-semibold hover:from-bronze-600 hover:to-bronze-700 transition-all shadow-soft-lg hover:shadow-2xl"
              >
                Start scanning
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
