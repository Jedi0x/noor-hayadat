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
import { SCAN_RESULT_STORAGE_KEY } from '@/lib/scan-result-storage'

export default function Home() {
  const [file, setFile] = React.useState<File | null>(null)
  const [cropFile, setCropFile] = React.useState<string | null>(null)
  const { analyze, isAnalyzing, error, result, reset, currentStep } = useAnalyze()
  const router = useRouter()

  React.useEffect(() => {
    if (!result) return
    try {
      sessionStorage.setItem(SCAN_RESULT_STORAGE_KEY, JSON.stringify(result))
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
    <div className="relative min-h-screen bg-cream-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Decorative Pattern */}
      <IslamicPattern className="absolute inset-0 opacity-[0.03] pointer-events-none" />

      {cropFile && (
        <ImageCropper 
          imageSrc={cropFile} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setCropFile(null)} 
        />
      )}

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative z-10"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-emerald-950 mb-4 tracking-tight">
          QuranScan
        </h1>
        <p className="text-xl sm:text-2xl text-emerald-900/70 font-medium">
          Identify Ayat, Hadith, & Azkar instantly
        </p>
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
                  className="mt-8 flex justify-center"
                >
                  <button
                    onClick={handleScan}
                    className="px-12 py-4 bg-gold-500 text-emerald-950 rounded-full text-xl font-bold shadow-xl hover:bg-gold-400 transform transition-all active:scale-95"
                  >
                    Start Scanning
                  </button>
                </motion.div>
              )}

              {error && (
                <div className="mt-8">
                  <ErrorView error={error} onRetry={handleScan} />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="scanning-ui"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mt-12 space-y-12"
            >
              <div className="relative w-full max-w-xl mx-auto rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scanPreviewUrl || ''}
                  alt="Scanning"
                  className="w-full h-auto max-h-[50vh] object-contain bg-emerald-950/5"
                />
                <div className="absolute inset-0 bg-emerald-950/10 backdrop-blur-[2px]" />
                
                {/* Scanning Line Animation */}
                <motion.div
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute left-0 right-0 h-1 bg-gold-500 shadow-[0_0_25px_rgba(201,168,76,1)] z-20"
                />
                
                {/* Scan Overlay Gradient */}
                <motion.div
                  initial={{ top: '-50%' }}
                  animate={{ top: '100%' }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute left-0 right-0 h-[50%] bg-gradient-to-b from-transparent to-gold-500/20 z-10"
                />
              </div>
              
              <div className="w-full max-w-md mx-auto">
                <ProgressSteps currentStep={currentStep} />
                
                {/* Progress Bar */}
                <div className="mt-8 bg-white/50 backdrop-blur-sm p-2 rounded-full border border-emerald-950/5 shadow-inner">
                  <div className="h-2 bg-emerald-950/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-gold-500 shadow-[0_0_10px_rgba(201,168,76,0.5)]"
                      animate={{ width: `${(currentStep / 4) * 100}%` }}
                      transition={{ type: "spring", stiffness: 50 }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Example Preview Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-24 w-full max-w-4xl text-center"
      >
        <h2 className="text-2xl font-bold text-emerald-950 mb-12 opacity-40 uppercase tracking-widest">Premium Output</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 px-4 opacity-40 grayscale pointer-events-none">
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/10 h-64 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <div className="w-3/4 h-4 bg-emerald-950/10 rounded-full" />
            <div className="w-1/2 h-4 bg-emerald-950/5 rounded-full" />
            <div className="w-full h-24 bg-emerald-950/5 rounded-2xl" />
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-emerald-950/10 h-64 flex flex-col items-center justify-center space-y-4 shadow-xl">
            <div className="w-3/4 h-4 bg-emerald-950/10 rounded-full" />
            <div className="w-1/2 h-4 bg-emerald-950/5 rounded-full" />
            <div className="w-full h-24 bg-emerald-950/5 rounded-2xl" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
