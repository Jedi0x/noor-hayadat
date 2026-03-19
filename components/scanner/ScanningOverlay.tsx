'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ScanningOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      {/* Moving scanning line with heavy glow */}
      <motion.div
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute left-0 right-0 h-1 bg-gold-500 shadow-[0_0_30px_rgba(201,168,76,1),0_0_60px_rgba(201,168,76,0.5)] z-20"
      />
      
      {/* Trailing light effect */}
      <motion.div
        initial={{ top: '-20%' }}
        animate={{ top: '100%' }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut" 
        }}
        className="absolute left-0 right-0 h-[20%] bg-gradient-to-b from-transparent to-gold-500/20 z-10"
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:20px_20px]" />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(13,59,46,0.2)_100%)]" />
      
      {/* Pulse effect overlay */}
      <motion.div
        animate={{ 
          opacity: [0, 0.1, 0] 
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-gold-500"
      />
    </div>
  )
}
