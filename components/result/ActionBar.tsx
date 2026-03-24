'use client'

import React, { useRef, useState } from 'react'
import { Copy, Download, Share2, Volume2, Check } from 'lucide-react'

interface ActionBarProps {
  onCopyArabic: () => void
  onCopyUrdu: () => void
  onDownload: () => void
  onShare: () => void
  onListen: () => void
  audioUrl?: string
}

export const ActionBar: React.FC<ActionBarProps> = ({
  onCopyArabic,
  onCopyUrdu,
  onDownload,
  onShare,
  onListen,
  audioUrl,
}) => {
  const [copied, setCopied] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleCopy = (type: 'ar' | 'ur') => {
    if (type === 'ar') onCopyArabic()
    else onCopyUrdu()
    setCopied(type)
    setTimeout(() => setCopied(null), 2500)
  }

  const toggleAudio = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {audioUrl && (
        <>
          <audio
            ref={audioRef}
            src={audioUrl}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          />
          <button
            onClick={toggleAudio}
            className={`group flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm transition-all duration-300 shadow-soft hover:shadow-soft-lg ${
              isPlaying
                ? 'bg-sage-900 text-white border-2 border-sage-900'
                : 'bg-white text-sage-800 border-2 border-sage-200 hover:bg-sage-50 hover:border-sage-300'
            }`}
          >
            <Volume2 className={`w-5 h-5 ${isPlaying ? 'animate-pulse text-bronze-300' : ''}`} strokeWidth={2} />
            <span className="uppercase tracking-wide">
              {isPlaying ? 'Playing...' : 'Listen'}
            </span>
          </button>
        </>
      )}

      <button
        onClick={() => handleCopy('ar')}
        className="group flex items-center gap-2.5 px-7 py-3.5 bg-white text-sage-800 border-2 border-sage-200 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-sage-50 hover:border-sage-300 transition-all shadow-soft hover:shadow-soft-lg"
      >
        {copied === 'ar' ? (
          <Check className="w-5 h-5 text-sage-600" strokeWidth={2.5} />
        ) : (
          <Copy className="w-5 h-5 text-sage-600" strokeWidth={2} />
        )}
        Copy Arabic
      </button>

      <button
        onClick={() => handleCopy('ur')}
        className="group flex items-center gap-2.5 px-7 py-3.5 bg-white text-sage-800 border-2 border-sage-200 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-sage-50 hover:border-sage-300 transition-all shadow-soft hover:shadow-soft-lg"
      >
        {copied === 'ur' ? (
          <Check className="w-5 h-5 text-sage-600" strokeWidth={2.5} />
        ) : (
          <Copy className="w-5 h-5 text-sage-600" strokeWidth={2} />
        )}
        Copy Urdu
      </button>

      <button
        onClick={onDownload}
        className="group flex items-center gap-2.5 px-7 py-3.5 bg-white text-sage-800 border-2 border-sage-200 rounded-full text-sm font-semibold uppercase tracking-wide hover:bg-sage-50 hover:border-sage-300 transition-all shadow-soft hover:shadow-soft-lg"
      >
        <Download className="w-5 h-5 text-sage-600" strokeWidth={2} />
        Download
      </button>

      <button
        onClick={onShare}
        className="group relative flex items-center gap-2.5 px-9 py-3.5 bg-gradient-to-r from-bronze-500 to-bronze-600 text-white rounded-full text-sm font-bold uppercase tracking-[0.15em] hover:from-bronze-600 hover:to-bronze-700 transition-all shadow-soft-lg hover:shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300"></div>
        <Share2 className="w-5 h-5 relative z-10" strokeWidth={2} />
        <span className="relative z-10">Share</span>
      </button>
    </div>
  )
}
