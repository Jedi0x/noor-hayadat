'use client'

import React from 'react'
import { motion } from 'framer-motion'

export const ScanningOverlay: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden" aria-hidden="true">
      {/* Scanning line with subtle glow */}
      <motion.div
        initial={{ top: '0%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-bronze-400 to-transparent shadow-[0_0_25px_rgba(168,130,79,0.6)] z-20"
      />

      {/* Trailing light effect */}
      <motion.div
        initial={{ top: '-25%' }}
        animate={{ top: '100%' }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute left-0 right-0 h-[25%] bg-gradient-to-b from-bronze-500/8 to-transparent z-10"
      />

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(circle,rgb(168,130,79)_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(42,47,36,0.15)_100%)]" />

      {/* Gentle pulse overlay */}
      <motion.div
        animate={{
          opacity: [0, 0.05, 0]
        }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 bg-bronze-400"
      />
    </div>
  )
}
