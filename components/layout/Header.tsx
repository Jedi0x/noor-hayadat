import React from 'react'
import Link from 'next/link'
import { BookmarkIcon } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-sage-200/50 bg-sand-50/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-bronze-400/20 rounded-2xl blur-lg group-hover:bg-bronze-400/30 transition-all"></div>
            <div className="relative bg-gradient-to-br from-sage-700 to-sage-900 p-2.5 rounded-2xl shadow-soft group-hover:shadow-soft-lg transition-all duration-300">
              <BookmarkIcon className="w-6 h-6 text-bronze-300" strokeWidth={2.5} />
            </div>
          </div>
          
          {/* Brand */}
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-sage-900 tracking-tight leading-none">
              QuranScan
            </span>
            <span className="text-[10px] font-semibold text-bronze-600 uppercase tracking-[0.15em] mt-0.5">
              Traditional Mushaf Typography
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav>
          <Link
            href="/how-it-works"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-sage-700 bg-white/60 border border-sage-200 hover:bg-white hover:text-sage-900 hover:border-sage-300 hover:shadow-soft transition-all duration-200"
          >
            How it works
          </Link>
        </nav>
      </div>
    </header>
  )
}
