'use client'

import React from 'react'
import { ResultCard } from '@/components/result/ResultCard'
import { IslamicPattern } from '@/components/ui/IslamicPattern'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
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
    <div className="relative flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <IslamicPattern className="absolute inset-0 opacity-[0.03] pointer-events-none" />

      <header className="w-full max-w-4xl flex items-center justify-between mb-12 relative z-10">
        <Link
          href="/"
          className="flex items-center text-emerald-950/60 hover:text-emerald-950 transition-colors font-bold uppercase tracking-widest text-xs group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to scan
        </Link>

        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-black text-emerald-950 tracking-tight">Identification Result</h2>
          <span className="text-[10px] font-bold text-gold-600 uppercase tracking-[0.2em] mt-1 text-center">
            Verified by AI
          </span>
        </div>

        <div className="w-24" />
      </header>

      <main className="w-full relative z-10 mb-20">
        {!mounted ? (
          <div className="max-w-3xl mx-auto h-64 rounded-[2rem] bg-emerald-950/5 animate-pulse" />
        ) : result ? (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {result.cached && (
              <p className="text-center text-xs text-emerald-800/60 mb-4 font-medium">
                Loaded from cache (same image was scanned before)
              </p>
            )}
            <ResultCard result={result} />
          </motion.div>
        ) : (
          <div className="max-w-xl mx-auto text-center rounded-[2rem] border border-emerald-950/10 bg-white/80 p-12 shadow-lg">
            <p className="text-emerald-950 font-semibold mb-2">No scan result here yet</p>
            <p className="text-emerald-900/60 text-sm mb-8">
              Upload an image on the home page and run a scan — the result will appear here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-gold-500 text-emerald-950 font-bold hover:bg-gold-400 transition-colors"
            >
              Go to scan
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
