import React from 'react'
import { Facebook, Twitter, Instagram, Mail, Bookmark } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-emerald-950 text-cream-50 pt-20 pb-10 mt-auto relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 w-full mb-16">
          <div className="flex flex-col items-center md:items-start space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <Bookmark className="w-5 h-5 text-gold-500" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">QuranScan</span>
            </div>
            <p className="text-cream-50/50 leading-relaxed font-medium text-sm text-center md:text-left max-w-xs">
              The world's most advanced identification system for Quranic verses, Hadith, and Islamic Azkar. 
              Verified, accurate, and dignified.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-6">
            <h4 className="font-bold uppercase tracking-[0.2em] text-gold-500/80 text-[10px]">Navigation</h4>
            <div className="flex flex-col items-center space-y-4 text-sm font-bold text-cream-50/60">
              <a href="#" className="hover:text-gold-500 transition-colors">Home</a>
              <a href="#" className="hover:text-gold-500 transition-colors">How it works</a>
              <a href="#" className="hover:text-gold-500 transition-colors">About Us</a>
              <a href="#" className="hover:text-gold-500 transition-colors">Contact</a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-6">
            <h4 className="font-bold uppercase tracking-[0.2em] text-gold-500/80 text-[10px]">Connect</h4>
            <div className="flex space-x-4">
              <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1">
                <Mail className="w-5 h-5 text-gold-500" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1">
                <Facebook className="w-5 h-5 text-gold-500" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1">
                <Twitter className="w-5 h-5 text-gold-500" />
              </a>
              <a href="#" className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5 text-gold-500" />
              </a>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-white/5 pt-10 flex flex-col sm:flex-row items-center justify-between text-[10px] font-bold uppercase tracking-[0.1em] text-cream-50/20">
          <p>© {new Date().getFullYear()} QuranScan.app | All Rights Reserved</p>
          <div className="flex items-center space-x-8 mt-6 sm:mt-0">
            <a href="#" className="hover:text-gold-500 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
