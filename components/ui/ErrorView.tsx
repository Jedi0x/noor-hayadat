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
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto p-8 bg-red-500/5 border border-red-500/10 rounded-3xl text-center space-y-4"
    >
      <div className="bg-red-500/10 p-4 rounded-full w-fit mx-auto">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      
      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-red-600 uppercase tracking-tight">Analysis Error</h3>
        <p className="text-red-500/80 font-medium text-sm">{error}</p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-6 flex items-center justify-center space-x-2 mx-auto px-8 py-2.5 bg-red-600 text-white rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-all active:scale-95 shadow-lg shadow-red-600/20"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Try Again
        </button>
      )}
    </motion.div>
  )
}
