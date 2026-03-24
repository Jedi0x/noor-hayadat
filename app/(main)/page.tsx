'use client'

import React from 'react'
import { DropZone } from '@/components/upload/DropZone'
import { IslamicPattern } from '@/components/ui/IslamicPattern'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalyze } from '@/hooks/useAnalyze'
import { ProgressSteps } from '@/components/scanner/ProgressSteps'
import { ImageCropper } from '@/components/upload/ImageCropper'
import { ErrorView } from '@/components/ui/ErrorView'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SCAN_RESULT_STORAGE_KEY, HAS_COMPLETED_SCAN_KEY } from '@/lib/scan-result-storage'

export default function Home() {
  const [file, setFile] = React.useState<File | null>(null)
  const [cropFile, setCropFile] = React.useState<string | null>(null)
  const [showPremiumOutput, setShowPremiumOutput] = React.useState(false)
  const { analyze, isAnalyzing, error, result, reset, currentStep } = useAnalyze()
  const router = useRouter()

  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem(HAS_COMPLETED_SCAN_KEY) === '1') {
        setShowPremiumOutput(true)
      }
    } catch {
      /* ignore */
    }
  }, [])

  React.useEffect(() => {
    if (!result) return
    try {
      sessionStorage.setItem(SCAN_RESULT_STORAGE_KEY, JSON.stringify(result))
      sessionStorage.setItem(HAS_COMPLETED_SCAN_KEY, '1')
      setShowPremiumOutput(true)
    } catch (e) {
      console.error('Could not store scan result:', e)
    }
    const t = setTimeout(() => router.push('/result'), 500)
    return () => clearTimeout(t)
  }, [result, router])

  const handleFileSelect = (f: File) => {
    setFile(f)
    setCropFile(URL.createObjectURL(f))
  }

  const handleCropComplete = (blob: Blob) => {
    const croppedFile = new File([blob], file?.name || 'image.jpg', { type: 'image/jpeg' })
    setFile(croppedFile)
    setCropFile(null)
  }

  const handleScan = () => {
    if (!file) return
    analyze(file)
  }

  const scanPreviewUrl = React.useMemo(() => {
    if (!file || !isAnalyzing) return null
    return URL.createObjectURL(file)
  }, [file, isAnalyzing])

  React.useEffect(() => {
    return () => {
      if (scanPreviewUrl) URL.revokeObjectURL(scanPreviewUrl)
    }
  }, [scanPreviewUrl])

  return (
    <div className="relative min-h-screen flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Subtle background pattern */}
      <IslamicPattern className="absolute inset-0 opacity-[0.015] pointer-events-none text-bronze-300" />

      {cropFile && (
        <ImageCropper
          imageSrc={cropFile}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropFile(null)}
        />
      )}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="text-center mb-20 max-w-4xl relative z-10"
      >
        {/* Main title with decorative line */}
        <div className="relative inline-block mb-8">
          <h1 className="text-7xl sm:text-8xl font-bold text-sage-900 tracking-tight relative z-10">
            QuranScan
          </h1>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-bronze-400 to-transparent"></div>
        </div>

        {/* Subtitle */}
        <p className="text-2xl sm:text-3xl text-sage-600 font-light leading-relaxed mb-4">
          Identify Quranic verses, Hadith, and Azkar
        </p>
        
        {/* Tagline */}
        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-bronze-300"></div>
          <p className="text-sm text-bronze-600 font-medium tracking-wide">
            Traditional Mushaf typography with modern AI
          </p>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-bronze-300"></div>
        </div>
      </motion.div>

      {/* Main Action Area */}
      <div className="w-full max-w-4xl relative z-10">
        <AnimatePresence mode="wait">
          {!isAnalyzing ? (
            <motion.div
              key="upload-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DropZone
                onFileSelect={handleFileSelect}
                selectedFile={file}
                onReset={() => {
                  setFile(null)
                  reset()
                }}
                onCrop={() => setCropFile(URL.createObjectURL(file!))}
              />

              {file && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 flex justify-center"
                >
                  <button
                    onClick={handleScan}
                    className="group relative px-16 py-5 bg-gradient-to-r from-bronze-500 via-bronze-600 to-bronze-500 text-white rounded-full text-lg font-semibold shadow-soft-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                    <span className="relative z-10 uppercase tracking-wider">Start scanning</span>
                  </button>
                </motion.div>
              )}

              {error && (
                <div className="mt-10">
                  <ErrorView error={error} onRetry={handleScan} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="scanning-ui"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-16 space-y-14"
            >
              {/* Scanning Image Preview */}
              <div className="relative w-full max-w-2xl mx-auto rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/90">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scanPreviewUrl || ''}
                  alt="Scanning"
                  className="w-full h-auto max-h-[55vh] object-contain bg-sand-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-sage-900/8" />

                {/* Scanning Line */}
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-bronze-400 to-transparent shadow-[0_0_25px_rgba(168,130,79,0.8)] z-20"
                />

                {/* Scan Overlay */}
                <motion.div
                  initial={{ top: '-40%' }}
                  animate={{ top: '100%' }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="absolute left-0 right-0 h-[40%] bg-gradient-to-b from-bronze-500/12 to-transparent z-10"
                />
              </div>

              {/* Progress Steps */}
              <div className="w-full max-w-lg mx-auto">
                <ProgressSteps currentStep={currentStep} />

                {/* Progress Bar */}
                <div className="mt-12 bg-white/70 backdrop-blur-sm p-3 rounded-full border-2 border-sage-200/50 shadow-inner-soft">
                  <div className="h-2.5 bg-sand-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-bronze-600 via-bronze-500 to-bronze-600 rounded-full shadow-[0_0_15px_rgba(168,130,79,0.5)]"
                      animate={{ width: `${(currentStep / 4) * 100}%` }}
                      transition={{ type: "spring", stiffness: 60, damping: 15 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Output Section */}
      <AnimatePresence>
        {showPremiumOutput && !isAnalyzing && (
          <motion.section
            key="premium-output"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 25 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
            className="mt-40 w-full max-w-6xl"
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <div className="inline-block mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent to-bronze-400"></div>
                  <h2 className="text-4xl font-bold text-sage-900">
                    Traditional rendering
                  </h2>
                  <div className="w-16 h-px bg-gradient-to-l from-transparent to-bronze-400"></div>
                </div>
              </div>
              <p className="text-lg text-sage-600 max-w-2xl mx-auto leading-relaxed">
                Every scan produces authentic Indo-Pak Mushaf typography—
                <Link href="/result" className="text-bronze-600 font-semibold hover:text-bronze-700 underline decoration-bronze-300 underline-offset-4 hover:decoration-bronze-500 transition-all ml-1">
                  view your latest result
                </Link>
              </p>
            </div>

            {/* Sample Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Arabic Sample - Al Qalam Font */}
              <div className="group relative lg:col-span-2">
                <div className="absolute -inset-2 bg-gradient-to-r from-bronze-400/20 via-sand-400/15 to-bronze-400/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-white rounded-[2.5rem] p-12 sm:p-14 shadow-soft-lg border-2 border-sage-200/40 min-h-[22rem] flex flex-col items-center justify-center overflow-hidden">
                  {/* Decorative header line */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-bronze-300 to-transparent"></div>
                  
                  <p
                    dir="rtl"
                    lang="ar"
                    className="arabic-indopak text-sage-900 mb-8 px-6 relative z-10"
                  >
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                  </p>
                  
                  {/* Decorative footer line */}
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-bronze-300 to-transparent"></div>
                  
                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-sage-400 relative z-10">
                    Sample · With full diacritics
                  </span>
                </div>
              </div>

              {/* Details Card */}
              <div className="group relative">
                <div className="absolute -inset-2 bg-gradient-to-br from-sage-400/20 to-bronze-400/15 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <div className="relative bg-gradient-to-br from-sand-50 via-sage-50/50 to-sand-50 rounded-[2.5rem] p-10 shadow-soft border-2 border-sage-200/40 min-h-[22rem] flex flex-col justify-center">
                  <div className="space-y-7">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-2 h-2 rounded-full bg-bronze-400 mt-2"></div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-600 mb-2">
                          Reference
                        </h3>
                        <p className="text-sm text-sage-700 font-medium leading-relaxed">
                          Surah, Ayah, Book names, Hadith numbers
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-2 h-2 rounded-full bg-bronze-400 mt-2"></div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-600 mb-2">
                          Transliteration
                        </h3>
                        <p className="text-sm text-sage-700 italic leading-relaxed">
                          Latin letters for pronunciation
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 w-2 h-2 rounded-full bg-bronze-400 mt-2"></div>
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-bronze-600 mb-2">
                          Translations
                        </h3>
                        <p className="text-sm text-sage-700 leading-relaxed">
                          English meaning and Urdu translation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-sm text-sage-500 font-medium">
                Powered by Al Qalam Quran, PDMS Saleem, and Al Majeed fonts
              </p>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
