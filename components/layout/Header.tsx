import React from 'react'
import Link from 'next/link'
import { Bookmark } from 'lucide-react'

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between relative z-50">
      <Link href="/" className="flex items-center space-x-3 group">
        <div className="bg-emerald-950 p-2.5 rounded-2xl group-hover:bg-emerald-900 transition-all duration-300 shadow-lg group-hover:shadow-emerald-950/20 group-hover:-translate-y-0.5">
          <Bookmark className="w-6 h-6 text-gold-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-emerald-950 tracking-tight leading-none">QuranScan</span>
          <span className="text-[10px] font-bold text-gold-600 uppercase tracking-[0.2em] mt-1">Premium Identification</span>
        </div>
      </Link>

      <nav className="flex items-center space-x-8">
        <Link 
          href="/favorites" 
          className="text-xs font-bold text-emerald-950/40 hover:text-emerald-950 transition-all uppercase tracking-widest hidden sm:block hover:translate-y-[-1px]"
        >
          Saved Items
        </Link>
        <button className="bg-white text-emerald-950 px-6 py-2.5 rounded-full text-xs font-bold hover:bg-emerald-950 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md border border-emerald-950/5">
          How it works
        </button>
      </nav>
    </header>
  )
}
