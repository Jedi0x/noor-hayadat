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
  audioUrl 
}) => {
  const [copied, setCopied] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleCopy = (type: 'ar' | 'ur') => {
    if (type === 'ar') onCopyArabic()
    else onCopyUrdu()
    setCopied(type)
    setTimeout(() => setCopied(null), 2000)
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
    <div className="flex flex-wrap items-center justify-center gap-3 pt-8 border-t border-emerald-950/10">
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
            className={`flex items-center px-6 py-2.5 rounded-full border transition-all duration-300 ${
              isPlaying ? 'bg-emerald-950 text-cream-50' : 'bg-white text-emerald-950 border-emerald-950/10 hover:bg-emerald-950/5'
            }`}
          >
            <Volume2 className={`w-4 h-4 mr-2 ${isPlaying ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-bold uppercase tracking-widest">{isPlaying ? 'Playing' : 'Listen'}</span>
          </button>
        </>
      )}

      <button
        onClick={() => handleCopy('ar')}
        className="flex items-center px-6 py-2.5 bg-white text-emerald-950 border border-emerald-950/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-950/5 transition-all"
      >
        {copied === 'ar' ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
        Copy Arabic
      </button>

      <button
        onClick={() => handleCopy('ur')}
        className="flex items-center px-6 py-2.5 bg-white text-emerald-950 border border-emerald-950/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-950/5 transition-all"
      >
        {copied === 'ur' ? <Check className="w-4 h-4 mr-2 text-green-600" /> : <Copy className="w-4 h-4 mr-2" />}
        Copy Urdu
      </button>

      <button
        onClick={onDownload}
        className="flex items-center px-6 py-2.5 bg-white text-emerald-950 border border-emerald-950/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-emerald-950/5 transition-all"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </button>

      <button
        onClick={onShare}
        className="flex items-center px-8 py-2.5 bg-emerald-950 text-cream-50 rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-emerald-900 transition-all shadow-lg shadow-emerald-950/20"
      >
        <Share2 className="w-4 h-4 mr-2 text-gold-500" />
        Share
      </button>
    </div>
  )
}
