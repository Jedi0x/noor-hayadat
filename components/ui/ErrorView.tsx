import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'

interface ErrorViewProps {
  error: string
  onRetry?: () => void
}

export const ErrorView: React.FC<ErrorViewProps> = ({ error, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto p-10 bg-white border-2 border-sage-300/50 rounded-[2rem] text-center space-y-6 shadow-soft-lg"
    >
      {/* Icon */}
      <div className="relative mx-auto w-fit">
        <div className="absolute inset-0 bg-red-400/20 rounded-full blur-xl"></div>
        <div className="relative bg-gradient-to-br from-red-50 to-red-100 p-5 rounded-full shadow-soft">
          <AlertCircle className="w-10 h-10 text-red-600" strokeWidth={2} />
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3">
        <h3 className="text-xl font-bold text-sage-900 uppercase tracking-wide">Analysis failed</h3>
        <p className="text-sage-700 font-medium text-sm leading-relaxed max-w-sm mx-auto">
          {error}
        </p>
      </div>

      {/* Retry Button */}
      {onRetry && (
        <button
          onClick={onRetry}
          className="group flex items-center justify-center gap-2 mx-auto px-8 py-3.5 bg-gradient-to-r from-sage-700 to-sage-900 text-white rounded-full font-semibold text-sm uppercase tracking-wide hover:from-sage-800 hover:to-sage-950 transition-all shadow-soft-lg hover:shadow-2xl"
        >
          <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" strokeWidth={2.5} />
          Try again
        </button>
      )}
    </motion.div>
  )
}
